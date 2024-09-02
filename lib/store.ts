import { create } from "zustand";
import { Todo } from "@/types/custom";

type TodosState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
};

export const useTodosStore = create<TodosState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
    })),
  deleteTodo: (todo) =>
    set((state) => ({ todos: state.todos.filter((t) => t.id !== todo.id) })),
}));
