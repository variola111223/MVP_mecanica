import { redirect, notFound } from "next/navigation";

interface Props {
  params: Promise<{ tenant: string }>;
}

const RESERVED_PATHS = ["dashboard", "status", "api", "login", "register", "admin"];

export default async function TenantPage({ params }: Props) {
  const { tenant } = await params;
  
  // Don't treat reserved paths as tenants
  if (RESERVED_PATHS.includes(tenant)) {
    notFound();
  }
  
  redirect(`/${tenant}/agendar`);
}
