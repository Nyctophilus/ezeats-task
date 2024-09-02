import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TodosClient from "./TodosClient";
import { fetchTodos } from "@/utils/fetchTodos";

export const metadata = {
  title: "Your Daily Todos",
  description: "Todos page to manage your daily tasks",
};

export default async function TodosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const todos = await fetchTodos();

  return (
    <section className="p-3 pt-6 max-w-2xl w-full flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Todo's
      </h1>
      <TodosClient todos={todos || []} />
    </section>
  );
}
