import { motion } from "framer-motion";
import { Subject, getAttendancePercentage, classesNeededToReach, leavesAllowed, getStatusColor, getStatusLabel } from "@/lib/attendance-utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SubjectTableProps {
  subjects: Subject[];
}

const statusBadgeStyles: Record<string, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
};

export function SubjectTable({ subjects }: SubjectTableProps) {
  return (
    <div className="glass-card border border-border/50 overflow-hidden">
      <div className="p-5 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Detailed Subject Analysis
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
              <th className="text-center py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Attended</th>
              <th className="text-center py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
              <th className="text-center py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">%</th>
              <th className="text-center py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-center py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Leaves Left</th>
              <th className="text-center py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Classes Needed</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => {
              const pct = getAttendancePercentage(subject.attended, subject.total);
              const status = getStatusColor(pct);
              const leaves = leavesAllowed(subject.attended, subject.total);
              const needed = classesNeededToReach(subject.attended, subject.total);

              return (
                <motion.tr
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
                      <span className="font-medium text-foreground">{subject.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-3 font-mono text-muted-foreground">{subject.attended}</td>
                  <td className="text-center py-3 px-3 font-mono text-muted-foreground">{subject.total}</td>
                  <td className="text-center py-3 px-3 font-mono font-semibold text-foreground">{pct.toFixed(1)}%</td>
                  <td className="text-center py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadgeStyles[status]}`}>
                      {status === "success" && <TrendingUp className="h-3 w-3" />}
                      {status === "warning" && <Minus className="h-3 w-3" />}
                      {status === "danger" && <TrendingDown className="h-3 w-3" />}
                      {getStatusLabel(pct)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3 font-mono text-success font-semibold">
                    {leaves > 0 ? leaves : "—"}
                  </td>
                  <td className="text-center py-3 px-3 font-mono text-danger font-semibold">
                    {needed > 0 ? needed : "—"}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
