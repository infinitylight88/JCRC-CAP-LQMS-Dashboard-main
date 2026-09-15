import { Card } from "../ui/card";
import { 
  FileText, 
  FileStack, 
  FlaskConical, 
  Wrench, 
  Package, 
  GraduationCap, 
  AlertTriangle, 
  BarChart3,
  Shield
} from "lucide-react";

export function QuickAccess() {
  const quickAccessItems = [
    {
      icon: Shield,
      label: "CAP Checklists",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/cap-checklists"
    },
    {
      icon: FileStack,
      label: "Document Control",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/document-control"
    },
    {
      icon: FlaskConical,
      label: "QC Dashboard",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      href: "/qc-dashboard"
    },
    {
      icon: Wrench,
      label: "Equipment",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      href: "/equipment"
    },
    {
      icon: Package,
      label: "Inventory",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/inventory"
    },
    {
      icon: GraduationCap,
      label: "Competencies",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      href: "/competencies"
    },
    {
      icon: AlertTriangle,
      label: "CAPA Log",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      href: "/capa-log"
    },
    {
      icon: BarChart3,
      label: "Reports",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      href: "/reports"
    }
  ];

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-900">Quick Access</h3>
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {quickAccessItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <a
              key={index}
              href={item.href}
              className="group"
            >
              <Card className="h-full cursor-pointer p-3 transition-all hover:scale-105 hover:shadow-md">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`${item.bgColor} rounded-lg p-2 transition-transform group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {item.label}
                  </span>
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
