import { useEffect, useState } from "react";
import { railApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

const CongestionChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        // Objective 3: Fetching real capacity data from Spring Boot
        const hotspots = await railApi.getHotspots();
        
        // Transform backend Map to Recharts format
        const formattedData = hotspots.map((h: any) => ({
          name: h.stationCode,
          congestion: h.utilizationLevel || h.congestionLevel || 0,
          station: h.stationName,
          crowdRisk: h.crowdRisk || "LOW"
        })).sort((a: any, b: any) => b.congestion - a.congestion);

        setData(formattedData);
      } catch (error) {
        console.error("Congestion Engine Disconnected", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
    const interval = setInterval(fetchHotspots, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value >= 80) return "hsl(var(--destructive))";
    if (value >= 60) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  if (loading) return (
    <div className="glass-card p-20 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm text-muted-foreground">Analyzing Passenger Flow...</p>
    </div>
  );

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Capacity Utilization (Obj 3 & 4)</h3>
          <p className="text-sm text-muted-foreground">Live crowd intelligence from Neo4j analytics</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
                fontSize: 12,
              }}
              cursor={{ fill: 'transparent' }}
              formatter={(value: number, _name: string, props: any) => [
                `${value}% Capacity`, 
                `${props.payload.station} (${props.payload.crowdRisk} RISK)`
              ]}
            />
            <Bar dataKey="congestion" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.congestion)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Peak Utilization</p>
          <p className="text-sm font-semibold">{data[0]?.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">System Load</p>
          <p className="text-sm font-semibold text-success">Optimal</p>
        </div>
      </div>
    </div>
  );
};

export default CongestionChart;