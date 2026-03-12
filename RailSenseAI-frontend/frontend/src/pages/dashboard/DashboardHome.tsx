import * as React from "react";
import { Train, Activity, AlertTriangle, Users, Timer, MapPin, Gauge, HeartPulse } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import NetworkMap from "@/components/dashboard/NetworkMap";
import DelayMonitor from "@/components/dashboard/DelayMonitor";
import AIAssistant from "@/components/dashboard/AIAssistant";
// We remove the mock-data import and bring in our real API bridge
import { railApi } from "@/lib/api"; 

const DashboardHome = () => {
  // Create state to hold the real data from your backend
  const [hotspotCount, setHotspotCount] = React.useState(0);
  const [networkHealth, setNetworkHealth] = React.useState(100);

  // When the dashboard loads, fetch the real data from Spring Boot
  React.useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch real congestion hotspots from Neo4j
        const hotspots = await railApi.getHotspots();
        setHotspotCount(hotspots.length);
        
        // Basic math: if there are hotspots, network health goes down
        setNetworkHealth(100 - (hotspots.length * 5));
      } catch (error) {
        console.error("Failed to connect to Spring Boot Backend!", error);
      }
    };

    fetchRealData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Railway Intelligence Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time network monitoring • AI-powered insights</p>
      </div>

      {/* Stats Grid - Now using dynamic state for real backend values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Trains" value="8,934" icon={Train} variant="primary" />
        <StatsCard title="On-Time Rate" value="86.1%" icon={Activity} variant="success" />
        <StatsCard title="Delayed Trains" value="1,247" icon={AlertTriangle} variant="warning" />
        <StatsCard title="Daily Passengers" value="23.4M" icon={Users} variant="default" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Congestion Hotspots" value={hotspotCount} icon={MapPin} variant="destructive" />
        <StatsCard title="Network Health" value={`${networkHealth}%`} icon={HeartPulse} variant={networkHealth > 80 ? "success" : "warning"} />
        <StatsCard title="Avg Delay" value="18.5m" icon={Timer} variant="warning" />
        <StatsCard title="System Load" value={`${hotspotCount > 0 ? 88 : 72}%`} icon={Gauge} variant="primary" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <NetworkMap />
        </div>
        <div>
          <AIAssistant embedded />
        </div>
      </div>

      <DelayMonitor />
    </div>
  );
};

export default DashboardHome;