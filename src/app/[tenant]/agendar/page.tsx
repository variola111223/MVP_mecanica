"use client";

import { useState, useEffect } from "react";
import { AppointmentForm, TechBackground } from "@/components/autotech";
import { Wrench, Shield, Clock, Star } from "lucide-react";
import { getTenantBySlug, createPublicServiceOrder } from "@/lib/supabase/public-queries";
import type { AppointmentFormData } from "@/types";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default function AgendarPage({ params }: Props) {
  const [tenant, setTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenant = async () => {
      const { tenant: tenantSlug } = await params;
      try {
        const tenantData = await getTenantBySlug(tenantSlug);
        if (!tenantData) {
          setError("Oficina não encontrada");
        } else {
          setTenant(tenantData);
        }
      } catch (err) {
        setError("Erro ao carregar oficina");
      } finally {
        setIsLoading(false);
      }
    };
    loadTenant();
  }, [params]);

  const handleSubmit = async (formData: AppointmentFormData) => {
    if (!tenant) {
      throw new Error("Oficina não encontrada");
    }

    try {
      const serviceOrder = await createPublicServiceOrder(tenant.id, {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || undefined,
        car_brand: formData.car_brand,
        car_model: formData.car_model,
        car_year: formData.car_year || undefined,
        car_plate: formData.car_plate || undefined,
        service_type: formData.service_type,
        problem_description: formData.problem_description || "",
      });

      console.log("Service order created:", serviceOrder);
      
      // Return order number and hash to display to the user
      return {
        orderNumber: serviceOrder.order_number,
        clientHash: serviceOrder.client_hash,
      };
    } catch (error) {
      console.error("Error creating service order:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-steel flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-deep-steel flex items-center justify-center">
        <div className="text-white">{error || "Oficina não encontrada"}</div>
      </div>
    );
  }

  const tenantName = tenant.name;

  return (
    <div className="min-h-screen relative">
      <TechBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-electric-cyan" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">{tenantName}</h1>
                  <span className="text-xs text-white/40 font-mono">AUTOTECH.COM/{tenant.slug.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-neon-green text-xs">
                  <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan text-sm mb-6">
                <Clock className="w-4 h-4" />
                Agendamento Online 24h
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Agende seu <span className="text-electric-cyan">serviço</span>
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Transparência total. Acompanhe cada etapa do reparo do seu veículo em tempo real.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Garantia de Serviço</div>
                  <div className="text-white/50 text-xs">90 dias em todos os reparos</div>
                </div>
              </div>

              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-electric-cyan" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Acompanhamento Real-time</div>
                  <div className="text-white/50 text-xs">Status atualizado a cada etapa</div>
                </div>
              </div>

              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-yellow/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning-yellow" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Avaliação 4.9/5</div>
                  <div className="text-white/50 text-xs">+500 clientes satisfeitos</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <AppointmentForm 
              tenantSlug={tenant.slug} 
              tenantName={tenantName}
              onSubmit={handleSubmit}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="text-white/30 text-sm">
              Powered by <span className="text-electric-cyan font-mono">AUTOTECH</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
