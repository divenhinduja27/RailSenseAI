import { useEffect, useState } from "react";
import { railApi } from "@/lib/api";
import { Shield, AlertTriangle, Network, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const ResiliencePanel = () => {
  const [resilienceData, setResilienceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResilience = async () => {
      try {
        // We pass default stations for the initial report
        const data = await railApi.getResilience("NDLS", "MAS");
        setResilienceData(data);
      } catch (e) {
        console.error("Resilience Engine Failure", e);
      } finally {
        setLoading(false);
      }
    };
    fetchResilience();
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading Neo4j Centrality Analysis...</div>;

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Infrastructure Vulnerability (Objective 6)</h3>
            <p className="text-sm text-muted-foreground">Live Betweenness & Centrality ranking from Neo4j</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Graph Nodes</div>
            <div className="stat-value text-success">{resilienceData.totalNodes || 0}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Vulnerability Index</div>
            <div className="stat-value text-destructive">{resilienceData.vulnerabilityScore || "High"}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Route Redundancy</div>
            <div className="stat-value text-primary">{resilienceData.redundancyCount || 0}</div>
          </div>
        </div>

        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Critical Corridor Analysis
        </h4>

        <div className="space-y-3">
          {/* Displaying the "Crucial Hubs" identified by your Java Centrality logic */}
          {(resilienceData.criticalNodes || []).map((node: any, i: number) => (
            <div key={node.code} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20">
              <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{node.name}</span>
                  <span className="text-xs text-muted-foreground">{node.code}</span>
                </div>
                <div className="mt-2">
                  <div className="text-[10px] text-muted-foreground mb-1">Influence Score (Betweenness)</div>
                  <Progress value={node.centralityScore} className="h-1.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Network className="h-4 w-4 text-primary" />
          AI Intelligence Insights
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {resilienceData.aiSummary || "Select corridors to generate a real-time infrastructure resilience report based on current graph status."}
        </p>
      </div>
    </div>
  );
};

export default ResiliencePanel;