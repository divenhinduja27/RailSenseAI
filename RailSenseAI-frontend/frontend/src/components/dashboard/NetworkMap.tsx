import { useEffect, useState } from "react";
import { railApi } from "@/lib/api";

// Local coordinate dictionary to tell the SVG where to draw the Spring Boot nodes
const baseCoords: Record<string, { lat: number; lng: number }> = {
  "NDLS": { lat: 28.6139, lng: 77.2090 },
  "CSTM": { lat: 18.9398, lng: 72.8354 },
  "HWH": { lat: 22.5839, lng: 88.3428 },
  "MAS": { lat: 13.0827, lng: 80.2707 },
  "SBC": { lat: 12.9716, lng: 77.5946 },
  "SC": { lat: 17.4344, lng: 78.5013 },
  "LKO": { lat: 26.8467, lng: 80.9462 },
  "JP": { lat: 26.9124, lng: 75.7873 },
  "ADI": { lat: 23.0225, lng: 72.5714 },
  "PUNE": { lat: 18.5293, lng: 73.8568 },
  "PNBE": { lat: 25.6, lng: 85.1 },
  "BPL": { lat: 23.26, lng: 77.41 }
};

const NetworkMap = () => {
  const [liveNodes, setLiveNodes] = useState<any[]>([]);
  const [liveEdges, setLiveEdges] = useState<any[]>([]);

  // Fetch the live topology from Spring Boot
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const topology = await railApi.getTopology();
        setLiveNodes(topology.nodes || []);
        setLiveEdges(topology.edges || []);
      } catch (error) {
        console.error("Graph Engine Disconnected!", error);
      }
    };

    fetchGraph();
    // Auto-refresh the map every 5 seconds for live simulation updates!
    const interval = setInterval(fetchGraph, 5000);
    return () => clearInterval(interval);
  }, []);

  // Normalize lat/lng to SVG coordinates
  const minLat = 12, maxLat = 29, minLng = 72, maxLng = 89;
  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 500 + 50;
  const toY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * 400 + 50;

  // Translate Spring Boot Status to UI Colors
  const getStatusColor = (status: string) => {
    if (status === "CRITICAL") return "hsl(var(--destructive))"; // Red
    if (status === "CONGESTED") return "hsl(var(--warning))";     // Yellow
    return "hsl(var(--success))";                                 // Green
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Live Graph Topology</h3>
          <p className="text-sm text-muted-foreground">Powered by Neo4j & Spring Boot</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> CLEAR</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> CONGESTED</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-destructive" /> CRITICAL</span>
        </div>
      </div>

      <div className="bg-secondary/40 rounded-lg p-2 overflow-hidden">
        <svg viewBox="0 0 600 500" className="w-full h-auto" style={{ minHeight: 320 }}>
          {/* Edges from Backend */}
          {liveEdges.map((edge, i) => {
            const fromCoords = baseCoords[edge.source];
            const toCoords = baseCoords[edge.target];
            if (!fromCoords || !toCoords) return null;
            return (
              <line
                key={i}
                x1={toX(fromCoords.lng)} y1={toX(fromCoords.lat)}
                x2={toX(toCoords.lng)} y2={toY(toCoords.lat)}
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
            );
          })}

          {/* Nodes from Backend */}
          {liveNodes.map((node) => {
            const coords = baseCoords[node.stationCode];
            if (!coords) return null; // Skip if no coords mapped

            const x = toX(coords.lng);
            const y = toY(coords.lat);
            const color = getStatusColor(node.status);
            const r = node.status === "CRITICAL" ? 10 : node.status === "CONGESTED" ? 8 : 6;

            return (
              <g key={node.stationCode} className="cursor-pointer group">
                <circle cx={x} cy={y} r={r + 4} fill={color} opacity={node.status === "CRITICAL" ? "0.4" : "0.15"} className={node.status === "CRITICAL" ? "animate-pulse" : ""} />
                <circle cx={x} cy={y} r={r} fill={color} opacity="0.9" stroke={color} strokeWidth="1" />
                <text x={x} y={y - r - 6} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">
                  {node.stationCode}
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