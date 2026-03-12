import { stations } from "@/data/mock-data";
import { Shield, AlertTriangle, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// Mock resilience scores
const resilienceData = stations.map((s) => ({
  ...s,
  centralityScore: Math.random() * 100,
  vulnerabilityScore: Math.round(s.congestionLevel * 0.8 + Math.random() * 20),
  redundancy: Math.round(40 + Math.random() * 50),
})).sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);

const ResiliencePanel = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Network Resilience Analysis</h3>
            <p className="text-sm text-muted-foreground">Infrastructure vulnerability & redundancy assessment</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Network Health</div>
            <div className="stat-value text-success">91%</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Critical Nodes</div>
            <div className="stat-value text-destructive">4</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Avg Redundancy</div>
            <div className="stat-value text-primary">67%</div>
          </div>
        </div>

        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Station Vulnerability Ranking
        </h4>

        <div className="space-y-3">
          {resilienceData.slice(0, 8).map((station, i) => (
            <div key={station.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20">
              <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{station.name}</span>
                  <span className="text-xs text-muted-foreground">{station.code}</span>
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground mb-0.5">Vulnerability</div>
                    <Progress value={station.vulnerabilityScore} className="h-1.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground mb-0.5">Redundancy</div>
                    <Progress value={station.redundancy} className="h-1.5" />
                  </div>
                </div>
              </div>
              <span className={cn(
                "text-sm font-bold font-mono",
                station.vulnerabilityScore >= 70 ? "text-destructive" :
                station.vulnerabilityScore >= 50 ? "text-warning" : "text-success"
              )}>
                {station.vulnerabilityScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Network className="h-4 w-4 text-primary" />
          Resilience Insights
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-destructive mt-1">•</span>Mumbai CST and New Delhi are single points of failure for 40% of long-distance routes</li>
          <li className="flex items-start gap-2"><span className="text-warning mt-1">•</span>Howrah–Vijayawada corridor has limited alternative routing options</li>
          <li className="flex items-start gap-2"><span className="text-success mt-1">•</span>Northern plains network has good redundancy through parallel routes</li>
        </ul>
      </div>
    </div>
  );
};

export default ResiliencePanel;
