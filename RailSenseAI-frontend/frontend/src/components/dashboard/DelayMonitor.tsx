import { useEffect, useState } from "react";
import { railApi } from "@/lib/api";
import { AlertTriangle, Clock, Zap, Loader2 } from "lucide-react";
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
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Calling Objective 2's historical simulation data
        const history = await railApi.getSimulationHistory(); 
        setLogs(history || []);
      } catch (e) {
        console.error("Backend Disconnected", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 8000); // Polling every 8s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">System Disruptions</h3>
          <p className="text-sm text-muted-foreground">Live cascade tracking from Spring Boot logs</p>
        </div>
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            {logs.length} Logged Events
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[340px]">
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={log.id} className="p-4 rounded-lg border bg-secondary/30 transition-all hover:bg-secondary/50 animate-fade-in-up">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-sm">Station: {log.stationCode}</span>
                </div>
                <Badge className={cn("text-[10px] uppercase", cascadeStyles[log.status?.toLowerCase() || 'medium'])}>
                  {log.status || 'ACTIVE'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{log.logMessage || "Operational delay detected via Graph Analysis."}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Objective 2 Active</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DelayMonitor;