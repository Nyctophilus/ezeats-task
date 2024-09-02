import { createClient } from "@/utils/supabase/server";

export async function fetchTodos() {
  const supabase = await createClient();
  const { data: todos } = await supabase
    .from("todos")
    .select()
    .order("inserted_at", { ascending: false });
  return todos;
}
