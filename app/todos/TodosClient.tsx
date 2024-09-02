"use client";

import { TodoList } from "@/components/todo-list";
import { Separator } from "@/components/ui/separator";
import { Todo } from "@/types/custom";
import { useTodosStore } from "@/lib/store";

const TodosClient = ({ todos }: { todos: Array<Todo> }) => {
  const setTodos = useTodosStore((state) => state.setTodos);
  if (todos) {
    setTodos(todos);
  }

  return (
    <>
      <Separator className="w-full " />
      <TodoList todos={todos ?? []} />
    </>
  );
};
export default TodosClient;
