"use client";

import { useAuth } from "@/lib/mock-auth";
import { User, Building, Bell, CreditCard, Palette, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "oficina", label: "Oficina", icon: Building },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "seguranca", label: "Segurança", icon: Shield },
];

export default function ConfiguracoesPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-white/50 text-sm">Gerencie as configurações da sua conta e oficina</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {settingsSections.map((section, i) => (
              <button
                key={section.id}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  i === 0
                    ? "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Informações do Perfil</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-electric-cyan/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-electric-cyan" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:bg-white/5">
                    Alterar foto
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Nome</Label>
                  <Input
                    defaultValue={user?.name}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">E-mail</Label>
                  <Input
                    defaultValue={user?.email}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Cargo</Label>
                <Input
                  defaultValue="Administrador"
                  disabled
                  className="bg-white/5 border-white/10 text-white/50"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <Button className="cyan-button">Salvar alterações</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
