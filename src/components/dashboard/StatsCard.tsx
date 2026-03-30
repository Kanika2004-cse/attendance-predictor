import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "danger";
}

const variantStyles = {
  primary: "text-primary border-primary/20 glow-primary",
  success: "text-success border-success/20 glow-success",
  warning: "text-warning border-warning/20",
  danger: "text-danger border-danger/20",
};

const iconBgStyles = {
  primary: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-danger/10",
};

export function StatsCard({ title, value, subtitle, icon: Icon, variant = "primary" }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-5 border ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className={`stat-value ${variant === "primary" ? "gradient-text" : `text-${variant}`}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgStyles[variant]}`}>
          <Icon className={`h-5 w-5 text-${variant}`} />
        </div>
      </div>
    </motion.div>
  );
}
