import { Card } from "@/components/ui/card";
import { Lock, HandMetal, ShieldOff, RefreshCw, BookOpen } from "lucide-react";

const conditions = [
  {
    icon: Lock,
    title: "Mutual Exclusion",
    desc: "At least one resource is held in non-shareable mode; only one process can use it at a time.",
  },
  {
    icon: HandMetal,
    title: "Hold and Wait",
    desc: "A process is holding at least one resource while waiting to acquire additional resources held by others.",
  },
  {
    icon: ShieldOff,
    title: "No Preemption",
    desc: "Resources cannot be forcibly taken from a process; they must be released voluntarily.",
  },
  {
    icon: RefreshCw,
    title: "Circular Wait",
    desc: "A closed chain of processes exists, where each holds a resource needed by the next.",
  },
];

export const AlgorithmPanel = () => {
  return (
    <Card className="p-5 space-y-5 shadow-card bg-gradient-card">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">Algorithm Reference</h3>
          <p className="text-[11px] text-muted-foreground">Coffman's four conditions</p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Resource Allocation Graph</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          A directed graph where vertices represent processes (P) and resources (R).
          A <span className="font-mono text-foreground">P → R</span> edge denotes a request;
          an <span className="font-mono text-foreground">R → P</span> edge denotes an allocation.
          A cycle in this graph (with single-instance resources) indicates a deadlock.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground">Necessary Conditions</h4>
        {conditions.map((c, i) => (
          <div key={c.title} className="flex gap-3 group">
            <div className="flex-shrink-0 w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
              <c.icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">0{i + 1}</span>
                <h5 className="text-xs font-semibold">{c.title}</h5>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
