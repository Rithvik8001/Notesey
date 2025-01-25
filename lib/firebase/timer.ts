import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { FocusSession, FocusTask, NewFocusTask } from "@/lib/types/timer";

export async function saveSession(session: Omit<FocusSession, "id">) {
  try {
    const sessionsRef = collection(db, "focusSessions");
    const docRef = await addDoc(sessionsRef, {
      ...session,
      startTime: Timestamp.fromDate(session.startTime),
      endTime: Timestamp.fromDate(session.endTime),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving session:", error);
    throw new Error("Failed to save session");
  }
}

export async function getSessions(
  userId: string,
  timeRange: "day" | "week" | "month"
) {
  try {
    const sessionsRef = collection(db, "focusSessions");
    const startDate = new Date();

    switch (timeRange) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const q = query(
      sessionsRef,
      where("userId", "==", userId),
      where("startTime", ">=", startTimestamp),
      orderBy("startTime", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
    })) as FocusSession[];
  } catch (error) {
    console.error("Error getting sessions:", error);
    throw new Error("Failed to load sessions");
  }
}

export async function saveFocusTask(task: NewFocusTask) {
  try {
    const tasksRef = collection(db, "focusTasks");
    const docRef = await addDoc(tasksRef, {
      ...task,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving task:", error);
    throw new Error("Failed to save task");
  }
}

export async function getFocusTasks(userId: string) {
  try {
    const tasksRef = collection(db, "focusTasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as FocusTask[];
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw new Error("Failed to load tasks");
  }
}

export async function updateFocusTask(task: FocusTask) {
  try {
    const taskRef = doc(db, "focusTasks", task.id);
    const { id, ...updateData } = task;
    await updateDoc(taskRef, {
      ...updateData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}

export async function deleteFocusTask(taskId: string) {
  try {
    const taskRef = doc(db, "focusTasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}
