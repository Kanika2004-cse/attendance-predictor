export interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
  color: string;
}

export const REQUIRED_PERCENTAGE = 75;

export function getAttendancePercentage(attended: number, total: number): number {
  if (total === 0) return 100;
  return (attended / total) * 100;
}

export function getOverallAttendance(subjects: Subject[]): { attended: number; total: number; percentage: number } {
  const attended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const total = subjects.reduce((sum, s) => sum + s.total, 0);
  return { attended, total, percentage: getAttendancePercentage(attended, total) };
}

// How many more classes must be attended (consecutively) to reach target%
export function classesNeededToReach(attended: number, total: number, target: number = REQUIRED_PERCENTAGE): number {
  if (getAttendancePercentage(attended, total) >= target) return 0;
  // (attended + x) / (total + x) >= target/100
  // attended + x >= target/100 * (total + x)
  // x(1 - target/100) >= target/100 * total - attended
  // x >= (target*total/100 - attended) / (1 - target/100)
  const t = target / 100;
  const x = Math.ceil((t * total - attended) / (1 - t));
  return Math.max(0, x);
}

// How many classes can be skipped while staying at or above target%
export function leavesAllowed(attended: number, total: number, target: number = REQUIRED_PERCENTAGE): number {
  if (getAttendancePercentage(attended, total) < target) return 0;
  // attended / (total + x) >= target/100
  // x <= attended*100/target - total
  const x = Math.floor((attended * 100) / target - total);
  return Math.max(0, x);
}

// Simulate attending/skipping n future classes
export function simulateAttendance(
  attended: number,
  total: number,
  futureAttend: number,
  futureSkip: number
): { newAttended: number; newTotal: number; newPercentage: number } {
  const newAttended = attended + futureAttend;
  const newTotal = total + futureAttend + futureSkip;
  return {
    newAttended,
    newTotal,
    newPercentage: getAttendancePercentage(newAttended, newTotal),
  };
}

export function getStatusColor(percentage: number): string {
  if (percentage >= 85) return "success";
  if (percentage >= 75) return "warning";
  return "danger";
}

export function getStatusLabel(percentage: number): string {
  if (percentage >= 85) return "Safe";
  if (percentage >= 75) return "Borderline";
  return "Critical";
}

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "1", name: "Mathematics", attended: 38, total: 45, color: "hsl(199, 89%, 48%)" },
  { id: "2", name: "Physics", attended: 30, total: 42, color: "hsl(142, 71%, 45%)" },
  { id: "3", name: "Chemistry", attended: 28, total: 40, color: "hsl(47, 96%, 53%)" },
  { id: "4", name: "Computer Science", attended: 35, total: 38, color: "hsl(280, 65%, 60%)" },
  { id: "5", name: "English", attended: 22, total: 35, color: "hsl(0, 84%, 60%)" },
  { id: "6", name: "Electronics", attended: 33, total: 40, color: "hsl(168, 76%, 42%)" },
];
