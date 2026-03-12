import { stations, networkConnections } from "@/data/mock-data";
import { cn } from "@/lib/utils";

// Simplified SVG map representation of Indian railway network
const NetworkMap = () => {
  // Normalize lat/lng to SVG coordinates
  const minLat = 12, maxLat = 29, minLng = 72, maxLng = 89;
  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 500 + 50;
  const toY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * 400 + 50;

  const getCongestionColor = (level: number) => {
    if (level >= 80) return "hsl(var(--destructive))";
    if (level >= 60) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Railway Network Topology</h3>
          <p className="text-sm text-muted-foreground">Live station congestion & connectivity</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" /> Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> High
          </span>
        </div>
      </div>

      <div className="bg-secondary/40 rounded-lg p-2 overflow-hidden">
        <svg viewBox="0 0 600 500" className="w-full h-auto" style={{ minHeight: 320 }}>
          {/* Connections */}
          {networkConnections.map((conn, i) => {
            const fromStation = stations.find((s) => s.code === conn.from);
            const toStation = stations.find((s) => s.code === conn.to);
            if (!fromStation || !toStation) return null;
            return (
              <line
                key={i}
                x1={toX(fromStation.lng)}
                y1={toY(fromStation.lat)}
                x2={toX(toStation.lng)}
                y2={toY(toStation.lat)}
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
            );
          })}

          {/* Station nodes */}
          {stations.map((station) => {
            const x = toX(station.lng);
            const y = toY(station.lat);
            const color = getCongestionColor(station.congestionLevel);
            const r = 4 + (station.congestionLevel / 100) * 6;

            return (
              <g key={station.id} className="cursor-pointer group">
                {/* Glow */}
                <circle cx={x} cy={y} r={r + 4} fill={color} opacity="0.15" />
                {/* Node */}
                <circle cx={x} cy={y} r={r} fill={color} opacity="0.9" stroke={color} strokeWidth="1" />
                {/* Label */}
                <text
                  x={x}
                  y={y - r - 6}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  fontWeight="500"
                  className="opacity-80"
                >
                  {station.code}
                </text>
                <text
                  x={x}
                  y={y - r - 17}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="8"
                >
                  {station.congestionLevel}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default NetworkMap;
