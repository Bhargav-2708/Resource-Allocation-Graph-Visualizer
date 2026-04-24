import { Card } from "@/components/ui/card";
import { CycleResult } from "@/lib/rag";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
  cycle: CycleResult;
  hasNodes: boolean;
}

export const DeadlockStatus = ({ cycle, hasNodes }: Props) => {
  if (!hasNodes) {
    return (
      <Card className="p-5 shadow-card bg-gradient-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm">Awaiting Graph</h3>
            <p className="text-xs text-muted-foreground">Build a graph to analyze.</p>
          </div>
        </div>
      </Card>
    );
  }

  if (cycle.hasCycle) {
    return (
      <Card className="p-5 shadow-card border-destructive/30 bg-destructive/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0 animate-pulse-ring">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm text-destructive">Deadlock Found</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              A circular wait was detected — the highlighted cycle proves the system is deadlocked.
            </p>
            <div className="mt-3 p-2.5 rounded-md bg-card font-mono text-[11px] text-foreground border border-destructive/20">
              {cycle.cycleNodes.join(" → ")} → {cycle.cycleNodes[0]}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Each process in the cycle holds a resource the next process needs.
              No process can proceed → all conditions of Coffman's deadlock theorem are satisfied.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 shadow-card border-success/30 bg-success/5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-success-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-sm text-success">No Deadlock Detected</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            The current resource allocation graph contains no cycles.
            All processes can complete in some valid execution order.
          </p>
        </div>
      </div>
    </Card>
  );
};
