import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-lg:flex-col gap-y-4 py-4 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold text-lg">EzEats</span>
          </Link>
          <Link href="/todos">My Todos</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user !== null && (
            <form
              action={signOut}
              className="flex flex-wrap max-lg:justify-center items-center gap-y-1 gap-x-4"
            >
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Button>Sign Out</Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
