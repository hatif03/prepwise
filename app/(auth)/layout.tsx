import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { ThemeToggle } from "@/components/ThemeToggle";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
