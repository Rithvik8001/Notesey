import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Summary {
  id?: string;
  userId: string;
  originalText: string;
  summary: string;
  title?: string;
  createdAt: Date;
}

export async function saveSummary(summary: Summary) {
  try {
    const summariesRef = collection(db, "summaries");
    const docRef = await addDoc(summariesRef, {
      ...summary,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to save summary");
  }
}

export async function getUserSummaries(userId: string) {
  try {
    const summariesRef = collection(db, "summaries");
    const q = query(
      summariesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error("Failed to load summaries");
  }
}
