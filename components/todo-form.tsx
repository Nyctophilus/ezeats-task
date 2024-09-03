"use client";
import { addTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import { startTransition, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Todo } from "@/types/custom";
import { useTodosStore } from "@/lib/store";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { queryClient } from "@/app/providers";
import { TodoOptimisticUpdate } from "./todo-list";

function FormContent() {
  const { pending } = useFormStatus();
  return (
    <>
      <Textarea
        disabled={pending}
        minLength={4}
        name="todo"
        required
        placeholder="Add a new todo"
      />
      <Button type="submit" size="icon" className="min-w-10" disabled={pending}>
        {pending ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}

        <span className="sr-only">Submit Todo</span>
      </Button>
    </>
  );
}

export function TodoForm({
  optimisticUpdate,
}: {
  optimisticUpdate: TodoOptimisticUpdate;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const addTodoToStore = useTodosStore((state) => state.addTodo);
  const supabase = createClient();

  // add new todo
  const handleSubmit = async (data: FormData) => {
    const newTodo: Todo = {
      id: -1,
      inserted_at: new Date().toISOString(),
      user_id: "",
      task: data.get("todo") as string,
      is_complete: false,
    };

    // Optimistically add the todo to the store
    startTransition(() =>
      optimisticUpdate({ action: "create", todo: newTodo })
  );

    // Set up real-time subscription
    supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "todos" },
        (payload) => {
          console.log("Change received!", payload);
          useTodosStore.getState().addTodo(payload.new as Todo);
        }
      )
      .subscribe();

    // Send the todo to the server
    const res: any = await addTodo(data);
    toast(res?.message || `Task(${newTodo.task}) added successfully!`, {
      style: {
        color: res?.error ? "red" : "limegreen",
      },
    });

    if (res === null) {
      addTodoToStore(newTodo);
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    }

    if (res && !res.error) formRef.current?.reset();
  };

  return (
    <Card>
      <CardContent className="p-3">
        <form
          ref={formRef}
          className="flex gap-4 items-center"
          action={handleSubmit}
        >
          <FormContent />
        </form>
      </CardContent>
    </Card>
  );
}
