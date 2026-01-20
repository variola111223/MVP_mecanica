"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { AppointmentStatus, TIMELINE_STEPS, STATUS_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface RepairTimelineProps {
  currentStatus: AppointmentStatus;
  statusHistory?: { status: AppointmentStatus; changed_at: string }[];
}

const STEP_ICONS: Record<string, string> = {
  received: "📥",
  quote_pending: "📋",
  in_repair: "🔧",
  testing: "🚗",
  completed: "✅",
};

export function RepairTimeline({ currentStatus, statusHistory = [] }: RepairTimelineProps) {
  const getCurrentStepIndex = () => {
    return TIMELINE_STEPS.indexOf(currentStatus);
  };

  const isStepCompleted = (step: AppointmentStatus) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = TIMELINE_STEPS.indexOf(step);
    return stepIndex < currentIndex || currentStatus === "delivered";
  };

  const isCurrentStep = (step: AppointmentStatus) => {
    return step === currentStatus;
  };

  const getStepTime = (step: AppointmentStatus) => {
    const historyEntry = statusHistory.find((h) => h.status === step);
    if (!historyEntry) return null;
    return new Date(historyEntry.changed_at).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center justify-center p-8 glass-card rounded-lg border-red-500/30">
        <div className="text-center">
          <span className="text-4xl mb-3 block">❌</span>
          <span className="text-red-500 font-semibold">Serviço Cancelado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        {TIMELINE_STEPS.map((step, index) => {
          const completed = isStepCompleted(step);
          const current = isCurrentStep(step);
          const config = STATUS_CONFIG[step];
          const stepTime = getStepTime(step);

          return (
            <div key={step} className="flex flex-col items-center relative flex-1">
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-1/2 w-full h-0.5",
                    completed ? "bg-electric-cyan" : "bg-white/10"
                  )}
                />
              )}

              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-lg flex items-center justify-center text-lg border-2 transition-all duration-300",
                  completed && "bg-electric-cyan/20 border-electric-cyan text-electric-cyan",
                  current && "bg-warning-yellow/20 border-warning-yellow text-warning-yellow animate-pulse-cyan",
                  !completed && !current && "bg-white/5 border-white/20 text-white/30"
                )}
              >
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : current ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-sm">{STEP_ICONS[step]}</span>
                )}
              </div>

              <div className="mt-3 text-center">
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider block",
                    completed && "text-electric-cyan",
                    current && "text-warning-yellow",
                    !completed && !current && "text-white/40"
                  )}
                >
                  {config.label}
                </span>
                {stepTime && (
                  <span className="text-[10px] text-white/30 mt-1 block font-mono">
                    {stepTime}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
