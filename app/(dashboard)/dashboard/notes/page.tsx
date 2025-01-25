"use client";
import { useState } from "react";
import PageHeader from "@/components/dashboard/page-header";
import NotesEditor from "@/components/notes/editor";
import NotesList from "@/components/notes/notes-list";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesPage() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [showMobileList, setShowMobileList] = useState(true);

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setShowMobileList(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <PageHeader
        title="Study Notes"
        description="Take and organize your study notes with our powerful rich text editor"
        action={
          !showMobileList && (
            <button
              onClick={() => setShowMobileList(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Back to notes list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )
        }
      />
      <div className="flex-1 mt-6">
        <div className="flex h-full gap-6">
          {/* Desktop Layout */}
          <div className="hidden md:block md:w-80 md:flex-shrink-0">
            <NotesList
              selectedNoteId={selectedNoteId}
              onNoteSelect={handleNoteSelect}
            />
          </div>
          <div className="hidden md:block md:flex-1">
            <NotesEditor noteId={selectedNoteId} />
          </div>

          {/* Mobile Layout */}
          <AnimatePresence mode="wait" initial={false}>
            {showMobileList ? (
              <motion.div
                key="mobile-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full md:hidden"
              >
                <NotesList
                  selectedNoteId={selectedNoteId}
                  onNoteSelect={handleNoteSelect}
                />
              </motion.div>
            ) : (
              <motion.div
                key="mobile-editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full md:hidden"
              >
                <NotesEditor noteId={selectedNoteId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
