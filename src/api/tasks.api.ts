import type { Task } from "@/types/tasks";
import { simulateApiCall } from "./client";
import { mockTasks } from "@/data/mockData";

const TASKS_STORAGE_KEY = "bookmark-manager:tasks";

const initializeStorage = (): void => {
  if (!localStorage.getItem(TASKS_STORAGE_KEY)) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(mockTasks));
  }
};

const getTasksFromStorage = (): Task[] => {
  initializeStorage();
  const stored = localStorage.getItem(TASKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTasksToStorage = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

/**
 * Fetch all tasks
 */
export const fetchTasks = async (): Promise<Task[]> => {
  const tasks = getTasksFromStorage();
  return simulateApiCall(tasks);
};

/**
 * Create a new task
 */
export const createTask = async (name: string): Promise<Task> => {
  const tasks = getTasksFromStorage();

  const id = name.toLowerCase().replace(/\s+/g, "-");

  const task: Task = {
    id,
    name,
    createdAt: Date.now(),
  };

  const updatedTasks = [...tasks, task];
  saveTasksToStorage(updatedTasks);

  return simulateApiCall(task);
};
