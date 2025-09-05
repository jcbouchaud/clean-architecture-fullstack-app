import { PageLayout } from "@/components/layout/page-layout";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Breadcrumbs for invoices page
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/invoices", label: "Invoices" },
  ];

  return (
    <PageLayout
      title="Factures"
      description="Manage and track your invoices"
      breadcrumbs={breadcrumbs}
    >
      {children}
    </PageLayout>
  );
}
