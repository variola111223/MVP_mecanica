"use client";

import { Car, Clock, User, Wrench, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Appointment, STATUS_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface ServiceOrderCardProps {
  appointment: Appointment;
  onClick?: () => void;
  compact?: boolean;
}

export function ServiceOrderCard({ appointment, onClick, compact = false }: ServiceOrderCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  return (
    <Card
      className={cn(
        "glass-card-hover cursor-pointer group overflow-hidden",
        "border-l-2",
        appointment.status === "completed" && "border-l-neon-green",
        appointment.status === "in_repair" && "border-l-warning-yellow",
        appointment.status === "waiting_parts" && "border-l-pending-orange",
        !["completed", "in_repair", "waiting_parts"].includes(appointment.status) && "border-l-electric-cyan"
      )}
      onClick={onClick}
    >
      <CardHeader className={cn("pb-2", compact && "p-3")}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-electric-cyan text-sm tracking-wider">
                #{appointment.id.slice(0, 8).toUpperCase()}
              </span>
              {appointment.car_plate && (
                <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {appointment.car_plate}
                </span>
              )}
            </div>
            <h3 className="text-white font-semibold text-lg group-hover:text-electric-cyan transition-colors">
              {appointment.car_brand} {appointment.car_model}
            </h3>
          </div>
          <StatusBadge status={appointment.status} size="sm" showPulse />
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", compact && "p-3 pt-0")}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Wrench className="w-4 h-4 text-electric-cyan/70" />
            <span className="line-clamp-1">{appointment.service_type}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/50">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(appointment.scheduled_date)}</span>
              </div>
              {appointment.scheduled_time && (
                <div className="flex items-center gap-1.5 text-white/50">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(appointment.scheduled_time)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs uppercase tracking-wider">Detalhes</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {!compact && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-electric-cyan/20 flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 text-electric-cyan" />
                </div>
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  {appointment.appointment_mode === "quick_service" ? "Esperar" : "Deixar"}
                </span>
              </div>

              {appointment.quote_amount && (
                <span className="font-mono text-neon-green text-sm">
                  R$ {appointment.quote_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
