import { auth } from "@/auth";
import { redirect } from "next/navigation";
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
            className="text-lg font-semibold tracking-tight"
          >
            Aara Clothing
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href={ROUTES.DASHBOARD}
              prefetch={true}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href={ROUTES.PRODUCTS}
              prefetch={true}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Products
            </Link>
            <Link
              href={ROUTES.CATEGORIES}
              prefetch={true}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Categories
            </Link>
            <Link
              href={ROUTES.INVENTORY}
              prefetch={true}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Inventory
            </Link>
            <Link
              href={ROUTES.ORDERS}
              prefetch={true}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Orders
            </Link>
            <Link
              href={ROUTES.CUSTOMERS}
              prefetch={true}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Customers
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
