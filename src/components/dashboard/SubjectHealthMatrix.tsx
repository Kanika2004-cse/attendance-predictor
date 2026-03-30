import { motion } from "framer-motion";
import { Subject, getAttendancePercentage, leavesAllowed, classesNeededToReach, REQUIRED_PERCENTAGE } from "@/lib/attendance-utils";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface SubjectHealthMatrixProps {
  subjects: Subject[];
}

export function SubjectHealthMatrix({ subjects }: SubjectHealthMatrixProps) {
  const subjectData = subjects.map((s) => {
    const pct = getAttendancePercentage(s.attended, s.total);
    const leaves = leavesAllowed(s.attended, s.total);
    const needed = classesNeededToReach(s.attended, s.total);
    return { ...s, pct, leaves, needed };
  });

  const safe = subjectData.filter((s) => s.pct >= 85);
  const borderline = subjectData.filter((s) => s.pct >= 75 && s.pct < 85);
  const critical = subjectData.filter((s) => s.pct < 75);

  const groups = [
    { label: "Safe", icon: ShieldCheck, items: safe, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "Borderline", icon: ShieldAlert, items: borderline, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { label: "Critical", icon: ShieldX, items: critical, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card p-5 border border-border/50"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Subject Health Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {groups.map((group) => (
          <div key={group.label} className={`rounded-lg border ${group.border} ${group.bg} p-3`}>
            <div className="flex items-center gap-1.5 mb-3">
              <group.icon className={`h-4 w-4 ${group.color}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${group.color}`}>
                {group.label} ({group.items.length})
              </span>
            </div>
            {group.items.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">None</p>
            ) : (
              <div className="space-y-2">
                {group.items.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-xs font-medium text-foreground truncate">{s.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-semibold text-foreground">{s.pct.toFixed(0)}%</span>
                      {s.leaves > 0 ? (
                        <p className="text-[10px] text-muted-foreground">{s.leaves} skip{s.leaves !== 1 ? "s" : ""} left</p>
                      ) : s.needed > 0 ? (
                        <p className="text-[10px] text-danger">need {s.needed} more</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
