"use client";
import { Button } from "@/components/ui/button";
import { Provider } from "@supabase/supabase-js";
import { Github } from "lucide-react";
import { oAuthSignIn } from "./actions";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

export function OAuthButtons() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: <Github className="size-5" />,
    },
  ];

  return (
    <Button
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
      onClick={async () => {
        await oAuthSignIn(oAuthProviders[0].name);
      }}
    >
      {oAuthProviders[0].icon}
      Login with {oAuthProviders[0].displayName}
    </Button>
  );
}
