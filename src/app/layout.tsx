import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoTech SaaS | Gestão de Oficinas Mecânicas",
  description: "Plataforma premium de gestão para oficinas mecânicas. Ordens de serviço, agendamentos e acompanhamento em tempo real.",
  keywords: ["oficina mecânica", "gestão", "ordem de serviço", "agendamento", "autotech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
