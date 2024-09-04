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

export function TodoItem({
  todo,
  optimisticUpdate,
}: {
  todo: Todo;
  optimisticUpdate: TodoOptimisticUpdate;
}) {
  const updateTodoStore = useTodosStore((state) => state.updateTodo);
  const deleteTodoStore = useTodosStore((state) => state.deleteTodo);

  const handleEditTask = async () => {
    // Optimistically update the todo in the store
    startTransition(() =>
      optimisticUpdate({
        action: "update",
        todo: {
          ...todo,
          is_complete: !todo.is_complete,
        },
      })
    );

    // Send the update to the server
    const res = await updateTodo({
      ...todo,
      is_complete: !todo.is_complete,
    });

    if (res) {
      toast(res.message, {
        description: res?.error,
        style: {
          color:  "red" ,
        },
      });
    } else {
      updateTodoStore(todo);
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    }
  };

  const handleDeleteTask = async () => {
    // Optimistically delete the todo from the store
    startTransition(() => optimisticUpdate({ action: "delete", todo }));

    // Send the delete request to the server
    const res = await deleteTodo(todo.id);

  if(res) { toast(res.message , {
      description: res?.error,
      style: {
        color: "red",
      },
    });}

    else {
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