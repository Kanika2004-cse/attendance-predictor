import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from "recharts";
import { Subject, getAttendancePercentage, REQUIRED_PERCENTAGE } from "@/lib/attendance-utils";

interface AttendanceBarChartProps {
  subjects: Subject[];
}

export function AttendanceBarChart({ subjects }: AttendanceBarChartProps) {
  const data = subjects.map((s) => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    percentage: parseFloat(getAttendancePercentage(s.attended, s.total).toFixed(1)),
    attended: s.attended,
    total: s.total,
    fill: s.color,
  }));

  return (
    <div className="glass-card p-5 border border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Subject-wise Attendance
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 15%)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(222, 30%, 18%)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(222, 30%, 18%)" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 41%, 10%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
              fontSize: "12px",
            }}
            formatter={(value: number, _name: string, props: any) => [
              `${value}% (${props.payload.attended}/${props.payload.total})`,
              "Attendance",
            ]}
          />
          <ReferenceLine
            y={REQUIRED_PERCENTAGE}
            stroke="hsl(0, 84%, 60%)"
            strokeDasharray="5 5"
            strokeWidth={1.5}
            label={{
              value: "75% Min",
              position: "right",
              fill: "hsl(0, 84%, 60%)",
              fontSize: 10,
            }}
          />
          <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="percentage"
              position="top"
              formatter={(v: number) => `${v}%`}
              style={{ fill: "hsl(210, 40%, 96%)", fontSize: 10, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
