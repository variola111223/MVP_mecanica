"use client";

import { useState } from "react";
import { X, Car, User, Wrench, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createServiceOrder, searchVehicleByPlate } from "@/lib/supabase/queries";
import type { CreateServiceOrderInput, Urgency, Vehicle } from "@/lib/supabase/types";

interface CreateOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const urgencyOptions: { value: Urgency; label: string; color: string }[] = [
  { value: "normal", label: "Normal", color: "bg-white/10 border-white/20 text-white/70" },
  { value: "alta", label: "Alta", color: "bg-warning-yellow/20 border-warning-yellow/30 text-warning-yellow" },
  { value: "urgente", label: "Urgente", color: "bg-red-500/20 border-red-500/30 text-red-400" },
];

export function CreateOSModal({ isOpen, onClose, onSuccess }: CreateOSModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundVehicle, setFoundVehicle] = useState<Vehicle | null>(null);
  
  const [formData, setFormData] = useState<CreateServiceOrderInput>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: undefined,
    vehicle_color: "",
    vehicle_plate: "",
    vehicle_mileage: undefined,
    problem_description: "",
    urgency: "normal",
  });

  const handlePlateSearch = async () => {
    if (formData.vehicle_plate.length < 7) return;
    
    setIsSearching(true);
    const vehicle = await searchVehicleByPlate(formData.vehicle_plate);
    
    if (vehicle) {
      setFoundVehicle(vehicle);
      setFormData((prev) => ({
        ...prev,
        vehicle_brand: vehicle.brand,
        vehicle_model: vehicle.model,
        vehicle_year: vehicle.year,
        vehicle_color: vehicle.color || "",
        vehicle_mileage: vehicle.mileage,
        customer_name: vehicle.customer?.full_name || prev.customer_name,
        customer_phone: vehicle.customer?.phone || prev.customer_phone,
        customer_email: vehicle.customer?.email || prev.customer_email,
      }));
    } else {
      setFoundVehicle(null);
    }
    setIsSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createServiceOrder(formData);
    
    if (result) {
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        vehicle_brand: "",
        vehicle_model: "",
        vehicle_year: undefined,
        vehicle_color: "",
        vehicle_plate: "",
        vehicle_mileage: undefined,
        problem_description: "",
        urgency: "normal",
      });
      setFoundVehicle(null);
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-deep-steel border border-white/10 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-deep-steel">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-electric-cyan" />
            Nova Ordem de Serviço
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Vehicle Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-electric-cyan uppercase tracking-wider">
              <Car className="w-4 h-4" />
              Veículo
            </div>

            {/* Plate Search */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-white/70 text-xs">Placa</Label>
                <Input
                  value={formData.vehicle_plate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicle_plate: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="ABC-1234"
                  className="bg-white/5 border-white/10 text-white font-mono uppercase"
                  maxLength={8}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePlateSearch}
                  disabled={isSearching || formData.vehicle_plate.length < 7}
                  className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {foundVehicle && (
              <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm">
                ✓ Veículo encontrado! Dados preenchidos automaticamente.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-xs">Marca</Label>
                <Input
                  value={formData.vehicle_brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vehicle_brand: e.target.value }))
                  }
                  placeholder="Toyota"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/70 text-xs">Modelo</Label>
                <Input
                  value={formData.vehicle_model}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vehicle_model: e.target.value }))
                  }
                  placeholder="Corolla"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/70 text-xs">Ano</Label>
                <Input
                  type="number"
                  value={formData.vehicle_year || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicle_year: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  placeholder="2022"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70 text-xs">Cor</Label>
                <Input
                  value={formData.vehicle_color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vehicle_color: e.target.value }))
                  }
                  placeholder="Prata"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-white/70 text-xs">Quilometragem</Label>
                <Input
                  type="number"
                  value={formData.vehicle_mileage || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicle_mileage: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  placeholder="45000"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Customer Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-electric-cyan uppercase tracking-wider">
              <User className="w-4 h-4" />
              Cliente
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-white/70 text-xs">Nome</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customer_name: e.target.value }))
                  }
                  placeholder="João da Silva"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/70 text-xs">Telefone</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customer_phone: e.target.value }))
                  }
                  placeholder="(11) 99999-1234"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/70 text-xs">E-mail (opcional)</Label>
                <Input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customer_email: e.target.value }))
                  }
                  placeholder="joao@email.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Service Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-electric-cyan uppercase tracking-wider">
              <Wrench className="w-4 h-4" />
              Serviço
            </div>

            <div>
              <Label className="text-white/70 text-xs">Descrição do Problema</Label>
              <Textarea
                value={formData.problem_description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, problem_description: e.target.value }))
                }
                placeholder="Descreva o problema relatado pelo cliente..."
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label className="text-white/70 text-xs mb-2 block">Urgência</Label>
              <div className="flex gap-2">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, urgency: option.value }))
                    }
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                      formData.urgency === option.value
                        ? option.color
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10 text-white/70 hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 cyan-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar OS"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
