import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Subject, getAttendancePercentage, classesNeededToReach, REQUIRED_PERCENTAGE } from "@/lib/attendance-utils";

interface LowAttendanceAlertProps {
  subjects: Subject[];
}

export function LowAttendanceAlert({ subjects }: LowAttendanceAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  const criticalSubjects = subjects.filter(
    (s) => getAttendancePercentage(s.attended, s.total) < REQUIRED_PERCENTAGE
  );

  if (criticalSubjects.length === 0 || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="glass-card border border-danger/30 p-4 mb-6"
        style={{ boxShadow: "0 0 30px hsl(0 84% 60% / 0.1)" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-danger/10 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-danger animate-pulse-glow" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-danger">Attendance Alert</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {criticalSubjects.length} subject{criticalSubjects.length > 1 ? "s" : ""} below {REQUIRED_PERCENTAGE}% attendance:
              </p>
              <ul className="mt-2 space-y-1">
                {criticalSubjects.map((s) => {
                  const needed = classesNeededToReach(s.attended, s.total);
                  return (
                    <li key={s.id} className="text-xs text-foreground">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground">
                        {" "}— {getAttendancePercentage(s.attended, s.total).toFixed(1)}%
                        {needed > 0 && ` (attend ${needed} more classes)`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
