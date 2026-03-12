import { stations } from "@/data/mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CongestionChart = () => {
  const data = stations
    .sort((a, b) => b.congestionLevel - a.congestionLevel)
    .map((s) => ({
      name: s.code,
      congestion: s.congestionLevel,
      station: s.name,
    }));

  const getColor = (value: number) => {
    if (value >= 80) return "hsl(var(--destructive))";
    if (value >= 60) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Station Congestion Analysis</h3>
        <p className="text-sm text-muted-foreground">Current capacity utilization across major stations</p>
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
              formatter={(value: number, _name: string, props: any) => [`${value}%`, props.payload.station]}
            />
            <Bar dataKey="congestion" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.congestion)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CongestionChart;
