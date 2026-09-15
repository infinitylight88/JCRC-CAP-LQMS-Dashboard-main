import { Shield, ClipboardList, FolderOpen, Users, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function KPICards() {
  const kpis = [
    {
      title: "CAP Readiness Score",
      icon: Shield,
      value: "96%",
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      progress: 96,
      subtitle: "Target 100%",
      change: "+4%",
      changeLabel: "vs last month",
      changeColor: "text-green-600"
    },
    {
      title: "Open Findings",
      icon: ClipboardList,
      value: "7",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      badge: "+3",
      badgeColor: "bg-purple-600",
      subtitle: "7 total open items",
      action: "View all findings",
      actionIcon: ArrowRight
    },
    {
      title: "SOPs Due For Review",
      icon: FolderOpen,
      value: "5",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      badge: "+2",
      badgeColor: "bg-orange-600",
      subtitle: "Due within 30 days",
      action: "View all documents",
      actionIcon: ArrowRight
    },
    {
      title: "Competencies Due",
      icon: Users,
      value: "12",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: "+4",
      badgeColor: "bg-blue-600",
      subtitle: "Due within 30 days",
      action: "View all competencies",
      actionIcon: ArrowRight
    },
    {
      title: "Open CAPAs",
      icon: AlertTriangle,
      value: "3",
      color: "text-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      badge: "+1",
      badgeColor: "bg-red-600",
      subtitle: "Pending attention",
      action: "View all CAPAs",
      actionIcon: ArrowRight
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const ActionIcon = kpi.actionIcon;

        return (
          <Card
            key={index}
            className="min-w-0 px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className={`${kpi.bgColor} shrink-0 rounded-xl p-2 shadow-inner`}>
                  <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">
                    {kpi.title}
                  </div>
                  <div className={`mt-1 text-2xl font-bold leading-none ${kpi.color}`}>{kpi.value}</div>
                  <div className="mt-1 truncate text-[10px] text-slate-500">{kpi.subtitle}</div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5 pt-1">
                {kpi.badge && (
                  <Badge className={`${kpi.badgeColor} px-1.5 py-0 text-[10px] font-medium text-white`}>
                    {kpi.badge}
                  </Badge>
                )}
                {kpi.change && (
                  <div className={`flex items-center gap-1 text-[11px] font-medium ${kpi.changeColor}`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>{kpi.change}</span>
                  </div>
                )}
                {kpi.action && ActionIcon && (
                  <button className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700">
                    View <ActionIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {kpi.progress !== undefined && (
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${kpi.progress}%` }} />
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
