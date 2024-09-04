"use client";

import { TodoList } from "@/components/todo-list";
import { Separator } from "@/components/ui/separator";
import { Todo } from "@/types/custom";
import useMyTodos from "@/hooks/useMyTodos";

const TodosClient = ({ todos }: { todos: Array<Todo> }) => {
  useMyTodos({ todos });

  return (
    <>
      <Separator className="w-full " />
      <TodoList />
    </>
  );
};
export default TodosClient;
