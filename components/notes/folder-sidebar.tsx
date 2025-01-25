"use client";
import { useState } from "react";
import { Folder, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FolderSidebarProps {
  selectedFolder: string | null;
  onFolderSelect: (folder: string | null) => void;
}

export default function FolderSidebar({
  selectedFolder,
  onFolderSelect,
}: FolderSidebarProps) {
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const handleAddFolder = () => {
    if (newFolder.trim()) {
      setFolders([...folders, newFolder.trim()]);
      setNewFolder("");
      setIsAddingFolder(false);
    }
  };

  return (
    <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600">Folders</h3>
          <button
            onClick={() => setIsAddingFolder(true)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {isAddingFolder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  placeholder="New folder"
                  className="flex-1 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  onClick={handleAddFolder}
                  className="p-1 text-primary-600 hover:text-primary-700 rounded-lg hover:bg-primary-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddingFolder(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <button
            onClick={() => onFolderSelect(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              selectedFolder === null
                ? "bg-primary-50 text-primary-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Folder className="w-4 h-4" />
            All Notes
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => onFolderSelect(folder)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedFolder === folder
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Folder className="w-4 h-4" />
              {folder}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
