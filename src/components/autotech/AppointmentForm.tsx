"use client";

import { useState } from "react";
import { Car, Clock, User, Phone, Mail, Calendar, Wrench, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppointmentFormData, AppointmentMode } from "@/types";

interface AppointmentFormProps {
  tenantSlug: string;
  tenantName: string;
  onSubmit?: (data: AppointmentFormData) => Promise<{ orderNumber: string; clientHash: string } | void>;
}

export function AppointmentForm({ tenantSlug, tenantName, onSubmit }: AppointmentFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    car_brand: "",
    car_model: "",
    car_year: "",
    car_plate: "",
    service_type: "",
    problem_description: "",
    appointment_mode: "drop_off",
    scheduled_date: "",
    scheduled_time: "",
  });

  const updateField = (field: keyof AppointmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModeSelect = (mode: AppointmentMode) => {
    updateField("appointment_mode", mode);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(formData);
        // Store result for display in success screen
        if (result) {
          (window as any).appointmentResult = result;
        }
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = formData.customer_name && formData.customer_phone;
  const canProceedStep2 = formData.car_brand && formData.car_model && formData.service_type;
  const canProceedStep3 = formData.scheduled_date;

  if (isSuccess) {
    const result = (window as any).appointmentResult;
    return (
      <Card className="glass-card max-w-2xl mx-auto animate-slide-up">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-cyan">
            <CheckCircle className="w-10 h-10 text-neon-green" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Agendamento Confirmado!</h2>
          <p className="text-white/60 mb-6">
            Você receberá um e-mail de confirmação com todos os detalhes.
          </p>
          
          {result ? (
            <div className="space-y-4">
              <div className="glass-card p-4 inline-block">
                <span className="text-sm text-white/50 block mb-1">Ordem de Serviço</span>
                <span className="font-mono text-electric-cyan text-xl tracking-wider block">
                  {result.orderNumber}
                </span>
              </div>
              
              <div className="glass-card p-4 inline-block">
                <span className="text-sm text-white/50 block mb-1">Código de Acompanhamento</span>
                <span className="font-mono text-electric-cyan text-lg tracking-wider block">
                  {result.clientHash}
                </span>
              </div>
              
              <div className="mt-6">
                <a 
                  href={`/status/${result.clientHash}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-electric-cyan text-deep-steel rounded-lg font-semibold hover:bg-electric-cyan/90 transition-colors"
                >
                  Acompanhar Serviço
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card p-4 inline-block">
              <span className="text-sm text-white/50 block mb-1">Protocolo</span>
              <span className="font-mono text-electric-cyan text-xl tracking-wider">
                #AT-{Date.now().toString(36).toUpperCase()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card max-w-2xl mx-auto overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-electric-cyan transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <CardHeader className="border-b border-white/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-electric-cyan" />
            </div>
            Agendar Serviço
          </CardTitle>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono transition-all",
                  step === s && "bg-electric-cyan text-deep-steel font-bold",
                  step > s && "bg-electric-cyan/20 text-electric-cyan",
                  step < s && "bg-white/5 text-white/30"
                )}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Seus Dados</h3>
              <p className="text-white/50 text-sm">Como podemos entrar em contato?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="tech-label flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Nome Completo
                </Label>
                <Input
                  className="tech-input h-12"
                  placeholder="Seu nome"
                  value={formData.customer_name}
                  onChange={(e) => updateField("customer_name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="tech-label flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    WhatsApp / Celular
                  </Label>
                  <Input
                    className="tech-input h-12"
                    placeholder="(00) 00000-0000"
                    value={formData.customer_phone}
                    onChange={(e) => updateField("customer_phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="tech-label flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    E-mail (opcional)
                  </Label>
                  <Input
                    className="tech-input h-12"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.customer_email}
                    onChange={(e) => updateField("customer_email", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="cyan-button w-full h-12"
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle & Service */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Veículo e Serviço</h3>
              <p className="text-white/50 text-sm">Descreva seu veículo e o que precisa</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="tech-label flex items-center gap-2">
                    <Car className="w-3.5 h-3.5" />
                    Marca
                  </Label>
                  <Input
                    className="tech-input h-12"
                    placeholder="Ex: Toyota"
                    value={formData.car_brand}
                    onChange={(e) => updateField("car_brand", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="tech-label">Modelo</Label>
                  <Input
                    className="tech-input h-12"
                    placeholder="Ex: Corolla"
                    value={formData.car_model}
                    onChange={(e) => updateField("car_model", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="tech-label">Ano (opcional)</Label>
                  <Input
                    className="tech-input h-12"
                    placeholder="Ex: 2022"
                    value={formData.car_year}
                    onChange={(e) => updateField("car_year", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="tech-label">Placa (opcional)</Label>
                  <Input
                    className="tech-input h-12 font-mono uppercase"
                    placeholder="ABC-1234"
                    value={formData.car_plate}
                    onChange={(e) => updateField("car_plate", e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="tech-label flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" />
                  Tipo de Serviço
                </Label>
                <Input
                  className="tech-input h-12"
                  placeholder="Ex: Troca de óleo, Revisão completa..."
                  value={formData.service_type}
                  onChange={(e) => updateField("service_type", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="tech-label flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Descrição do Problema (opcional)
                </Label>
                <Textarea
                  className="tech-input min-h-[100px] resize-none"
                  placeholder="Descreva com detalhes o que está acontecendo..."
                  value={formData.problem_description}
                  onChange={(e) => updateField("problem_description", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12 border-white/10 hover:bg-white/5"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
              <Button
                className="cyan-button flex-1 h-12"
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Mode */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Data e Preferência</h3>
              <p className="text-white/50 text-sm">Quando e como você prefere?</p>
            </div>

            <div className="space-y-4">
              {/* Appointment Mode Selection */}
              <div className="space-y-3">
                <Label className="tech-label">Modalidade de Atendimento</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleModeSelect("quick_service")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      formData.appointment_mode === "quick_service"
                        ? "border-electric-cyan bg-electric-cyan/10"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    )}
                  >
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="font-semibold text-white text-sm">Esperar no Local</div>
                    <div className="text-xs text-white/50 mt-1">Quick Service</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeSelect("drop_off")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      formData.appointment_mode === "drop_off"
                        ? "border-electric-cyan bg-electric-cyan/10"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    )}
                  >
                    <div className="text-2xl mb-2">🚗</div>
                    <div className="font-semibold text-white text-sm">Deixar Veículo</div>
                    <div className="text-xs text-white/50 mt-1">Drop-off</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="tech-label flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Data Preferida
                  </Label>
                  <Input
                    type="date"
                    className="tech-input h-12"
                    value={formData.scheduled_date}
                    onChange={(e) => updateField("scheduled_date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="tech-label flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Horário (opcional)
                  </Label>
                  <Input
                    type="time"
                    className="tech-input h-12"
                    value={formData.scheduled_time}
                    onChange={(e) => updateField("scheduled_time", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-4 space-y-3">
              <div className="text-xs text-white/50 uppercase tracking-wider">Resumo</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-white/60">Veículo:</div>
                <div className="text-white font-medium">
                  {formData.car_brand} {formData.car_model}
                </div>
                <div className="text-white/60">Serviço:</div>
                <div className="text-white font-medium">{formData.service_type}</div>
                <div className="text-white/60">Modalidade:</div>
                <div className="text-electric-cyan font-medium">
                  {formData.appointment_mode === "quick_service" ? "Esperar" : "Deixar Veículo"}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12 border-white/10 hover:bg-white/5"
                onClick={() => setStep(2)}
              >
                Voltar
              </Button>
              <Button
                className="cyan-button flex-1 h-12"
                onClick={handleSubmit}
                disabled={!canProceedStep3 || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-deep-steel/30 border-t-deep-steel rounded-full animate-spin" />
                    Agendando...
                  </span>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
