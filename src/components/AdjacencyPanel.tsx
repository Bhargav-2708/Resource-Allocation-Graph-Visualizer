import { Card } from "@/components/ui/card";
import { RAGState } from "@/lib/rag";
import { ListTree } from "lucide-react";

interface Props {
  state: RAGState;
}

export const AdjacencyPanel = ({ state }: Props) => {
  // Build adjacency list
  const adj = new Map<string, { target: string; type: string }[]>();
  state.nodes.forEach((n) => adj.set(n.id, []));
  state.edges.forEach((e) => {
    adj.get(e.source)?.push({ target: e.target, type: e.type });
  });

  const entries = Array.from(adj.entries()).filter(([, v]) => v.length > 0);

  return (
    <Card className="p-5 shadow-card bg-gradient-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <ListTree className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">Adjacency List</h3>
          <p className="text-[11px] text-muted-foreground">Process–resource relationships</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No edges yet. Add some to populate.</p>
      ) : (
        <div className="space-y-2 font-mono text-xs">
          {entries.map(([src, targets]) => (
            <div key={src} className="flex items-start gap-2 py-1.5 px-3 rounded-md bg-secondary/50">
              <span className={`font-bold ${src.startsWith("P") ? "text-process" : "text-resource"}`}>
                {src}
              </span>
              <span className="text-muted-foreground">→</span>
              <div className="flex flex-wrap gap-1.5">
                {targets.map((t, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      t.type === "request"
                        ? "bg-foreground/10 text-foreground"
                        : "bg-success/15 text-success"
                    }`}>
                      {t.target}
                    </span>
                    {i < targets.length - 1 && <span className="text-muted-foreground">,</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
