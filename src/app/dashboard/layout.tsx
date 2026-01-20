"use client";

import { AuthProvider, useAuth } from "@/lib/mock-auth";
import { Sidebar } from "@/components/dashboard";
import { TenantProvider } from "@/components/dashboard/TenantContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Simulate auth protection
  useEffect(() => {
    if (!isAuthenticated) {
      // In real app, redirect to login
      // redirect("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen bg-deep-steel">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <TenantProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </TenantProvider>
    </AuthProvider>
  );
}
