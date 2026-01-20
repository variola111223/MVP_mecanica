"use client";

import { AppointmentStatus, STATUS_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
}

export function StatusBadge({ status, size = "md", showPulse = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const isActive = ["in_repair", "diagnosing", "testing"].includes(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded uppercase tracking-wider font-mono",
        config.bgClass,
        config.color,
        sizeClasses[size]
      )}
    >
      {(showPulse || isActive) && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              status === "in_repair" && "bg-warning-yellow",
              status === "diagnosing" && "bg-electric-cyan",
              status === "testing" && "bg-electric-cyan",
              !["in_repair", "diagnosing", "testing"].includes(status) && "bg-current"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              status === "in_repair" && "bg-warning-yellow",
              status === "diagnosing" && "bg-electric-cyan",
              status === "testing" && "bg-electric-cyan",
              !["in_repair", "diagnosing", "testing"].includes(status) && "bg-current"
            )}
          />
        </span>
      )}
      {config.label}
    </span>
  );
}
