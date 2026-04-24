import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Waypoints,
  Circle,
  Square,
  AlertTriangle,
  GitBranch,
  Sparkles,
  Network,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background bg-mesh">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center text-primary">
              <Waypoints className="w-7 h-7" />
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">RAG Visualizer</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Operating Systems</p>
            </div>
          </div>
          <Link to="/simulator">
            <Button variant="hero" size="sm">
              Launch Simulator <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary">
            <Sparkles className="w-3 h-3" />
            <span>Operating Systems Mini Project</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Resource Allocation
            <br />
            <span className="text-primary select-none">Graph Visualizer</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore process–resource relationships, model contention, and
            detect deadlocks through interactive cycle visualization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link to="/simulator">
              <Button variant="hero" size="lg">
                Start Simulation <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="#concepts">
              <Button variant="outline" size="lg">Learn the concepts</Button>
            </a>
          </div>
        </div>

        {/* Visual diagram */}
        <div className="max-w-4xl mx-auto mt-20 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Card className="p-8 md:p-12 shadow-card bg-gradient-card">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-process mx-auto flex items-center justify-center shadow-glow text-white font-mono font-bold text-2xl">
                  P1
                </div>
                <p className="text-xs font-mono text-muted-foreground">PROCESS</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-foreground">P → R</span>
                  <span className="text-muted-foreground">request</span>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-process via-foreground to-resource" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-success">R → P</span>
                  <span className="text-muted-foreground">allocation</span>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-resource mx-auto flex items-center justify-center shadow-md text-white font-mono font-bold text-2xl">
                  R1
                </div>
                <p className="text-xs font-mono text-muted-foreground">RESOURCE</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Concepts */}
      <section id="concepts" className="container py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Core Concepts</h2>
          <p className="text-muted-foreground">
            Everything you need to understand resource allocation graphs and how deadlocks emerge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Circle,
              color: "process",
              title: "Process Nodes",
              desc: "Represented as circles (P1, P2, …). Each is an active entity that holds and requests resources during execution.",
            },
            {
              icon: Square,
              color: "resource",
              title: "Resource Nodes",
              desc: "Represented as squares (R1, R2, …). Each is a system asset (file, lock, device) that processes contend for.",
            },
            {
              icon: GitBranch,
              color: "primary",
              title: "Request Edge",
              desc: "A directed edge P → R meaning process P is waiting for resource R to become available.",
            },
            {
              icon: GitBranch,
              color: "success",
              title: "Allocation Edge",
              desc: "A directed edge R → P meaning resource R is currently held by process P.",
            },
            {
              icon: AlertTriangle,
              color: "destructive",
              title: "Circular Wait",
              desc: "A closed chain of processes each waiting for a resource held by the next — the smoking gun of a deadlock.",
            },
            {
              icon: Network,
              color: "primary",
              title: "Deadlock",
              desc: "When all four Coffman conditions hold and a cycle exists in the RAG, no process in the cycle can ever proceed.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="p-6 shadow-card bg-gradient-card hover:shadow-lg transition-smooth group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-${item.color}/10 text-${item.color} group-hover:scale-110 transition-bounce`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <Card className="p-10 md:p-16 text-center shadow-card bg-gradient-hero text-primary-foreground border-0 overflow-hidden relative">
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              Ready to detect a deadlock?
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Open the simulator, drop in some processes and resources, and watch
              cycle detection light up the deadlocked path in real time.
            </p>
            <Link to="/simulator">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                Launch the simulator <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container py-10 text-center space-y-2">
          <p className="font-display font-semibold">Resource Allocation Graph Visualizer</p>
          <p className="text-xs text-muted-foreground">
            Operating Systems Mini Project · Built for academic demonstration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
