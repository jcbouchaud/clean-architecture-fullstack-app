"use client";

import { ReactNode } from "react";
import { AppBreadcrumb } from "./breadcrumb";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showHome?: boolean;
}

export function PageLayout({
  title,
  description,
  children,
  breadcrumbs,
  showHome = true,
}: PageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <AppBreadcrumb breadcrumbs={breadcrumbs} showHome={showHome} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
