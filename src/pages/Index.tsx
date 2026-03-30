import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, GraduationCap, CalendarCheck, CalendarX, TrendingUp, Plus, Trash2, BookOpen } from "lucide-react";
import { DEFAULT_SUBJECTS, Subject, getOverallAttendance, leavesAllowed, classesNeededToReach } from "@/lib/attendance-utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceGauge } from "@/components/dashboard/AttendanceGauge";
import { AttendancePieChart } from "@/components/dashboard/AttendancePieChart";
import { AttendanceBarChart } from "@/components/dashboard/AttendanceBarChart";
import { SubjectHealthMatrix } from "@/components/dashboard/SubjectHealthMatrix";
import { SubjectTable } from "@/components/dashboard/SubjectTable";
import { WhatIfSimulator } from "@/components/dashboard/WhatIfSimulator";
import { LeaveImpactChart } from "@/components/dashboard/LeaveImpactChart";
import { LowAttendanceAlert } from "@/components/dashboard/LowAttendanceAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MAX_SUBJECTS = 12;

const CHART_COLORS = [
  "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)", "hsl(47, 96%, 53%)",
  "hsl(280, 65%, 60%)", "hsl(0, 84%, 60%)", "hsl(168, 76%, 42%)",
  "hsl(30, 90%, 55%)", "hsl(320, 70%, 55%)",
];

export default function Index() {
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [newName, setNewName] = useState("");
  const [newAttended, setNewAttended] = useState("");
  const [newTotal, setNewTotal] = useState("");

  const overall = getOverallAttendance(subjects);
  const totalLeaves = leavesAllowed(overall.attended, overall.total);
  const totalNeeded = classesNeededToReach(overall.attended, overall.total);

  const addSubject = () => {
    if (!newName || !newAttended || !newTotal) return;
    if (subjects.length >= MAX_SUBJECTS) return;
    const attended = parseInt(newAttended);
    const total = parseInt(newTotal);
    if (isNaN(attended) || isNaN(total) || total <= 0 || attended < 0 || attended > total) return;
    setSubjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newName,
        attended,
        total,
        color: CHART_COLORS[prev.length % CHART_COLORS.length],
      },
    ]);
    setNewName("");
    setNewAttended("");
    setNewTotal("");
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateAttendance = (id: string, field: "attended" | "total", delta: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newVal = s[field] + delta;
        if (field === "attended" && (newVal < 0 || newVal > s.total)) return s;
        if (field === "total" && (newVal < s.attended || newVal < 1)) return s;
        return { ...s, [field]: newVal };
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Smart Attendance Predictor</h1>
              <p className="text-xs text-muted-foreground">Intelligent attendance analytics & prediction</p>
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground">{subjects.length}/{MAX_SUBJECTS} subjects</span>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Alert */}
        <LowAttendanceAlert subjects={subjects} />

        {/* Manage Subjects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-border/50 overflow-hidden"
        >
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Manage Subjects</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{subjects.length}/{MAX_SUBJECTS}</span>
          </div>

          {/* Add Subject Form */}
          {subjects.length < MAX_SUBJECTS && (
            <div className="p-5 border-b border-border/30 bg-secondary/10">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Subject name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-secondary border-border text-foreground flex-1"
                />
                <Input
                  type="number"
                  placeholder="Attended"
                  value={newAttended}
                  onChange={(e) => setNewAttended(e.target.value)}
                  className="bg-secondary border-border text-foreground w-full sm:w-28"
                />
                <Input
                  type="number"
                  placeholder="Total"
                  value={newTotal}
                  onChange={(e) => setNewTotal(e.target.value)}
                  className="bg-secondary border-border text-foreground w-full sm:w-28"
                />
                <Button onClick={addSubject} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          )}
          {subjects.length >= MAX_SUBJECTS && (
            <div className="p-4 bg-warning/5 border-b border-border/30">
              <p className="text-xs text-warning text-center">Maximum of {MAX_SUBJECTS} subjects reached. Remove a subject to add a new one.</p>
            </div>
          )}

          {/* Subject List */}
          <div className="divide-y divide-border/30">
            {subjects.map((subject, i) => {
              const pct = ((subject.attended / subject.total) * 100).toFixed(1);
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }} />
                    <span className="text-sm font-medium text-foreground truncate">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">{subject.attended}/{subject.total}</span>
                    <span className="text-xs font-mono font-semibold text-foreground w-14 text-right">{pct}%</span>
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                      title="Remove subject"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {subjects.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No subjects added yet. Add your first subject above.
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Overall Attendance"
            value={`${overall.percentage.toFixed(1)}%`}
            subtitle={`${overall.attended} of ${overall.total} classes`}
            icon={BarChart3}
            variant={overall.percentage >= 75 ? "primary" : "danger"}
          />
          <StatsCard
            title="Leaves Available"
            value={totalLeaves}
            subtitle="Classes you can safely skip"
            icon={CalendarX}
            variant={totalLeaves > 3 ? "success" : totalLeaves > 0 ? "warning" : "danger"}
          />
          <StatsCard
            title="Classes Needed"
            value={totalNeeded > 0 ? totalNeeded : "0"}
            subtitle={totalNeeded > 0 ? "To reach 75% minimum" : "You're above 75%!"}
            icon={CalendarCheck}
            variant={totalNeeded === 0 ? "success" : "danger"}
          />
          <StatsCard
            title="Subjects Tracked"
            value={subjects.length}
            subtitle={`${subjects.filter((s) => (s.attended / s.total) * 100 < 75).length} critical`}
            icon={TrendingUp}
            variant="primary"
          />
        </div>

        {/* Gauge + Simulator Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-6 border border-border/50 flex flex-col items-center justify-center">
            <AttendanceGauge percentage={overall.percentage} size={220} />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {overall.percentage >= 75
                ? `✅ ${totalLeaves} leave${totalLeaves !== 1 ? "s" : ""} remaining`
                : `⚠️ Attend ${totalNeeded} more classes to reach 75%`}
            </p>
          </div>
          <div className="lg:col-span-2">
            <WhatIfSimulator subjects={subjects} />
          </div>
        </div>

        {/* Leave Impact */}
        <LeaveImpactChart subjects={subjects} />

        {/* Charts + Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AttendanceBarChart subjects={subjects} />
          <SubjectHealthMatrix subjects={subjects} />
        </div>

        {/* Subject Table */}
        <SubjectTable subjects={subjects} />

        {/* Quick Actions per Subject */}
        <div className="glass-card p-5 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
            Quick Update
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }} />
                  <span className="text-xs font-medium text-foreground truncate">{subject.name}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSubjects((prev) =>
                        prev.map((s) =>
                          s.id === subject.id
                            ? { ...s, attended: s.attended + 1, total: s.total + 1 }
                            : s
                        )
                      );
                    }}
                    className="px-2 py-1 text-xs rounded bg-success/10 text-success hover:bg-success/20 transition-colors font-medium"
                    title="Mark attended"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => {
                      setSubjects((prev) =>
                        prev.map((s) =>
                          s.id === subject.id
                            ? { ...s, total: s.total + 1 }
                            : s
                        )
                      );
                    }}
                    className="px-2 py-1 text-xs rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors font-medium"
                    title="Mark missed"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="p-1 text-muted-foreground hover:text-danger transition-colors"
                    title="Remove subject"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
