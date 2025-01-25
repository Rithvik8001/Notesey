export interface FocusSession {
  id?: string;
  userId: string;
  duration: number;
  type: "work" | "break";
  startTime: Date;
  endTime: Date;
  taskId?: string | null;
}

export interface FocusTask {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export type NewFocusTask = Omit<FocusTask, "id" | "updatedAt">;
