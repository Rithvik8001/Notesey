"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import {
  getFocusTasks,
  saveFocusTask,
  updateFocusTask,
  deleteFocusTask,
} from "@/lib/firebase/timer";
import type { FocusTask, NewFocusTask } from "@/lib/types/timer";

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<FocusTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getFocusTasks(user.uid);
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.trim()) return;

    try {
      const task: NewFocusTask = {
        userId: user.uid,
        title: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      };

      await saveFocusTask(task);
      setNewTask("");
      // Reload tasks
      const updatedTasks = await getFocusTasks(user.uid);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleToggleComplete = async (task: FocusTask) => {
    if (!user) return;

    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
      };
      await updateFocusTask(updatedTask);

      // Update local state
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleEditStart = (task: FocusTask) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
  };

  const handleEditCancel = () => {
    setEditingTask(null);
    setEditedTitle("");
  };

  const handleEditSave = async (task: FocusTask) => {
    if (!user || !editedTitle.trim()) return;

    try {
      const updatedTask = {
        ...task,
        title: editedTitle.trim(),
      };
      await updateFocusTask(updatedTask);

      // Update local state
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      setEditingTask(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      await deleteFocusTask(taskId);
      // Update local state
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <CheckSquare className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Focus Tasks</h3>
      </div>

      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={!newTask.trim()}
            className="p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-500">No tasks yet</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 group"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />

              {editingTask === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(task)}
                    className="p-1 text-green-600 hover:text-green-700 shrink-0"
                    disabled={!editedTitle.trim()}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="p-1 text-gray-600 hover:text-gray-700 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={
                      task.completed
                        ? "line-through text-gray-400 flex-1 min-w-0 truncate"
                        : "flex-1 min-w-0 truncate"
                    }
                  >
                    {task.title}
                  </span>
                  <div className="flex gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditStart(task)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      aria-label="Edit task"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
