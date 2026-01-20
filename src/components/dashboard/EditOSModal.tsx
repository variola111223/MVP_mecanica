"use client";

import { useState, useEffect } from "react";
import { X, Save, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceOrder, Urgency, KanbanStatus } from "@/lib/supabase/types";
import { updateServiceOrder, deleteServiceOrder } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

interface EditOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ServiceOrder | null;
  onSuccess: () => void;
}

const urgencyOptions: { value: Urgency; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

export function EditOSModal({ isOpen, onClose, order, onSuccess }: EditOSModalProps) {
  const [formData, setFormData] = useState({
    status: "entrada" as KanbanStatus,
    urgency: "normal" as Urgency,
    problem_description: "",
    diagnosis: "",
    labor_cost: 0,
    parts_cost: 0,
    discount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        urgency: order.urgency || "normal",
        problem_description: order.problem_description || "",
        diagnosis: order.diagnosis || "",
        labor_cost: order.labor_cost || 0,
        parts_cost: order.parts_cost || 0,
        discount: order.discount || 0,
      });
    }
  }, [order]);

  const updateField = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    return (formData.labor_cost || 0) + (formData.parts_cost || 0) - (formData.discount || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsLoading(true);
    try {
      const success = await updateServiceOrder(order.id, {
        status: formData.status,
        urgency: formData.urgency,
        problem_description: formData.problem_description,
        diagnosis: formData.diagnosis,
        labor_cost: formData.labor_cost,
        parts_cost: formData.parts_cost,
        discount: formData.discount,
        total_amount: calculateTotal(),
      });

      if (success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating service order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    
    if (!confirm("Tem certeza que deseja excluir esta OS? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteServiceOrder(order.id);
      if (success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting service order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Editar OS</h2>
            <p className="text-sm text-white/60 mt-1">
              {order.order_number} • {order.vehicle?.brand} {order.vehicle?.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status e Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80 text-sm">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger className="tech-input mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-deep-steel border-white/10">
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="orcamento">Orçamento</SelectItem>
                  <SelectItem value="execucao">Execução</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/80 text-sm">Urgência</Label>
              <Select value={formData.urgency} onValueChange={(value: Urgency) => updateField("urgency", value)}>
                <SelectTrigger className="tech-input mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-deep-steel border-white/10">
                  {urgencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição do Problema */}
          <div>
            <Label className="text-white/80 text-sm">Descrição do Problema</Label>
            <Textarea
              value={formData.problem_description}
              onChange={(e) => updateField("problem_description", e.target.value)}
              className="tech-input mt-1 min-h-[80px]"
              placeholder="Descreva o problema relatado pelo cliente..."
            />
          </div>

          {/* Diagnóstico */}
          <div>
            <Label className="text-white/80 text-sm">Diagnóstico</Label>
            <Textarea
              value={formData.diagnosis}
              onChange={(e) => updateField("diagnosis", e.target.value)}
              className="tech-input mt-1 min-h-[80px]"
              placeholder="Diagnóstico técnico do problema..."
            />
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Valores</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-white/80 text-sm">Mão de Obra</Label>
                <Input
                  type="number"
                  value={formData.labor_cost}
                  onChange={(e) => updateField("labor_cost", parseFloat(e.target.value) || 0)}
                  className="tech-input mt-1"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="text-white/80 text-sm">Peças</Label>
                <Input
                  type="number"
                  value={formData.parts_cost}
                  onChange={(e) => updateField("parts_cost", parseFloat(e.target.value) || 0)}
                  className="tech-input mt-1"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="text-white/80 text-sm">Desconto</Label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => updateField("discount", parseFloat(e.target.value) || 0)}
                  className="tech-input mt-1"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-electric-cyan/10 border border-electric-cyan/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Total:</span>
                <span className="text-2xl font-bold text-electric-cyan">
                  R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={isDeleting || isLoading}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Excluindo..." : "Excluir OS"}
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading || isDeleting}
                className="border-white/10 text-white/60 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isLoading || isDeleting}
                className="cyan-button"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
