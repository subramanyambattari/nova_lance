import { AppShell } from "@/components/ui/app-shell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  if (!user.role || !user.username) {
    redirect("/onboarding");
  }

  return <AppShell>{children}</AppShell>;
}
