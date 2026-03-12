import { trainRoutes } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const statusStyles = {
  "on-time": "bg-success/10 text-success border-success/20",
  delayed: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const TrainRoutesTable = () => {
  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Train Routes & Schedules</h3>
        <p className="text-sm text-muted-foreground">Live train status with confirmation probabilities</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Train</TableHead>
              <TableHead className="text-muted-foreground">Route</TableHead>
              <TableHead className="text-muted-foreground">Time</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Occupancy</TableHead>
              <TableHead className="text-muted-foreground">Confirmation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainRoutes.map((train) => (
              <TableRow key={train.id} className="border-border hover:bg-secondary/30">
                <TableCell>
                  <div>
                    <span className="font-medium text-sm">{train.trainName}</span>
                    <div className="text-xs text-muted-foreground">#{train.trainNumber}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {train.from} → {train.to}
                </TableCell>
                <TableCell className="text-sm font-mono">
                  {train.departureTime}
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-[10px] uppercase", statusStyles[train.status])}>
                    {train.status}
                    {train.delayMinutes > 0 && ` +${train.delayMinutes}m`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={train.occupancy} className="h-1.5 flex-1" />
                    <span className="text-xs font-mono text-muted-foreground w-8">{train.occupancy}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-sm font-semibold font-mono",
                    train.confirmationProbability >= 70 ? "text-success" :
                    train.confirmationProbability >= 40 ? "text-warning" : "text-destructive"
                  )}>
                    {train.confirmationProbability}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrainRoutesTable;
