"use client";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import NotesList from "./notes-list";
import Editor from "./editor";

export default function NotesEditor() {
  const { user } = useAuth();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <div className="flex h-full gap-6">
      {/* Notes List Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white rounded-lg border border-gray-200">
        <NotesList
          selectedNoteId={selectedNoteId}
          onNoteSelect={setSelectedNoteId}
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200">
        <Editor noteId={selectedNoteId} />
      </div>
    </div>
  );
}
