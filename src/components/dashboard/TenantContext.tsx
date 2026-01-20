"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, use demo tenant
    // In a real app, this would come from auth or URL
    const demoTenant: Tenant = {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      name: "AutoTech Oficina Demo",
      slug: "oficina-demo",
      email: "demo@autotech.com",
      phone: "(11) 99999-0000",
    };
    
    setTenant(demoTenant);
    setIsLoading(false);
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
