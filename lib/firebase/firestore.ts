import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { app } from "./firebase";

export const db = getFirestore(app);

export interface ChatMessage {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  userId: string;
}

export async function saveChatMessage(userId: string, message: ChatMessage) {
  try {
    // Validate message size
    if (message.content.length > 10000) {
      // Firestore has a 1MB limit per document
      throw new Error("Message is too long");
    }

    const messagesRef = collection(db, "chats", userId, "messages");
    const docRef = await addDoc(messagesRef, {
      content: message.content,
      role: message.role,
      timestamp: serverTimestamp(),
      userId: userId, // Adding userId for additional security
    });

    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
    throw new Error("Failed to save message to Firestore");
  }
}

export const getChatHistory = async (userId: string) => {
  try {
    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error("Failed to load chat history");
  }
};

export async function deleteChatHistory(userId: string) {
  try {
    const messagesRef = collection(db, "chats", userId, "messages");
    const querySnapshot = await getDocs(messagesRef);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    throw new Error("Failed to clear chat history");
  }
}
