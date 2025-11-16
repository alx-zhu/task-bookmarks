export interface Task {
  id: string;
  name: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  note: string;
  taskId: string;
  taskName: string; // Denormalized for easier search/display
  createdAt: number;
  lastAccessed: number;
}
