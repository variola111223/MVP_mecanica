"use client";

import { useState, useEffect } from "react";
import { getServiceOrderByHash } from "@/lib/supabase/queries";
import { TechBackground } from "@/components/autotech";
import { Car, User, Phone, Clock, CheckCircle, Wrench, FileText, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface StatusPageProps {
  params: Promise<{ hash: string }>;
}

const STATUS_STEPS = [
  { id: "entrada", label: "Recebido", icon: FileText, description: "Veículo recebido na oficina" },
  { id: "orcamento", label: "Em Análise", icon: FileText, description: "Orçamento sendo preparado" },
  { id: "aguardando_pecas", label: "Aguardando Peças", icon: Truck, description: "Aguardando chegada de peças" },
  { id: "execucao", label: "Em Execução", icon: Wrench, description: "Serviço em andamento" },
  { id: "finalizado", label: "Pronto para Retirada", icon: CheckCircle, description: "Veículo pronto para retirada" },
];

export default function ClientStatusPage({ params }: StatusPageProps) {
  const [hash, setHash] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadHash = async () => {
      const { hash: hashParam } = await params;
      setHash(hashParam);
    };
    loadHash();
  }, [params]);

  useEffect(() => {
    if (hash) {
      fetchOrder();
    }
  }, [hash]);

  const fetchOrder = async () => {
    if (!hash) return;
    
    setIsLoading(true);
    try {
      const orderData = await getServiceOrderByHash(hash);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrder();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-steel flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!order) {
    return notFound();
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.id === order.status);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-deep-steel relative">
      <TechBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 mb-4">
            <Wrench className="w-4 h-4 text-electric-cyan" />
            <span className="text-electric-cyan font-medium text-sm">AutoTech</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">
              Acompanhe seu Veículo
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <p className="text-white/50 text-sm">
            Ordem de Serviço: <span className="font-mono text-electric-cyan">{order.order_number}</span>
          </p>
        </div>

        {/* Vehicle Card */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
              <Car className="w-6 h-6 text-electric-cyan" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                {order.vehicle?.brand} {order.vehicle?.model}
              </h2>
              <div className="flex items-center gap-3 text-sm text-white/50 mt-1">
                <span className="font-mono bg-white/5 px-2 py-0.5 rounded">
                  {order.vehicle?.plate}
                </span>
                {order.vehicle?.year && <span>{order.vehicle.year}</span>}
                {order.vehicle?.color && <span>{order.vehicle.color}</span>}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-white/40" />
              <span className="text-white/70">{order.customer?.full_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-white/40" />
              <span className="text-white/70">{order.customer?.phone}</span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
            Status do Serviço
          </h3>

          <div className="space-y-0">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Line */}
                  {index < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 w-0.5 h-12 ${
                        isCompleted ? "bg-neon-green" : "bg-white/10"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-neon-green/20 border-2 border-neon-green"
                        : isCurrent
                        ? "bg-electric-cyan/20 border-2 border-electric-cyan animate-pulse"
                        : "bg-white/5 border-2 border-white/10"
                    }`}
                  >
                    <StepIcon
                      className={`w-5 h-5 ${
                        isCompleted
                          ? "text-neon-green"
                          : isCurrent
                          ? "text-electric-cyan"
                          : "text-white/30"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <h4
                      className={`font-semibold ${
                        isCompleted
                          ? "text-neon-green"
                          : isCurrent
                          ? "text-electric-cyan"
                          : "text-white/40"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-sm text-white/40 mt-0.5">{step.description}</p>
                    {isCurrent && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-electric-cyan/10 text-electric-cyan text-xs">
                        <Clock className="w-3 h-3" />
                        Em andamento
                      </div>
                    )}
                    {isCompleted && index === 0 && order.received_at && (
                      <p className="text-xs text-white/30 mt-1">
                        {formatDate(order.received_at)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem Description */}
        {order.problem_description && (
          <div className="glass-card rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Descrição do Problema
            </h3>
            <p className="text-white/70 text-sm">{order.problem_description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-white/30 text-xs">
          <p>Dúvidas? Entre em contato com a oficina.</p>
          <p className="mt-1">Este link é exclusivo para você.</p>
          <p className="mt-2">
            Atualizado em: {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
