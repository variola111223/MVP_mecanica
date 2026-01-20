"use client";

import { KanbanBoard } from "@/components/dashboard";
import { Search, Plus, Filter, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function OrdensPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
          <p className="text-white/50 text-sm">
            Gerencie todas as OS da oficina
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

          {/* View Toggle */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setView("kanban")}
              className={`p-1.5 rounded ${
                view === "kanban"
                  ? "bg-electric-cyan/20 text-electric-cyan"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded ${
                view === "list"
                  ? "bg-electric-cyan/20 text-electric-cyan"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-white/10 text-white/60 hover:text-white hover:bg-white/5"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filtrar
          </Button>

          {/* New OS Button */}
          <Button className="cyan-button h-9">
            <Plus className="w-4 h-4 mr-1" />
            Nova OS
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "kanban" ? (
        <KanbanBoard />
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-8 text-center text-white/40">
          Visualização em lista - Em breve
        </div>
      )}
    </div>
  );
}
