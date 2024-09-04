"use client";
import { addTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import { startTransition, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Todo } from "@/types/custom";
import { toast } from "sonner";
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

    // Send the todo to the server
    const res: any = await addTodo(data);
    if (res?.message) {
      toast(res?.message, {
        style: {
          color: "red",
        },
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
      formRef.current?.reset();
    }
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