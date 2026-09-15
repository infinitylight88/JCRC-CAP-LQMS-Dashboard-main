import { Card } from "../ui/card";
import { 
  FileText, 
  Wrench, 
  FlaskConical, 
  GraduationCap, 
  Package, 
  ChevronRight 
} from "lucide-react";
import { Button } from "../ui/button";

export function AlertsPanel() {
  const alerts = [
    {
      icon: FileText,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      title: "SOP Review Overdue",
      description: "3 documents are past due",
      time: "2h ago"
    },
    {
      icon: Wrench,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      title: "Equipment Maintenance Due",
      description: "4 instruments require attention",
      time: "4h ago"
    },
    {
      icon: FlaskConical,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "QC Out Of Range",
      description: "2 QC events need review",
      time: "6h ago"
    },
    {
      icon: GraduationCap,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      title: "Competency Assessment Due",
      description: "12 assessments due",
      time: "1d ago"
    },
    {
      icon: Package,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      title: "Reagent Lot Expiring",
      description: "5 lots expire within 30 days",
      time: "2d ago"
    }
  ];

  return (
    <Card className="flex h-full flex-col gap-0 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-900">Alerts and Notifications</h3>
        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          View all
        </Button>
      </div>

      <div className="space-y-0.5">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;

          return (
            <div
              key={index}
              className="group flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-gray-50"
            >
              <div className={`${alert.iconBg} p-1.5 rounded-lg flex-shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${alert.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-xs font-medium text-gray-900">{alert.title}</div>
                  <span className="flex-shrink-0 text-[10px] text-gray-400">{alert.time}</span>
                </div>
                <div className="truncate text-[10px] text-gray-500">{alert.description}</div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
