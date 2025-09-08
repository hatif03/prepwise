import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-border">
                <Image
                  src="/logo.svg"
                  alt="PrepWise Logo"
                  width={20}
                  height={16}
                />
              </div>
              <h1 className="text-xl font-medium text-foreground">PrepWise</h1>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="root-layout">{children}</main>
    </div>
  );
};

export default Layout;
