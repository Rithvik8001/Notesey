export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreNote extends Omit<Note, "createdAt" | "updatedAt"> {
  createdAt: { toDate: () => Date };
  updatedAt: { toDate: () => Date };
}
