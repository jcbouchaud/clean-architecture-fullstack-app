import { PageLayout } from "@/components/layout/page-layout";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Breadcrumbs for invoices page
  const breadcrumbs = [
    { href: "/", label: "Accueil" },
    { href: "/invoices", label: "Factures" },
  ];

  return (
    <PageLayout
      title="Factures"
      description="Gérez et suivez vos factures"
      breadcrumbs={breadcrumbs}
    >
      {children}
    </PageLayout>
  );
}
