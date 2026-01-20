"use client";

import { Car, Clock, DollarSign, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTenant } from "./TenantContext";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
          <p className={cn("text-2xl font-bold font-mono", color)}>{value}</p>
          {trend && (
            <p className="text-xs text-neon-green flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", `bg-${color.replace("text-", "")}/10`)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsHeader() {
  const { tenant } = useTenant();

  // Mock stats for now - will be replaced with real data
  const stats = {
    todayOrders: 5,
    inProgress: 12,
    waitingParts: 3,
    completedToday: 8,
    weekRevenue: 15420,
    avgCompletionTime: "2.5 dias",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
      <StatCard
        label="Hoje"
        value={stats.todayOrders}
        icon={<Car className="w-5 h-5 text-electric-cyan" />}
        color="text-electric-cyan"
      />
      <StatCard
        label="Em Andamento"
        value={stats.inProgress}
        icon={<Clock className="w-5 h-5 text-warning-yellow" />}
        color="text-warning-yellow"
      />
      <StatCard
        label="Aguard. Peça"
        value={stats.waitingParts}
        icon={<AlertCircle className="w-5 h-5 text-pending-orange" />}
        color="text-pending-orange"
      />
      <StatCard
        label="Finalizados"
        value={stats.completedToday}
        icon={<CheckCircle className="w-5 h-5 text-neon-green" />}
        color="text-neon-green"
      />
      <StatCard
        label="Faturamento"
        value={`R$ ${(stats.weekRevenue / 1000).toFixed(1)}k`}
        icon={<DollarSign className="w-5 h-5 text-neon-green" />}
        color="text-neon-green"
        trend="+12% vs semana passada"
      />
      <StatCard
        label="Tempo Médio"
        value={stats.avgCompletionTime}
        icon={<TrendingUp className="w-5 h-5 text-electric-cyan" />}
        color="text-electric-cyan"
      />
    </div>
  );
}
