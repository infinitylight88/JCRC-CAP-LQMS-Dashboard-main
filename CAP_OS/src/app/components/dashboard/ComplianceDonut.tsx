import { Card } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export function ComplianceDonut() {
  const data = [
    { name: "Compliant", value: 1198, color: "#22C55E" },
    { name: "At Risk", value: 28, color: "#EAB308" },
    { name: "Non-compliant", value: 22, color: "#EF4444" }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full gap-0 p-3">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-900">Compliance Status (All Items)</h3>
        <Button variant="outline" size="sm" className="h-7 gap-1 px-2">
          <span className="text-xs">This Month</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="relative">
          <ResponsiveContainer width="100%" height={155}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mb-0.5 text-xs text-gray-500">Total</div>
          <div className="text-xl font-bold text-gray-900">{total.toLocaleString()}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-1 space-y-1">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(0);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900">
                  {item.value.toLocaleString()}
                </span>
                <span className="w-10 text-right text-xs text-gray-500">
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
