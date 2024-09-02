import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <section className="mt-60 grid place-items-center gap-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <h1 className="font-sans text-balance font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
        Manege your daily tasks
      </h1>

      <Link href={"/todos"} className="block mx-auto w-fit" prefetch={false}>
        <Button
          className="flex items-center justify-center gap-2"
          variant="secondary"
        >
          Get Started
        </Button>
      </Link>
    </section>
  );
}
