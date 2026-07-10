import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { SignOutButton } from "@/features/auth/sign-out-button";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="flex h-14 items-center justify-between px-6">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center"
          >
            <Image
              src="/aara-logo-white.png"
              alt="Aara Clothing"
              height={32}
              width={64}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href={ROUTES.DASHBOARD}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href={ROUTES.INVENTORY}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Inventory
            </Link>
            <Link
              href={ROUTES.CUSTOMERS}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Customers
            </Link>
            <Link
              href={ROUTES.SETTINGS}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Settings
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
