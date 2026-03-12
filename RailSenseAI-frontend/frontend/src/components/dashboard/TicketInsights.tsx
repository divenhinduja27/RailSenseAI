import { trainRoutes } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { Ticket, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TicketInsights = () => {
  const sortedByConfirmation = [...trainRoutes]
    .filter((t) => t.status !== "cancelled")
    .sort((a, b) => b.confirmationProbability - a.confirmationProbability);

  return (
    <div className="space-y-6">
      {/* Smart Booking Guidance */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Ticket className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Smart Booking Guidance</h3>
            <p className="text-sm text-muted-foreground">AI-powered ticket confirmation predictions</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Avg. Confirmation Rate</div>
            <div className="stat-value text-success">62%</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Best Booking Window</div>
            <div className="stat-value text-primary">7-10d</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Peak Demand Routes</div>
            <div className="stat-value text-warning">5</div>
          </div>
        </div>

        <div className="space-y-3">
          {sortedByConfirmation.map((train) => (
            <div key={train.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{train.trainName}</span>
                  <span className="text-xs text-muted-foreground">#{train.trainNumber}</span>
                </div>
                <div className="text-xs text-muted-foreground">{train.from} → {train.to}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-24">
                  <Progress value={train.confirmationProbability} className="h-1.5" />
                </div>
                <span className={cn(
                  "text-sm font-bold font-mono w-10 text-right",
                  train.confirmationProbability >= 70 ? "text-success" :
                  train.confirmationProbability >= 40 ? "text-warning" : "text-destructive"
                )}>
                  {train.confirmationProbability}%
                </span>
                {train.confirmationProbability >= 60 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Tips */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Booking Recommendations
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            Book Rajdhani/Shatabdi tickets 15-20 days in advance for best confirmation odds
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            Avoid Delhi-Mumbai corridor on Fridays — occupancy peaks at 98%
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            Consider Duronto Express as alternative to Rajdhani — 23% higher confirmation rate
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            Tatkal quota opens at 10:00 AM for AC and 11:00 AM for non-AC classes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TicketInsights;
