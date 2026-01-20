"use client";

import { useAuth } from "@/lib/mock-auth";
import { KanbanBoard, StatsHeader } from "@/components/dashboard";
import { Search, Bell, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/50 text-sm">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Buscar OS, placa, cliente..."
              className="w-64 pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-electric-cyan"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* New OS Button */}
          <Button className="cyan-button h-9">
            <Plus className="w-4 h-4 mr-1" />
            Nova OS
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsHeader />

      {/* Kanban Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Quadro de Ordens</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />
    </div>
  );
}
