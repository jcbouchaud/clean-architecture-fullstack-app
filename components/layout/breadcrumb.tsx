"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const getPageTitle = (pathname: string): string => {
  // Convert pathname to a readable title
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "Home";
  }

  // Capitalize and format the last segment
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface AppBreadcrumbProps {
  breadcrumbs?: BreadcrumbItem[];
  showHome?: boolean;
}

export function AppBreadcrumb({
  breadcrumbs: providedBreadcrumbs,
  showHome = true,
}: AppBreadcrumbProps) {
  const pathname = usePathname();

  let breadcrumbs: Array<{ href: string; label: string; isLast: boolean }>;

  if (providedBreadcrumbs) {
    // Use provided breadcrumbs
    breadcrumbs = providedBreadcrumbs.map((item, index) => ({
      ...item,
      isLast: index === providedBreadcrumbs.length - 1,
    }));
  } else {
    // Generate automatic breadcrumbs
    const segments = pathname.split("/").filter(Boolean);
    breadcrumbs = [
      ...(showHome
        ? [{ href: "/", label: "Home", isLast: segments.length === 0 }]
        : []),
      ...segments.map((segment, index) => {
        const currentPath = "/" + segments.slice(0, index + 1).join("/");
        return {
          href: currentPath,
          label: getPageTitle(currentPath),
          isLast: index === segments.length - 1,
        };
      }),
    ];
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div
            key={`${breadcrumb.href}-${index}`}
            className="flex items-center"
          >
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!breadcrumb.isLast && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
