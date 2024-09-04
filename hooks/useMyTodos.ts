import { Todo } from "@/types/custom";
import { useTodosStore } from "@/lib/store";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

const useMyTodos = ({ todos }: { todos: Array<Todo> }) => {
  const supabase = createClient();
  const setTodos = useTodosStore((state) => state.setTodos);
  const addTodo = useTodosStore((state) => state.addTodo);
  const updateTodo = useTodosStore((state) => state.updateTodo);
  const deleteTodo = useTodosStore((state) => state.deleteTodo);

  useEffect(() => {
    if (todos) {
      setTodos(todos);
    }

    // realtime subscription to listen for changes
    const subscription = supabase
      .channel("any")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          console.log("Change received!", payload);

          if (payload.eventType === "INSERT") {
            addTodo(payload.new as Todo);
            toast(`${payload.new.task} added!`, {
              style: {
                color: "green",
              },
            });
          } else if (payload.eventType === "UPDATE") {
            updateTodo(payload.new as Todo);

            toast(`${payload.new.task} updated!`, {
              style: {
                color: "orange",
              },
            });
          } else if (payload.eventType === "DELETE") {
            deleteTodo(payload.old as Todo);

            toast(`Task with id ${payload.old.id} deleted!`, {
              style: {
                color: "red",
              },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [todos, setTodos, addTodo, updateTodo, deleteTodo]);
};

export default useMyTodos;
