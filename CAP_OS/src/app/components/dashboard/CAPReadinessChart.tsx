import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function CAPReadinessChart() {
  const data = [
    { name: "Hematology", score: 98, status: "compliant" },
    { name: "Chemistry", score: 95, status: "compliant" },
    { name: "Microbiology", score: 93, status: "warning" },
    { name: "Immunology", score: 97, status: "compliant" },
    { name: "Molecular Biology", score: 91, status: "warning" },
    { name: "Virology", score: 96, status: "compliant" }
  ];

  const getBarColor = (status: string) => {
    if (status === "compliant") return "#22C55E";
    if (status === "warning") return "#EAB308";
    return "#EF4444";
  };

  return (
    <Card className="h-full gap-0 p-3">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-900">CAP Readiness by Department</h3>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={{ fill: '#6B7280', fontSize: 9 }}
            angle={-35}
            textAnchor="end"
            height={48}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
            formatter={(value: number) => [`${value}%`, 'Score']}
          />
          <Bar 
            dataKey="score" 
            radius={[8, 8, 0, 0]}
            maxBarSize={36}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cap-cell-${entry.name}-${index}`} fill={getBarColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[9px]">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Compliant (≥95%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">At Risk (90-94%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Non-compliant (&lt;90%)</span>
        </div>
      </div>
    </Card>
  );
}
