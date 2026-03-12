import CongestionChart from "@/components/dashboard/CongestionChart";

const CongestionPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold mb-1">Congestion Analysis</h1>
      <p className="text-muted-foreground text-sm">Station capacity utilization & crowd intelligence</p>
    </div>
    <CongestionChart />
  </div>
);

export default CongestionPage;
