"use client";
import { deleteTodo, updateTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/custom";
import { Trash2 } from "lucide-react";
import { TodoOptimisticUpdate } from "./todo-list";
import { queryClient } from "@/app/providers";
import EditButton from "./edit-button";
import { startTransition } from "react";
import { toast } from "sonner";
import { useTodosStore } from "@/lib/store";
import { createClient } from "@/utils/supabase/client";

export function TodoItem({
  todo,
  optimisticUpdate,
}: {
  todo: Todo;
  optimisticUpdate: TodoOptimisticUpdate;
}) {
  const updateTodoStore = useTodosStore((state) => state.updateTodo);
  const deleteTodoStore = useTodosStore((state) => state.deleteTodo);
  const supabase = createClient();

  const handleEditTask = async () => {
    // Optimistically add the todo to the store
    startTransition(() =>
      optimisticUpdate({
        action: "update",
        todo: {
          ...todo,
          is_complete: !todo.is_complete,
        },
      })
    );

    // Set up real-time subscription
    supabase
      .channel("update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "todos" },
        (payload) => {
          console.log("Change received!", payload);
          useTodosStore.getState().addTodo(payload.new as Todo);
        }
      )
      .subscribe();

    // Send the todo to the server
    const res = await updateTodo({
      ...todo,
      is_complete: !todo.is_complete,
    });

    toast(res ? res.message : `Task(${todo.task}) updated successfully!`, {
      description: res?.error,
      style: {
        color: res?.error ? "red" : "green",
      },
    });

    if (res === null) {
      updateTodoStore(todo);
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    }
  };

  const handleDeleteTask = async () => {
    // Optimistically add the todo to the store
    startTransition(() => optimisticUpdate({ action: "delete", todo }));

    // Set up real-time subscription
    supabase
      .channel("delete-channel")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "todos" },
        (payload) => {
          console.log("Change received!", payload);
          useTodosStore.getState().addTodo(payload.new as Todo);
        }
      )
      .subscribe();

    // Send the todo to the server
    const res = await deleteTodo(todo.id);

    toast(res ? res.message : `Task(${todo.task}) deleted successfully!`, {
      description: res?.error,
      style: {
        color: res?.error ? "red" : "orange",
      },
    });

    if (res === null) {
      deleteTodoStore(todo);
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    }
  };

  return (
    <form>
      <Card
        className={cn(
          "w-full transition-colors duration-300",
          todo.is_complete && "bg-green-50"
        )}
      >
        <CardContent className="flex items-start gap-3 p-3">
          <span className="size-10 flex items-center justify-center">
            <Checkbox
              checked={Boolean(todo.is_complete)}
              onClick={handleEditTask}
            />
          </span>

          <EditButton optimisticUpdate={optimisticUpdate} todo={todo} />

          <Button
            type="submit"
            formAction={handleDeleteTask}
            variant="ghost"
            size="icon"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Delete Todo</span>
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
