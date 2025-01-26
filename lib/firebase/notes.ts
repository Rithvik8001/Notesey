import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  doc,
  serverTimestamp,
  DocumentData,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Note, FirestoreNote } from "@/lib/types/notes";

export async function getUserNotes(userId: string): Promise<FirestoreNote[]> {
  const notesRef = collection(db, "notes");

  try {
    const q = query(
      notesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error getting notes:", error);
    throw new Error("Failed to load notes");
  }
}

export async function createNote(
  userId: string,
  note: Omit<Note, "id">
): Promise<string> {
  try {
    const notesRef = collection(db, "notes");
    const noteData = {
      title: note.title,
      content: note.content || "",
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(notesRef, noteData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }
}

export async function updateNote(noteId: string, updates: Partial<Note>) {
  try {
    const noteRef = doc(db, "notes", noteId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    if (!updateData.content && updates.content !== "") {
      updateData.content = "";
    }

    await updateDoc(noteRef, updateData);
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }
}

export async function deleteNote(noteId: string) {
  try {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note");
  }
}

export async function getNote(noteId: string): Promise<FirestoreNote | null> {
  try {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists()) {
      return null;
    }

    const data = noteSnap.data();
    return {
      id: noteSnap.id,
      title: data.title,
      content: data.content || "",
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error("Error getting note:", error);
    throw new Error("Failed to load note");
  }
}
