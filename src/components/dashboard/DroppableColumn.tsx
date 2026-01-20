"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal } from "lucide-react";
import { DraggableCard } from "./DraggableCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ServiceOrder, KanbanStatus } from "@/lib/supabase/types";

interface DroppableColumnProps {
  id: KanbanStatus;
  title: string;
  color: string;
  orders: ServiceOrder[];
  onUpdateStatus: (orderId: string, newStatus: KanbanStatus) => void;
  onViewDetails: (orderId: string) => void;
  onEdit?: (order: ServiceOrder) => void;
  onNewOS?: () => void;
}

export function DroppableColumn({
  id,
  title,
  color,
  orders,
  onUpdateStatus,
  onViewDetails,
  onEdit,
  onNewOS,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-[300px] flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              color === "electric-cyan" && "bg-electric-cyan",
              color === "warning-yellow" && "bg-warning-yellow",
              color === "pending-orange" && "bg-pending-orange",
              color === "neon-green" && "bg-neon-green"
            )}
          />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            {title}
          </h3>
          <span
            className={cn(
              "text-xs font-mono px-1.5 py-0.5 rounded",
              color === "electric-cyan" && "bg-electric-cyan/20 text-electric-cyan",
              color === "warning-yellow" && "bg-warning-yellow/20 text-warning-yellow",
              color === "pending-orange" && "bg-pending-orange/20 text-pending-orange",
              color === "neon-green" && "bg-neon-green/20 text-neon-green"
            )}
          >
            {orders.length}
          </span>
        </div>
        <button className="p-1 rounded text-white/30 hover:text-white hover:bg-white/5 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Column Content - Droppable Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-lg p-2 space-y-2 min-h-[200px]",
          "bg-white/[0.02] border border-white/5",
          "transition-all duration-200",
          isOver && "border-electric-cyan/50 bg-electric-cyan/5"
        )}
      >
        <SortableContext
          items={orders.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          {orders.map((order) => (
            <DraggableCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>

        {orders.length === 0 && (
          <div className="flex items-center justify-center h-24 text-white/20 text-sm">
            Arraste cards aqui
          </div>
        )}

        {id === "entrada" && onNewOS && (
          <Button
            variant="ghost"
            onClick={onNewOS}
            className="w-full h-9 border border-dashed border-white/10 text-white/40 hover:text-white hover:border-electric-cyan/30 hover:bg-electric-cyan/5"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nova OS
          </Button>
        )}
      </div>
    </div>
  );
}
