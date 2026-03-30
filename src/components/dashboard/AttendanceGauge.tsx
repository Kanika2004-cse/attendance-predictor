import { motion } from "framer-motion";
import { getStatusColor } from "@/lib/attendance-utils";

interface AttendanceGaugeProps {
  percentage: number;
  size?: number;
}

export function AttendanceGauge({ percentage, size = 200 }: AttendanceGaugeProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;
  const status = getStatusColor(percentage);

  const colorMap = {
    success: "hsl(142, 71%, 45%)",
    warning: "hsl(38, 92%, 50%)",
    danger: "hsl(0, 84%, 60%)",
  };

  const glowMap = {
    success: "drop-shadow(0 0 8px hsl(142 71% 45% / 0.4))",
    warning: "drop-shadow(0 0 8px hsl(38 92% 50% / 0.4))",
    danger: "drop-shadow(0 0 8px hsl(0 84% 60% / 0.4))",
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ filter: glowMap[status] }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(222, 30%, 18%)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[status]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="stat-value text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage.toFixed(1)}%
        </motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Overall</span>
      </div>
    </div>
  );
}
