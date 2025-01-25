"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Plus, Trash2, X, Search } from "lucide-react";
import { getUserNotes, createNote, deleteNote } from "@/lib/firebase/notes";
import type { Note } from "@/lib/types/notes";
import { motion, AnimatePresence } from "framer-motion";

interface NotesListProps {
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
}

export default function NotesList({
  selectedNoteId,
  onNoteSelect,
}: NotesListProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const loadNotes = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userNotes = await getUserNotes(user.uid);
      setNotes(userNotes);
      setFilteredNotes(userNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
      setError("Unable to load notes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, loadNotes]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const handleCreateNote = async () => {
    if (!user) return;

    try {
      const newNote = await createNote(user.uid, {
        title: "Untitled Note",
        content: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setNotes((prev) => [newNote, ...prev]);
      onNoteSelect(newNote.id!);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete);
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
      if (selectedNoteId === noteToDelete) {
        onNoteSelect(notes[0]?.id || "");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setShowDeleteDialog(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-gray-200"
      >
        <button
          onClick={handleCreateNote}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </motion.div>

      <div className="px-4 py-2 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading notes...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No notes found" : "No notes yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`group relative flex items-center justify-between p-4 cursor-pointer transition-colors ${
                  selectedNoteId === note.id
                    ? "bg-primary-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onNoteSelect(note.id!)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNoteToDelete(note.id!);
                    setShowDeleteDialog(true);
                  }}
                  className={`p-2 text-gray-400 rounded-lg transition-colors
                    md:opacity-0 md:group-hover:opacity-100
                    hover:bg-red-50 hover:text-red-600
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                    active:bg-red-100
                    md:invisible md:group-hover:visible
                    visible opacity-100 md:hover:opacity-100`}
                  aria-label="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Note
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this note? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
