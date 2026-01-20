"use client";

import { Calendar, ChevronLeft, ChevronRight, Clock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgendaPage() {
  const today = new Date();
  const appointments = [
    { time: "08:00", customer: "João Silva", car: "Toyota Corolla", service: "Revisão", status: "confirmed" },
    { time: "09:30", customer: "Maria Santos", car: "Honda Civic", service: "Freios", status: "confirmed" },
    { time: "11:00", customer: "Pedro Costa", car: "VW Golf", service: "Diagnóstico", status: "pending" },
    { time: "14:00", customer: "Ana Oliveira", car: "Chevrolet Onix", service: "Troca de óleo", status: "confirmed" },
    { time: "16:00", customer: "Carlos Ferreira", car: "Fiat Argo", service: "Suspensão", status: "confirmed" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-white/50 text-sm">Gerencie os agendamentos da oficina</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
            <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-medium text-sm min-w-[140px] text-center">
              {today.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button className="cyan-button h-9">
            <Calendar className="w-4 h-4 mr-1" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Hoje — {today.toLocaleDateString("pt-BR", { weekday: "long" })}
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {appointments.map((apt, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="w-16 text-center">
                <span className="font-mono text-electric-cyan text-sm">{apt.time}</span>
              </div>

              <div className="w-2 h-2 rounded-full bg-electric-cyan" />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{apt.customer}</span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      apt.status === "confirmed"
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-warning-yellow/20 text-warning-yellow"
                    }`}
                  >
                    {apt.status === "confirmed" ? "Confirmado" : "Pendente"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/50 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {apt.car}
                  </span>
                  <span>•</span>
                  <span>{apt.service}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-electric-cyan hover:bg-electric-cyan/10"
              >
                Ver detalhes
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
