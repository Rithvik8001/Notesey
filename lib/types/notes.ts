export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: {
    toDate: () => Date;
  };
  updatedAt: {
    toDate: () => Date;
  };
}
