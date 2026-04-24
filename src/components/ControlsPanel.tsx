import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { RAGState } from "@/lib/rag";
import {
  Circle,
  Square as SquareIcon,
  ArrowRight,
  Play,
  RotateCcw,
  Trash2,
  Wand2,
  Download,
  StepForward,
} from "lucide-react";

interface Props {
  state: RAGState;
  onAddProcess: () => void;
  onAddResource: () => void;
  onAddEdge: (source: string, target: string, type: "request" | "allocation") => void;
  onRunDetection: () => void;
  onReset: () => void;
  onClear: () => void;
  onLoadExample: () => void;
  onExport: () => void;
  onStartDemo: () => void;
}

export const ControlsPanel = ({
  state,
  onAddProcess,
  onAddResource,
  onAddEdge,
  onRunDetection,
  onReset,
  onClear,
  onLoadExample,
  onExport,
  onStartDemo,
}: Props) => {
  const [edgeOpen, setEdgeOpen] = useState(false);
  const [edgeType, setEdgeType] = useState<"request" | "allocation">("request");
  const [src, setSrc] = useState<string>("");
  const [tgt, setTgt] = useState<string>("");

  const processes = state.nodes.filter((n) => n.type === "process");
  const resources = state.nodes.filter((n) => n.type === "resource");

  const sources = edgeType === "request" ? processes : resources;
  const targets = edgeType === "request" ? resources : processes;

  const handleSubmitEdge = () => {
    if (!src || !tgt) return;
    onAddEdge(src, tgt, edgeType);
    setSrc("");
    setTgt("");
    setEdgeOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onAddProcess} variant="process" size="sm" className="justify-start">
          <Circle className="w-4 h-4 mr-2 fill-current" />
          Process
        </Button>
        <Button onClick={onAddResource} variant="resource" size="sm" className="justify-start">
          <SquareIcon className="w-4 h-4 mr-2 fill-current" />
          Resource
        </Button>
      </div>

      <Dialog open={edgeOpen} onOpenChange={setEdgeOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <ArrowRight className="w-4 h-4 mr-2" />
            Add Edge
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an edge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Edge type</Label>
              <Select value={edgeType} onValueChange={(v) => { setEdgeType(v as never); setSrc(""); setTgt(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="request">Request (Process → Resource)</SelectItem>
                  <SelectItem value="allocation">Allocation (Resource → Process)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={src} onValueChange={setSrc}>
                  <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>
                    {sources.map((n) => (
                      <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Select value={tgt} onValueChange={setTgt}>
                  <SelectTrigger><SelectValue placeholder="Target" /></SelectTrigger>
                  <SelectContent>
                    {targets.map((n) => (
                      <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdgeOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEdge} disabled={!src || !tgt}>Add Edge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="h-px bg-border" />

      <div className="space-y-2">
        <Button onClick={onRunDetection} variant="hero" size="sm" className="w-full justify-start">
          <Play className="w-4 h-4 mr-2" />
          Run Detection
        </Button>
        <Button onClick={onStartDemo} variant="outline" size="sm" className="w-full justify-start">
          <StepForward className="w-4 h-4 mr-2" />
          Step-by-Step Demo
        </Button>
        <Button onClick={onLoadExample} variant="outline" size="sm" className="w-full justify-start">
          <Wand2 className="w-4 h-4 mr-2" />
          Load Example Deadlock
        </Button>
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-2">
        <Button onClick={onExport} variant="outline" size="sm" className="w-full justify-start">
          <Download className="w-4 h-4 mr-2" />
          Export as PNG
        </Button>
        <Button onClick={onReset} variant="ghost" size="sm" className="w-full justify-start">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={onClear} variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
};
