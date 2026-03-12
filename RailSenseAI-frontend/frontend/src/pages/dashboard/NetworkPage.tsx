import NetworkMap from "@/components/dashboard/NetworkMap";
import { stations } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NetworkPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Network Map</h1>
        <p className="text-muted-foreground text-sm">Railway network topology & station connectivity</p>
      </div>

      <NetworkMap />

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4">All Stations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stations.map((s) => (
            <div key={s.id} className="p-3 rounded-lg bg-secondary/30 border border-border flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{s.name}</span>
                <div className="text-xs text-muted-foreground">{s.code} • Zone: {s.zone} • {s.platforms} platforms</div>
              </div>
              <Badge className={cn(
                "text-[10px]",
                s.congestionLevel >= 80 ? "bg-destructive/10 text-destructive" :
                s.congestionLevel >= 60 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
              )}>
                {s.congestionLevel}%
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
