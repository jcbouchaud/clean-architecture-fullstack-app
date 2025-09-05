import { logout } from "./auth/actions";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageLayout
        title="Accueil"
        description="Bienvenue dans le Gestionnaire de Factures"
      >
        <div className="flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="text-muted-foreground mb-8">
                  Gérez vos factures, suivez les paiements et rationalisez vos
                  opérations commerciales.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/invoices"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200"
                >
                  Aller aux Factures
                </Link>

                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200"
                  >
                    Déconnexion
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
