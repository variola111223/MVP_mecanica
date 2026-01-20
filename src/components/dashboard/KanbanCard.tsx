"use client";

import { Clock, User, ChevronRight, AlertTriangle, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ServiceOrder, KanbanStatus, Urgency } from "@/lib/supabase/types";
import { KANBAN_COLUMNS } from "@/lib/supabase/types";

interface KanbanCardProps {
  order: ServiceOrder;
  onUpdateStatus: (orderId: string, newStatus: KanbanStatus) => void;
  onViewDetails?: (orderId: string) => void;
  onEdit?: (order: ServiceOrder) => void;
}

const urgencyConfig: Record<Urgency, { label: string; className: string; icon: boolean }> = {
  normal: {
    label: "Normal",
    className: "bg-white/10 text-white/60 border-white/10",
    icon: false,
  },
  alta: {
    label: "Alta",
    className: "bg-warning-yellow/20 text-warning-yellow border-warning-yellow/30",
    icon: false,
  },
  urgente: {
    label: "Urgente",
    className: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
    icon: true,
  },
};

export function KanbanCard({ order, onUpdateStatus, onViewDetails, onEdit }: KanbanCardProps) {
  const urgency = urgencyConfig[order.urgency || "normal"];
  const currentIndex = KANBAN_COLUMNS.findIndex((col) => col.id === order.status);
  const nextStatus = KANBAN_COLUMNS[currentIndex + 1];

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d atrás`;
    if (diffHours > 0) return `${diffHours}h atrás`;
    return "Agora";
  };

  return (
    <div
      className={cn(
        "group bg-deep-steel/80 border border-white/5 rounded-lg p-3 cursor-pointer",
        "hover:border-electric-cyan/30 hover:bg-deep-steel transition-all duration-200",
        order.urgency === "urgente" && "border-l-2 border-l-red-500"
      )}
      onClick={() => onViewDetails?.(order.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-electric-cyan">
              {order.order_number}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border",
                urgency.className
              )}
            >
              {urgency.icon && <AlertTriangle className="w-2.5 h-2.5" />}
              {urgency.label}
            </span>
          </div>
          <h4 className="text-white font-semibold text-sm truncate group-hover:text-electric-cyan transition-colors">
            {order.vehicle?.brand} {order.vehicle?.model}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
            {order.vehicle?.plate}
          </span>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(order);
              }}
              className="p-1 rounded text-white/30 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
        <User className="w-3 h-3" />
        <span className="truncate">{order.customer?.full_name || "—"}</span>
      </div>

      {/* Service */}
      <div className="text-xs text-white/40 mb-3 line-clamp-1">
        {order.problem_description || "Sem descrição"}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-[10px] text-white/30">
          <Clock className="w-3 h-3" />
          {formatTime(order.received_at || order.created_at)}
        </div>

        {order.total_amount > 0 && (
          <span className="font-mono text-xs text-neon-green">
            R$ {order.total_amount.toLocaleString("pt-BR")}
          </span>
        )}
      </div>

      {/* Action Button */}
      {nextStatus && (
        <Button
          size="sm"
          variant="ghost"
          className="w-full mt-2 h-7 text-xs text-electric-cyan hover:bg-electric-cyan/10 hover:text-electric-cyan border border-electric-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(order.id, nextStatus.id);
          }}
        >
          Mover para {nextStatus.title}
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}

      {order.status === "finalizado" && (
        <Button
          size="sm"
          variant="ghost"
          className="w-full mt-2 h-7 text-xs text-neon-green hover:bg-neon-green/10 border border-neon-green/20 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // Handle delivery
          }}
        >
          Entregar ao Cliente
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </div>
  );
}
