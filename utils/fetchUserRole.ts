import { createClient } from "@/utils/supabase/server";

// RLS iusse
export async function fetchUserRole(userId: string) {
  const supabase = await createClient();
  const { data: user_role, error } = await supabase
    .from("user_role")
    .select("role")
    .eq("user_id", userId);
  console.log(error);
  console.log(user_role);

  return user_role;
}
export async function AssignUserRole(user_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_role")
    .insert([{ user_id }])
    .select();

  console.log(data);
  console.log(error);
}
