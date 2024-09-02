import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OAuthButtons } from "./oauth-signin";

export const metadata = {
  title: "Login",
  description: "Login page for the Supabase Todos app",
};

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/todos");
  }

  return (
    <section className="h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)] flex flex-col gap-4 justify-center items-center">
      <OAuthButtons />

      {searchParams.message && (
        <div className="text-sm font-medium text-destructive">
          {searchParams.message}
        </div>
      )}
    </section>
  );
}
