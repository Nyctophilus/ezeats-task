"use client";
import { addTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { TodoOptimisticUpdate } from "./todo-list";
import { Todo } from "@/types/custom";
import { useTodosStore } from "@/lib/store";
import { queryClient } from "@/app/providers";
import { toast } from "sonner";

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

  const handleSubmit = async (data: FormData) => {
    const newTodo: Todo = {
      id: -1,
      inserted_at: new Date().toISOString(),
      user_id: "",
      task: data.get("todo") as string,
      is_complete: false,
    };
    optimisticUpdate({ action: "create", todo: newTodo });
    const res = await addTodo(data);

    toast(res ? res.message : "Task added successfully!", {
      style: {
        color: res?.error ? "red" : "limegreen",
      },
    });

    if (!res) {
      addTodoToStore(newTodo);
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
