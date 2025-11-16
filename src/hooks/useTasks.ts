import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as tasksApi from "@/api/tasks.api";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
};

/**
 * Fetch all tasks
 */
export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: tasksApi.fetchTasks,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
