"use server";

import { Todo } from "@/types/custom";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export async function addTodo(formData: FormData) {
  const supabase = createClient();
  const text = formData.get("todo") as string | null;

  if (!text) {
    throw new Error("Text is required");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "User is not logged in",
      error: "You've to be logged in to add a task",
    };
  }

  const { data, error } = await supabase
    .from("todos")
    .insert({
      task: text,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { message: "Error adding task", error: error.message };
  }

  revalidatePath("/todos");
  return data;
}

export async function deleteTodo(id: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  // if (id.toLocaleString() !== user.id) {
  //   return { message: "Task Owner only can delete it." };
  // }

  const { error } = await supabase.from("todos").delete().match({
    // user_id: user.id,
    id: id,
  });

  if (error) {
    return { message: "Error deleting task", error: error.message };
  }

  revalidatePath("/todos");
}

export async function updateTodo(todo: Todo) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("todos").update(todo).match({
    // user_id: user.id,
    id: todo.id,
  });

  console.log(error);

  if (error) {
    return { message: "Error updating task", error: error.message };
  }

  revalidatePath("/todos");
}
