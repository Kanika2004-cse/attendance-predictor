import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Subject, getAttendancePercentage } from "@/lib/attendance-utils";

interface AttendancePieChartProps {
  subjects: Subject[];
}

export function AttendancePieChart({ subjects }: AttendancePieChartProps) {
  const data = subjects.map((s) => ({
    name: s.name,
    value: parseFloat(getAttendancePercentage(s.attended, s.total).toFixed(1)),
    fill: s.color,
  }));

  return (
    <div className="glass-card p-5 border border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Attendance Distribution
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 41%, 10%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value}%`, "Attendance"]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "hsl(215, 20%, 55%)" }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
