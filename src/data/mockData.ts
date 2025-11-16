import type { Task, Bookmark } from "@/types/tasks";

export const mockTasks: Task[] = [
  {
    id: "database-optimization",
    name: "Database optimization",
    createdAt: Date.now(),
  },
  {
    id: "backend-performance",
    name: "Backend performance",
    createdAt: Date.now(),
  },
  {
    id: "react-best-practices",
    name: "React best practices",
    createdAt: Date.now(),
  },
  {
    id: "react-performance",
    name: "React performance",
    createdAt: Date.now(),
  },
];

export const mockBookmarks: Bookmark[] = [
  {
    id: "1",
    url: "https://use-the-index-luke.com",
    title: "Use The Index, Luke - Database Indexing Explained",
    note: "Explains B-tree vs hash indexes and when to use each",
    taskId: "database-optimization",
    taskName: "Database optimization",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    lastAccessed: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  {
    id: "2",
    url: "https://postgresql.org/docs/current/indexes.html",
    title: "PostgreSQL Documentation - Index Types",
    note: "Official comparison of different index strategies",
    taskId: "database-optimization",
    taskName: "Database optimization",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    lastAccessed: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "3",
    url: "https://www.cybertec-postgresql.com/en/high-performance-postgresql/",
    title: "High Performance PostgreSQL",
    note: "Advanced indexing patterns for complex queries",
    taskId: "backend-performance",
    taskName: "Backend performance",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    lastAccessed: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "4",
    url: "https://react.dev/learn/thinking-in-react",
    title: "Thinking in React",
    note: "Official guide on React mental models and component design",
    taskId: "react-best-practices",
    taskName: "React best practices",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    lastAccessed: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
  },
  {
    id: "5",
    url: "https://react.dev/reference/react/memo",
    title: "React.memo - Performance Optimization",
    note: "When and how to use memo for performance gains",
    taskId: "react-performance",
    taskName: "React performance",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastAccessed: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: "6",
    url: "https://react.dev/reference/react/useMemo",
    title: "useMemo Hook Reference",
    note: "Memoizing expensive calculations between renders",
    taskId: "react-performance",
    taskName: "React performance",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    lastAccessed: Date.now() - 2 * 60 * 60 * 1000,
  },
];
