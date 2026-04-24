import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GraphCanvas, GraphCanvasHandle } from "@/components/GraphCanvas";
import { ControlsPanel } from "@/components/ControlsPanel";
import { Legend } from "@/components/Legend";
import { AlgorithmPanel } from "@/components/AlgorithmPanel";
import { AdjacencyPanel } from "@/components/AdjacencyPanel";
import { DeadlockStatus } from "@/components/DeadlockStatus";
import {
  RAGState,
  detectCycle,
  exampleDeadlock,
  exampleSafe,
  nextProcessId,
  nextResourceId,
} from "@/lib/rag";
import { Network, ArrowLeft, Maximize2, Settings2, MonitorPlay, Waypoints } from "lucide-react";

const initialState = (): RAGState => exampleSafe();

const Simulator = () => {
  const [state, setState] = useState<RAGState>(initialState);
  const [demoStep, setDemoStep] = useState<number>(-1); // -1 = inactive
  const canvasRef = useRef<GraphCanvasHandle>(null);

  const cycle = useMemo(() => detectCycle(state), [state]);

  // Step-by-step demo: progressively builds the example deadlock
  const demoState: RAGState = useMemo(() => {
    if (demoStep < 0) return state;
    const full = exampleDeadlock();
    return {
      nodes: full.nodes,
      edges: full.edges.slice(0, demoStep),
    };
  }, [demoStep, state]);

  const demoCycle = useMemo(() => detectCycle(demoState), [demoState]);

  const activeState = demoStep >= 0 ? demoState : state;
  const activeCycle = demoStep >= 0 ? demoCycle : cycle;

  const demoMessages = [
    "Initial system: 2 processes (P1, P2) and 2 resources (R1, R2). No edges yet.",
    "Step 1 — P1 requests R1. A request edge P1 → R1 is added.",
    "Step 2 — R1 is allocated to P2. Allocation edge R1 → P2 added.",
    "Step 3 — P2 now requests R2. Request edge P2 → R2 added.",
    "Step 4 — R2 is allocated to P1. The cycle closes — DEADLOCK!",
  ];

  const handleAddProcess = () => {
    const id = nextProcessId(state);
    setState({ ...state, nodes: [...state.nodes, { id, type: "process", label: id }] });
    toast.success(`Added process ${id}`);
  };

  const handleAddResource = () => {
    const id = nextResourceId(state);
    setState({ ...state, nodes: [...state.nodes, { id, type: "resource", label: id }] });
    toast.success(`Added resource ${id}`);
  };

  const handleAddEdge = (source: string, target: string, type: "request" | "allocation") => {
    const exists = state.edges.some((e) => e.source === source && e.target === target);
    if (exists) {
      toast.error("Edge already exists");
      return;
    }
    const id = `e${Date.now()}`;
    setState({ ...state, edges: [...state.edges, { id, source, target, type }] });
    toast.success(`Added ${type} edge ${source} → ${target}`);
  };

  const handleRunDetection = () => {
    if (cycle.hasCycle) {
      toast.error(`Deadlock detected: ${cycle.cycleNodes.join(" → ")} → ${cycle.cycleNodes[0]}`);
    } else {
      toast.success("No deadlock — system is safe.");
    }
  };

  const handleReset = () => {
    setDemoStep(-1);
    setState(exampleSafe());
    toast("Reset to default safe scenario");
  };

  const handleClear = () => {
    setDemoStep(-1);
    setState({ nodes: [], edges: [] });
    toast("Cleared all");
  };

  const handleLoadExample = () => {
    setDemoStep(-1);
    setState(exampleDeadlock());
    toast.error("Loaded example with deadlock cycle");
  };

  const handleExport = () => {
    const png = canvasRef.current?.exportPng();
    if (!png) return toast.error("Nothing to export");
    const link = document.createElement("a");
    link.href = png;
    link.download = "resource-allocation-graph.png";
    link.click();
    toast.success("Exported as PNG");
  };

  const handleStartDemo = () => {
    setDemoStep(0);
  };

  const advanceDemo = () => {
    setDemoStep((s) => Math.min(s + 1, 4));
  };

  const exitDemo = () => {
    setDemoStep(-1);
  };

  // Auto-fit on changes
  useEffect(() => {
    const t = setTimeout(() => canvasRef.current?.fit(), 700);
    return () => clearTimeout(t);
  }, [activeState]);

  return (
    <div className="min-h-screen bg-background bg-mesh flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Waypoints className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-sm hidden sm:inline">RAG Visualizer</span>
            </Link>
            <span className="text-muted-foreground text-xs hidden md:inline">/ Simulator</span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main grid */}
      <main className="flex-1 container py-5">
        <div className="grid grid-cols-12 gap-5">
          {/* Left controls */}
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            <Card className="p-5 shadow-card bg-gradient-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">Controls</h3>
                  <p className="text-[11px] text-muted-foreground">Manage simulation</p>
                </div>
              </div>
              <ControlsPanel
                state={state}
                onAddProcess={handleAddProcess}
                onAddResource={handleAddResource}
                onAddEdge={handleAddEdge}
                onRunDetection={handleRunDetection}
                onReset={handleReset}
                onClear={handleClear}
                onLoadExample={handleLoadExample}
                onExport={handleExport}
                onStartDemo={handleStartDemo}
              />
            </Card>
            <AlgorithmPanel />
          </aside>

          {/* Center canvas */}
          <section className="col-span-12 lg:col-span-6 space-y-4">
            <Card className="p-5 shadow-card bg-gradient-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MonitorPlay className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-sm">Graph Canvas</h2>
                    <p className="text-[11px] text-muted-foreground">
                      {activeState.nodes.length} nodes · {activeState.edges.length} edges
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => canvasRef.current?.fit()}
                  className="h-8 w-8"
                  title="Fit to view"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-[480px]">
                <GraphCanvas ref={canvasRef} state={activeState} cycle={activeCycle} />
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Legend />
              </div>
            </Card>

            {/* Demo strip */}
            {demoStep >= 0 && (
              <Card className="p-5 shadow-card border-primary/30 bg-primary/5 animate-fade-up">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] font-mono text-primary uppercase tracking-wider">
                      Step-by-Step Demo · {demoStep + 1} / 5
                    </p>
                    <p className="text-sm font-medium mt-1">{demoMessages[demoStep]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={advanceDemo} disabled={demoStep >= 4}>
                    {demoStep >= 4 ? "Demo complete" : "Next step"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={exitDemo}>
                    Exit demo
                  </Button>
                </div>
                <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-hero transition-smooth"
                    style={{ width: `${((demoStep + 1) / 5) * 100}%` }}
                  />
                </div>
              </Card>
            )}

            <DeadlockStatus cycle={activeCycle} hasNodes={activeState.nodes.length > 0} />
          </section>

          {/* Right adjacency */}
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            <AdjacencyPanel state={activeState} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 mt-6">
        <div className="container py-6 text-center space-y-1">
          <p className="font-display font-semibold text-sm">Resource Allocation Graph Visualizer</p>
          <p className="text-[11px] text-muted-foreground">
            Operating Systems Mini Project · Resource Allocation Graph Visualizer
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Simulator;
