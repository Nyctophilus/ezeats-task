import "./globals.css";
import Header from "@/components/header";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "EzEats Task",
    template: "%s | EzEats Task",
  },
  description: "Supabase, Auth and NextJS server actions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="sticky top-0 bg-background text-foreground">
        <Header />
        <Providers>
          <main className="flex flex-col items-center">{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
