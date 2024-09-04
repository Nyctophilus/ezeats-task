"use client";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { Todo } from "@/types/custom";
import { useOptimistic } from "react";
import { useTodosStore } from "@/lib/store";

export type Action = "delete" | "update" | "create";

export function todoReducer(
  state: Array<Todo>,
  { action, todo }: { action: Action; todo: Todo }
) {
  switch (action) {
    case "delete":
      return state.filter(({ id }) => id !== todo.id);
    case "update":
      return state.map((t) => (t.id === todo.id ? todo : t));
    case "create":
      return [todo, ...state];
    default:
      return state;
  }
}

export type TodoOptimisticUpdate = (action: {
  action: Action;
  todo: Todo;
}) => void;

export function TodoList() {
  const [optimisticTodos, optimisticTodosUpdate] = useOptimistic(
    useTodosStore((state) => state.todos),
    todoReducer
  );

  return (
    <>
      <TodoForm optimisticUpdate={optimisticTodosUpdate} />
      <div className="w-full flex flex-col gap-4">
        {optimisticTodos?.map((todo) => {
          return (
            <TodoItem
              optimisticUpdate={optimisticTodosUpdate}
              todo={todo}
              key={todo.id + todo.inserted_at}
            />
          );
        })}
      </div>
    </>
  );
}