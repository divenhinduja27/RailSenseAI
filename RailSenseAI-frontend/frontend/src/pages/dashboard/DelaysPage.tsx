import DelayMonitor from "@/components/dashboard/DelayMonitor";

const DelaysPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold mb-1">Delay Monitor</h1>
      <p className="text-muted-foreground text-sm">Track delay cascades & propagation across the network</p>
    </div>
    <DelayMonitor />
  </div>
);

export default DelaysPage;
