import { Circle, Square } from "lucide-react";

export const Legend = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-process flex items-center justify-center text-[9px] font-mono text-white font-bold">P</div>
        <span className="text-muted-foreground">Process</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-sm bg-resource flex items-center justify-center text-[9px] font-mono text-white font-bold">R</div>
        <span className="text-muted-foreground">Resource</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 border-t-2 border-dashed border-foreground" />
        <span className="text-muted-foreground">Request →</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 border-t-2 border-success" />
        <span className="text-muted-foreground">Allocation →</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 border-t-[3px] border-destructive" />
        <span className="text-muted-foreground">Deadlock cycle</span>
      </div>
    </div>
  );
};
