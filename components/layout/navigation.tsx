import Link from "next/link";

export default function Navigation() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/invoices", label: "Invoices" },
    { href: "/auth", label: "Auth" },
  ];

  return (
    <nav className="bg-background shadow-sm border-b border-border gradient-purple-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-foreground">
                Invoice Manager
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
