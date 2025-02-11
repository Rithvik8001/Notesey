"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { updateNote, getNote } from "@/lib/firebase/notes";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./editor/toolbar";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import type { Note } from "@/lib/types/notes";
import { Save } from "lucide-react";

const lowlight = createLowlight(common);

interface NotesEditorProps {
  noteId: string | null;
  onUpdateTags?: (tags: string[]) => void;
  onUpdateFolder?: (folder: string | null) => void;
}

export default function NotesEditor({
  noteId,
  onUpdateTags,
  onUpdateFolder,
}: NotesEditorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      setHasChanges(true);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
    enableInputRules: false,
    enablePasteRules: false,
    immediatelyRender: false,
  });

  // Load note content when noteId changes
  useEffect(() => {
    const loadNote = async () => {
      if (!noteId) {
        setTitle("");
        setContent("");
        editor?.commands.setContent("");
        return;
      }

      try {
        setLoading(true);
        const note = await getNote(noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          editor?.commands.setContent(note.content);
          setHasChanges(false);
        }
      } catch (error) {
        console.error("Failed to load note:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, editor]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user || !noteId || !hasChanges) return;

    try {
      setSaving(true);
      await updateNote(noteId, {
        title,
        content: editor?.getHTML() || "",
      });
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!noteId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full text-gray-500"
      >
        Select or create a note to start editing
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full text-gray-500"
      >
        Loading note...
      </motion.div>
    );
  }

  return (
    <motion.div
      key={noteId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-white rounded-lg border border-gray-200"
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title"
            className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
          />
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`ml-4 p-2 rounded-lg transition-colors ${
              hasChanges
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-100 text-gray-400"
            }`}
            title="Save changes"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
        <Toolbar editor={editor} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto editor-content"
        >
          <EditorContent editor={editor} />
        </motion.div>
        <AnimatePresence mode="wait">
          {saving && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-gray-500 p-4 border-t border-gray-200"
            >
              Saving changes...
            </motion.div>
          )}
          {saved && !saving && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-green-600 p-4 border-t border-gray-200"
            >
              ✓ Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
