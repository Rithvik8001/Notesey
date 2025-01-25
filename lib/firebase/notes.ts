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
import type { Note } from "@/lib/types/notes";

export async function getUserNotes(userId: string) {
  const notesRef = collection(db, "notes");

  try {
    const q = query(
      notesRef,
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        title: data.title as string,
        content: data.content as string,
        userId: data.userId as string,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Note;
    });
  } catch (error) {
    console.error("Error getting notes:", error);
    throw new Error("Failed to load notes");
  }
}

export async function createNote(
  userId: string,
  note: Omit<Note, "id" | "userId">
) {
  try {
    const notesRef = collection(db, "notes");
    const noteData = {
      title: note.title,
      content: note.content,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(notesRef, noteData);

    const newNoteSnap = await getDoc(docRef);
    const newNoteData = newNoteSnap.data() as DocumentData;

    return {
      id: docRef.id,
      title: newNoteData?.title || note.title,
      content: newNoteData?.content || note.content,
      userId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    } as Note;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }
}

export async function updateNote(noteId: string, updates: Partial<Note>) {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
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
