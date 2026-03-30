import { motion } from "framer-motion";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Subject, getOverallAttendance, getAttendancePercentage, REQUIRED_PERCENTAGE, getStatusColor } from "@/lib/attendance-utils";
import { CalendarMinus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

interface LeaveImpactChartProps {
  subjects: Subject[];
}

export function LeaveImpactChart({ subjects }: LeaveImpactChartProps) {
  const [leaveDays, setLeaveDays] = useState(5);
  const overall = getOverallAttendance(subjects);

  // Each "day of leave" = 1 class missed per subject? No — treat as 1 total class missed per day.
  const data = Array.from({ length: 31 }, (_, i) => {
    const newTotal = overall.total + i;
    const pct = getAttendancePercentage(overall.attended, newTotal);
    return { day: i, percentage: parseFloat(pct.toFixed(1)) };
  });

  const selected = data[leaveDays];
  const current = data[0];
  const selectedStatus = getStatusColor(selected.percentage);
  const drop = current.percentage - selected.percentage;

  const statusColors: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card p-5 border border-border/50"
    >
      <div className="flex items-center gap-2 mb-5">
        <CalendarMinus className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Leave Impact Analysis
        </h3>
      </div>

      <div className="space-y-5">
        {/* Slider */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Days of leave</span>
            <span className="font-mono text-danger font-semibold">{leaveDays} day{leaveDays !== 1 ? "s" : ""}</span>
          </div>
          <Slider
            value={[leaveDays]}
            onValueChange={([v]) => setLeaveDays(v)}
            min={0}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Chart */}
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Days", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 5", "dataMax + 2"]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`, "Attendance"]}
                labelFormatter={(label: number) => `${label} day${label !== 1 ? "s" : ""} leave`}
              />
              <ReferenceLine
                y={REQUIRED_PERCENTAGE}
                stroke="hsl(var(--destructive))"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{ value: "75%", position: "insideTopLeft", fontSize: 10, fill: "hsl(var(--destructive))" }}
              />
              <ReferenceLine
                x={leaveDays}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="hsl(var(--primary))"
                fill="url(#leaveGrad)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="border-t border-border/50 pt-4 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-lg font-bold font-mono text-foreground">{current.percentage}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">After {leaveDays} day{leaveDays !== 1 ? "s" : ""}</p>
            <p className={`text-lg font-bold font-mono ${statusColors[selectedStatus]}`}>{selected.percentage}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Drop</p>
            <p className="text-lg font-bold font-mono text-danger">-{drop.toFixed(1)}%</p>
          </div>
        </div>

        {selected.percentage < REQUIRED_PERCENTAGE && (
          <p className="text-xs text-danger flex items-center gap-1">
            ⚠️ After {leaveDays} day{leaveDays !== 1 ? "s" : ""}, you'll fall below {REQUIRED_PERCENTAGE}%
          </p>
        )}
      </div>
    </motion.div>
  );
}
