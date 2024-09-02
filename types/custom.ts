import { Database } from "./supabase";

export type Todo = Database["public"]["Tables"]["todos"]["Row"];

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};
export type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: number) => void;
};
