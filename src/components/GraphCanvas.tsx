import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import cytoscape, { Core, ElementDefinition } from "cytoscape";
import { RAGState, CycleResult } from "@/lib/rag";

export interface GraphCanvasHandle {
  exportPng: () => string | null;
  fit: () => void;
}

interface GraphCanvasProps {
  state: RAGState;
  cycle: CycleResult;
  highlightedNodes?: string[];
  highlightedEdges?: string[];
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(
  ({ state, cycle, highlightedNodes = [], highlightedEdges = [] }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<Core | null>(null);

    useImperativeHandle(ref, () => ({
      exportPng: () => {
        if (!cyRef.current) return null;
        return cyRef.current.png({ full: true, scale: 2, bg: "#ffffff" });
      },
      fit: () => cyRef.current?.fit(undefined, 40),
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const elements: ElementDefinition[] = [
        ...state.nodes.map((n) => ({
          data: { id: n.id, label: n.label, type: n.type },
        })),
        ...state.edges.map((e) => ({
          data: { id: e.id, source: e.source, target: e.target, type: e.type },
        })),
      ];

      const cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              color: "#ffffff",
              "font-family": "JetBrains Mono, monospace",
              "font-weight": 600,
              "font-size": 16,
              "border-width": 3,
              "border-color": "#ffffff",
              "transition-property": "background-color, border-color, border-width",
              "transition-duration": 300,
            },
          },
          {
            selector: 'node[type = "process"]',
            style: {
              shape: "ellipse",
              "background-color": "hsl(217, 91%, 55%)",
              width: 60,
              height: 60,
              "border-color": "hsl(217, 91%, 70%)",
            },
          },
          {
            selector: 'node[type = "resource"]',
            style: {
              shape: "round-rectangle",
              "background-color": "hsl(25, 95%, 55%)",
              width: 60,
              height: 60,
              "border-color": "hsl(25, 95%, 70%)",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2.5,
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "arrow-scale": 1.4,
              "font-family": "Inter, sans-serif",
              "font-size": 11,
              "transition-property": "line-color, target-arrow-color, width",
              "transition-duration": 300,
            },
          },
          {
            selector: 'edge[type = "request"]',
            style: {
              "line-color": "hsl(222, 47%, 25%)",
              "target-arrow-color": "hsl(222, 47%, 25%)",
              "line-style": "dashed",
            },
          },
          {
            selector: 'edge[type = "allocation"]',
            style: {
              "line-color": "hsl(142, 70%, 40%)",
              "target-arrow-color": "hsl(142, 70%, 40%)",
            },
          },
          {
            selector: ".cycle-node",
            style: {
              "border-color": "hsl(0, 84%, 55%)",
              "border-width": 5,
              "background-color": "hsl(0, 84%, 55%)",
            },
          },
          {
            selector: ".cycle-edge",
            style: {
              "line-color": "hsl(0, 84%, 55%)",
              "target-arrow-color": "hsl(0, 84%, 55%)",
              width: 4,
              "line-style": "solid",
            },
          },
          {
            selector: ".highlight",
            style: {
              "border-color": "hsl(38, 95%, 50%)",
              "border-width": 6,
            },
          },
        ],
        layout: {
          name: "cose",
          animate: true,
          animationDuration: 600,
          padding: 50,
          nodeRepulsion: () => 8000,
          idealEdgeLength: () => 110,
        } as cytoscape.LayoutOptions,
        wheelSensitivity: 0.2,
      });

      cyRef.current = cy;

      // Apply cycle highlighting
      if (cycle.hasCycle) {
        cycle.cycleNodes.forEach((id) => cy.getElementById(id).addClass("cycle-node"));
        cycle.cycleEdges.forEach((id) => cy.getElementById(id).addClass("cycle-edge"));
      }
      highlightedNodes.forEach((id) => cy.getElementById(id).addClass("highlight"));
      highlightedEdges.forEach((id) => cy.getElementById(id).addClass("highlight"));

      return () => {
        cy.destroy();
        cyRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, cycle, highlightedNodes.join(","), highlightedEdges.join(",")]);

    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-card grid-bg">
        <div ref={containerRef} className="w-full h-full" />
        {state.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-muted-foreground font-display text-lg">
              Add processes and resources to begin
            </p>
          </div>
        )}
      </div>
    );
  }
);

GraphCanvas.displayName = "GraphCanvas";
