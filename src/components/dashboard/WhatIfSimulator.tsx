import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Subject, getOverallAttendance, simulateAttendance, REQUIRED_PERCENTAGE, getStatusColor } from "@/lib/attendance-utils";
import { FlaskConical } from "lucide-react";

interface WhatIfSimulatorProps {
  subjects: Subject[];
}

export function WhatIfSimulator({ subjects }: WhatIfSimulatorProps) {
  const [futureAttend, setFutureAttend] = useState(5);
  const [futureSkip, setFutureSkip] = useState(2);

  const overall = getOverallAttendance(subjects);
  const sim = simulateAttendance(overall.attended, overall.total, futureAttend, futureSkip);
  const simStatus = getStatusColor(sim.newPercentage);

  const statusColors: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-5 border border-border/50"
    >
      <div className="flex items-center gap-2 mb-5">
        <FlaskConical className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          What-If Simulator
        </h3>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Classes to attend</span>
            <span className="font-mono text-success font-semibold">{futureAttend}</span>
          </div>
          <Slider
            value={[futureAttend]}
            onValueChange={([v]) => setFutureAttend(v)}
            min={0}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Classes to skip</span>
            <span className="font-mono text-danger font-semibold">{futureSkip}</span>
          </div>
          <Slider
            value={[futureSkip]}
            onValueChange={([v]) => setFutureSkip(v)}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Projected Attendance</p>
              <p className={`text-2xl font-bold font-mono ${statusColors[simStatus]}`}>
                {sim.newPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Change</p>
              <p className={`text-lg font-bold font-mono ${sim.newPercentage >= overall.percentage ? "text-success" : "text-danger"}`}>
                {sim.newPercentage >= overall.percentage ? "+" : ""}{(sim.newPercentage - overall.percentage).toFixed(1)}%
              </p>
            </div>
          </div>
          {sim.newPercentage < REQUIRED_PERCENTAGE && (
            <p className="text-xs text-danger mt-2 flex items-center gap-1">
              ⚠️ Below {REQUIRED_PERCENTAGE}% minimum threshold
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
