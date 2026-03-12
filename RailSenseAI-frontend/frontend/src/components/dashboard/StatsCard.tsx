import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "default" | "primary" | "warning" | "destructive" | "success";
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/30 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.15)]",
  warning: "border-warning/30",
  destructive: "border-destructive/30",
  success: "border-success/30",
};

const iconVariants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  return (
    <div className={cn("glass-card p-5 transition-all hover:border-primary/40", variantStyles[variant])}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2.5 rounded-lg", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="stat-value mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground/60 mt-1">{subtitle}</div>}
    </div>
  );
};

export default StatsCard;
