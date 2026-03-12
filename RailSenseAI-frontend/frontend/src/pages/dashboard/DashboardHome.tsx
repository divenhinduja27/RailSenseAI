import { Train, Activity, AlertTriangle, Users, Timer, MapPin, Gauge, HeartPulse } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import NetworkMap from "@/components/dashboard/NetworkMap";
import DelayMonitor from "@/components/dashboard/DelayMonitor";
import AIAssistant from "@/components/dashboard/AIAssistant";
import { statsData } from "@/data/mock-data";

const DashboardHome = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Railway Intelligence Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time network monitoring • AI-powered insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Trains" value={statsData.activeTrains.toLocaleString()} icon={Train} variant="primary" trend={{ value: 2.4, positive: true }} subtitle={`of ${statsData.totalTrains.toLocaleString()} total`} />
        <StatsCard title="On-Time Rate" value={`${statsData.onTimePercentage}%`} icon={Activity} variant="success" trend={{ value: 1.2, positive: true }} />
        <StatsCard title="Delayed Trains" value={statsData.delayedTrains.toLocaleString()} icon={AlertTriangle} variant="warning" trend={{ value: 3.8, positive: false }} subtitle={`Avg ${statsData.avgDelay} min`} />
        <StatsCard title="Daily Passengers" value={statsData.totalPassengers} icon={Users} variant="default" trend={{ value: 5.1, positive: true }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Congestion Hotspots" value={statsData.congestionHotspots} icon={MapPin} variant="destructive" />
        <StatsCard title="Network Health" value={`${statsData.networkHealth}%`} icon={HeartPulse} variant="success" />
        <StatsCard title="Avg Delay" value={`${statsData.avgDelay}m`} icon={Timer} variant="warning" />
        <StatsCard title="System Load" value="72%" icon={Gauge} variant="primary" />
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
