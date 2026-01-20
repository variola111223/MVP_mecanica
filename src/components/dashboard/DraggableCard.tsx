"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "./KanbanCard";
import type { ServiceOrder, KanbanStatus } from "@/lib/supabase/types";

interface DraggableCardProps {
  order: ServiceOrder;
  onUpdateStatus: (orderId: string, newStatus: KanbanStatus) => void;
  onViewDetails?: (orderId: string) => void;
  onEdit?: (order: ServiceOrder) => void;
}

export function DraggableCard({ order, onUpdateStatus, onViewDetails, onEdit }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard
        order={order}
        onUpdateStatus={onUpdateStatus}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
      />
    </div>
  );
}
