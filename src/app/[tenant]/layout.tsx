import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar Serviço | AutoTech",
  description: "Agende seu serviço automotivo online. Transparência total no acompanhamento do reparo.",
};

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
