"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";
import { DroppableColumn } from "./DroppableColumn";
import { CreateOSModal } from "./CreateOSModal";
import { EditOSModal } from "./EditOSModal";
import { getServiceOrders, updateServiceOrderStatus } from "@/lib/supabase/queries";
import { useTenant } from "./TenantContext";
import type { ServiceOrder, KanbanStatus } from "@/lib/supabase/types";
import { KANBAN_COLUMNS } from "@/lib/supabase/types";

export function KanbanBoard() {
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [activeOrder, setActiveOrder] = useState<ServiceOrder | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const data = await getServiceOrders(tenant?.id);
    setOrders(data);
    setIsLoading(false);
  }, [tenant?.id]);

  useEffect(() => {
    if (tenant) {
      fetchOrders();
    }
  }, [fetchOrders, tenant]);

  const handleDragStart = (event: DragStartEvent) => {
    const order = orders.find((o) => o.id === event.active.id);
    setActiveOrder(order || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);

    if (!over) return;

    const orderId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === overId);
    if (targetColumn) {
      const order = orders.find((o) => o.id === orderId);
      if (order && order.status !== targetColumn.id) {
        await handleUpdateStatus(orderId, targetColumn.id);
      }
      return;
    }

    // Check if dropped on another card - get that card's column
    const targetOrder = orders.find((o) => o.id === overId);
    if (targetOrder) {
      const order = orders.find((o) => o.id === orderId);
      if (order && order.status !== targetOrder.status) {
        await handleUpdateStatus(orderId, targetOrder.status);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: KanbanStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Update in database
    const success = await updateServiceOrderStatus(orderId, newStatus);
    if (!success) {
      fetchOrders();
    }
  };

  const handleViewDetails = (orderId: string) => {
    console.log("View details:", orderId);
  };

  const handleEdit = (order: ServiceOrder) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const getColumnOrders = (status: KanbanStatus) => {
    return orders.filter((order) => order.status === status);
  };

  const getColumnColor = (columnId: KanbanStatus) => {
    switch (columnId) {
      case "entrada":
        return "electric-cyan";
      case "orcamento":
        return "warning-yellow";
      case "execucao":
        return "pending-orange";
      case "finalizado":
        return "neon-green";
      default:
        return "white";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-electric-cyan animate-spin" />
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-12rem)]">
          {KANBAN_COLUMNS.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={getColumnColor(column.id)}
              orders={getColumnOrders(column.id)}
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onNewOS={column.id === "entrada" ? () => setIsModalOpen(true) : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOrder && (
            <div className="opacity-90">
              <KanbanCard
                order={activeOrder}
                onUpdateStatus={handleUpdateStatus}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <CreateOSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrders}
      />

      <EditOSModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={editingOrder}
        onSuccess={fetchOrders}
      />
    </>
  );
}
