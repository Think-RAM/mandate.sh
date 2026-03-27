"use client";

import { WorkflowStatus } from "@/utils/types";
import { cn } from "@repo/ui/lib/utils";

export default function StatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        status === "interrupt" && "bg-primary/10 text-primary",
        status === "running" && "bg-secondary text-secondary-foreground",
        status === "completed" && "bg-green-100 text-green-700",
        status === "error" && "bg-destructive/10 text-destructive",
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          status === "running" && "animate-pulse bg-secondary-foreground",
          status === "interrupt" && "bg-primary",
          status === "completed" && "bg-green-600",
          status === "error" && "bg-destructive",
        )}
      />
      {status === "interrupt"
        ? "Waiting for response"
        : status === "running"
          ? "Processing..."
          : status === "completed"
            ? "Completed"
            : "Error"}
    </div>
  );
}
