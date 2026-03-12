import * as React from "react";
import NetworkMap from "@/components/dashboard/NetworkMap";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { railApi } from "@/lib/api"; // Importing your real backend bridge

const NetworkPage = () => {
  const [stations, setStations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRealNetwork = async () => {
      try {
        // Fetching the real Neo4j nodes from your Spring Boot Backend
        const topology = await railApi.getTopology();
        setStations(topology.nodes || []);
      } catch (error) {
        console.error("Failed to connect to backend", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealNetwork();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Network Map</h1>
        <p className="text-muted-foreground text-sm">Railway network topology & station connectivity</p>
      </div>

      {/* The Map component still needs to be updated next! */}
      <NetworkMap />

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4">Live Network Stations</h3>
        
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Connecting to Spring Boot Engine...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stations.map((s, index) => (
              <div key={s.stationCode || index} className="p-3 rounded-lg bg-secondary/30 border border-border flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm font-bold">{s.stationCode}</span>
                  <div className="text-xs text-muted-foreground">Graph Node</div>
                </div>
                
                {/* Dynamically colors the badge based on your backend 'status' field */}
                <Badge className={cn(
                  "text-[10px]",
                  s.status === "CRITICAL" ? "bg-destructive/10 text-destructive" :
                  s.status === "CONGESTED" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                )}>
                  {s.status || "CLEAR"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkPage;