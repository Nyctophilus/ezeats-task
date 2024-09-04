import { Button } from "./ui/button";
import { Check, Edit } from "lucide-react";
import { startTransition, useState } from "react";
import { Input } from "./ui/input";
import { Todo } from "@/types/custom";
import { cn } from "@/lib/utils";
import { TodoOptimisticUpdate } from "./todo-list";
import { updateTodo } from "@/app/todos/actions";
import { queryClient } from "@/app/providers";
import { toast } from "sonner";
import { useTodosStore } from "@/lib/store";

const EditButton = ({
  todo,
  optimisticUpdate,
}: {
  todo: Todo;
  optimisticUpdate: TodoOptimisticUpdate;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoValue, setTodoValue] = useState(todo.task);
  const updateTodoStore = useTodosStore((state) => state.updateTodo);

  const handleChangeValueTask = async () => {
    setIsEditing(false);

    if (todoValue !== todo.task) {
      // Optimistically update the todo in the store
      startTransition(() =>
        optimisticUpdate({
          action: "update",
          todo: {
            ...todo,
            task: todoValue,
          },
        })
      );

      // Send the update to the server
      const res = await updateTodo({
        ...todo,
        task: todoValue,
      });

      toast(res ? res.message : `Task(${todo.task}) updated successfully!`, {
        style: {
          color: res?.error ? "red" : "limegreen",
        },
      });

      if (res === null) {
        updateTodoStore({ ...todo, task: todoValue });
        queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }

      if (res) setTodoValue(todo.task);
    } else {
      toast("Nothing to update!", {
        style: {
          color: "Orange",
        },
      });
    }
  };

  const handleIsEditingStatus = () => setIsEditing(!isEditing);

  const handleTodoValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoValue(e.target.value);
  };

  return (
    <>
      {isEditing ? (
        <div className="w-full relative">
          <Input onChange={handleTodoValue} value={todoValue!} type="text" />

          <Button
            onClick={handleChangeValueTask}
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Check className="h-5 w-5" />
            <span className="sr-only">Edit Todo</span>
          </Button>
        </div>
      ) : (
        <p className={cn("flex-1 pt-2 min-w-0 break-words")}>{todo.task}</p>
      )}

      <Button
        type="button"
        onClick={handleIsEditingStatus}
        variant="ghost"
        size="icon"
      >
        <Edit className="h-5 w-5" />
        <span className="sr-only">Edit Todo</span>
      </Button>
    </>
  );
};
export default EditButton;