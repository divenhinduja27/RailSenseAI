import { useState } from "react";
import { railApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TrendingUp, Calendar, Search, Loader2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TicketInsights = () => {
  const [trainNo, setTrainNo] = useState("");
  const [wl, setWl] = useState("");
  const [station, setStation] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkOdds = async () => {
    if (!trainNo || !wl) return;
    setLoading(true);
    try {
      // 🚀 Calling Objective 5: Smart Booking Guidance
      const data = await railApi.getTicketOdds(trainNo, Number(wl), station || "NDLS");
      setPrediction(data);
    } catch (error) {
      console.error("Ticket Engine Disconnected", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚀 Dynamic Prediction Form */}
      <div className="glass-card p-5 border-primary/20 bg-primary/5">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Check Real-Time Confirmation Odds
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input 
            placeholder="Train No (e.g. 12622)" 
            value={trainNo} 
            onChange={(e) => setTrainNo(e.target.value)} 
            className="bg-background/50"
          />
          <Input 
            placeholder="WL Position (e.g. 45)" 
            type="number" 
            value={wl} 
            onChange={(e) => setWl(e.target.value)} 
            className="bg-background/50"
          />
          <Input 
            placeholder="Station Code (e.g. NDLS)" 
            value={station} 
            onChange={(e) => setStation(e.target.value)} 
            className="bg-background/50"
          />
          <Button onClick={checkOdds} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Predict Odds"}
          </Button>
        </div>

        {/* 📊 Prediction Result Card */}
        {prediction && (
          <div className="mt-6 p-4 rounded-lg bg-secondary/40 border border-primary/10 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Clearance Probability</span>
              <span className={cn(
                "text-2xl font-bold",
                prediction.probability >= 70 ? "text-emerald-500" : 
                prediction.probability >= 40 ? "text-amber-500" : "text-rose-500"
              )}>
                {prediction.probability}%
              </span>
            </div>
            <Progress value={prediction.probability} className="h-2.5 mb-4" />
            
            <div className="flex items-start gap-3 p-3 rounded-md bg-background/40">
              <TrendingUp className="h-4 w-4 text-primary mt-1" />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Recommendation:</span> {prediction.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 📈 Real-Time Metrics Group - UPDATED TO BE DYNAMIC */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="p-4 rounded-lg glass-card border-border hover:border-primary/30 transition-colors">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">Avg. Confirmation Rate</div>
          <div className="text-2xl font-bold text-emerald-500">
            {prediction?.avgRate ? `${prediction.avgRate}%` : "62%"}
          </div>
        </div>
        <div className="p-4 rounded-lg glass-card border-border hover:border-primary/30 transition-colors">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">Best Booking Window</div>
          <div className="text-2xl font-bold text-sky-500">
            {prediction?.window || "7-10d"}
          </div>
        </div>
        <div className="p-4 rounded-lg glass-card border-border hover:border-primary/30 transition-colors">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">Network Load</div>
          <div className={cn(
            "text-2xl font-bold",
            prediction?.load === 'Critical' ? "text-rose-500" : "text-amber-500"
          )}>
            {prediction?.load || "High"}
          </div>
        </div>
      </div>

      {/* 🧠 Objective 5: Intelligence Insights */}
      <div className="glass-card p-5 border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Intelligence Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <p>
              System leverages <span className="text-foreground font-medium">Graph Centrality</span> via Neo4j to assess if bottleneck congestion at <strong>{station || "Source"}</strong> is impacting WL clearance.
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <p>
              Historical analysis for <strong>#{trainNo || "Train"}</strong> indicates a <span className="text-foreground font-medium">{prediction?.trend || "Stable"}</span> confirmation pattern relative to current network load.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInsights;