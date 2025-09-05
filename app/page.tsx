import { logout } from "./auth/actions";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center gradient-purple-light">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-purple flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Invoice Manager
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage your invoices, track payments, and streamline your business
              operations.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/invoices"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200"
            >
              Go to Invoices
            </Link>

            <form action={logout} className="w-full">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
