import ResiliencePanel from "@/components/dashboard/ResiliencePanel";

const ResiliencePage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold mb-1">Network Resilience</h1>
      <p className="text-muted-foreground text-sm">Infrastructure vulnerability & resilience analysis</p>
    </div>
    <ResiliencePanel />
  </div>
);

export default ResiliencePage;
