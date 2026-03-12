import { delayEvents } from "@/data/mock-data";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const cascadeStyles = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive/20 text-destructive border-destructive/40",
};

const DelayMonitor = () => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Delay Cascade Monitor</h3>
          <p className="text-sm text-muted-foreground">Real-time delay propagation tracking</p>
        </div>
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
          {delayEvents.length} Active
        </Badge>
      </div>

      <ScrollArea className="h-[340px]">
        <div className="space-y-3">
          {delayEvents
            .sort((a, b) => {
              const order = { critical: 0, high: 1, medium: 2, low: 3 };
              return order[a.cascadeRisk] - order[b.cascadeRisk];
            })
            .map((event, i) => (
              <div
                key={event.id}
                className={cn(
                  "p-4 rounded-lg border bg-secondary/30 transition-all hover:bg-secondary/50",
                  "animate-fade-in-up"
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-4 w-4", event.cascadeRisk === "critical" || event.cascadeRisk === "high" ? "text-destructive" : "text-warning")} />
                    <span className="font-medium text-sm">{event.trainName}</span>
                    <span className="text-xs text-muted-foreground">#{event.trainNumber}</span>
                  </div>
                  <Badge className={cn("text-[10px] uppercase", cascadeStyles[event.cascadeRisk])}>
                    {event.cascadeRisk}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{event.reason}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {event.delayMinutes} min delay
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" /> {event.affectedTrains} trains affected
                  </span>
                  <span>{event.station}</span>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DelayMonitor;
