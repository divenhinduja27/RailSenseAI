import TicketInsights from "@/components/dashboard/TicketInsights";

const TicketsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold mb-1">Ticket Insights</h1>
      <p className="text-muted-foreground text-sm">Smart booking guidance & confirmation predictions</p>
    </div>
    <TicketInsights />
  </div>
);

export default TicketsPage;
