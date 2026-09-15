import { useState } from "react";
import {
  Home,
  Shield,
  FileText,
  ClipboardList,
  Search,
  AlertTriangle,
  Target,
  FlaskConical,
  Award,
  FileStack,
  GraduationCap,
  Wrench,
  Package,
  TestTube,
  Thermometer,
  BarChart3,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Microscope,
  Activity,
} from "lucide-react";

interface SidebarProps {
  activeItem?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ activeItem = "Dashboard", collapsed = false, onToggle }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    MAIN: true,
    COMPLIANCE: true,
    QUALITY: true,
    OPERATIONS: true,
    REPORTS: true,
    DEPARTMENTS: true,
  });

  const menuSections = [
    {
      id: "MAIN",
      title: "MAIN",
      items: [{ icon: Home, label: "Dashboard", path: "/" }],
    },
    {
      id: "COMPLIANCE",
      title: "COMPLIANCE",
      items: [
        { icon: Shield, label: "CAP Readiness", path: "/cap-readiness" },
        { icon: FileText, label: "All Common Checklist", path: "/common-checklist" },
        { icon: ClipboardList, label: "Department Checklists", path: "/department-checklists" },
        { icon: Search, label: "Audit Management", path: "/audit-management" },
        { icon: AlertTriangle, label: "CAPA Management", path: "/capa-management" },
        { icon: Target, label: "Risk Management", path: "/risk-management" },
      ],
    },
    {
      id: "QUALITY",
      title: "QUALITY",
      items: [
        { icon: FlaskConical, label: "Quality Control", path: "/quality-control" },
        { icon: Award, label: "Proficiency Testing", path: "/proficiency-testing" },
        { icon: FileStack, label: "Document Control", path: "/document-control" },
        { icon: GraduationCap, label: "Training & Competency", path: "/training-competency" },
      ],
    },
    {
      id: "OPERATIONS",
      title: "OPERATIONS",
      items: [
        { icon: Wrench, label: "Equipment Management", path: "/equipment-management" },
        { icon: Package, label: "Inventory & Reagents", path: "/inventory-reagents" },
        { icon: TestTube, label: "Sample Management", path: "/sample-management" },
        { icon: Thermometer, label: "Environmental Monitoring", path: "/environmental-monitoring" },
      ],
    },
    {
      id: "REPORTS",
      title: "REPORTS",
      items: [
        { icon: BarChart3, label: "Reports & Analytics", path: "/reports-analytics" },
        { icon: TrendingUp, label: "Trends & Indicators", path: "/trends-indicators" },
      ],
    },
    {
      id: "DEPARTMENTS",
      title: "DEPARTMENTS",
      items: [
        { icon: Microscope, label: "Microbiology", path: "/microbiology" },
        { icon: FlaskConical, label: "Virology", path: "/virology" },
        { icon: Activity, label: "Mycobacteriology", path: "/mycobacteriology" },
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSections((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex h-screen flex-col bg-slate-900 text-white shadow-[8px_0_24px_rgba(15,23,42,0.14)] transition-[width] duration-200 ${collapsed ? "w-[4.25rem]" : "w-60"}`}
    >
      <div className={`border-b border-slate-700/60 ${collapsed ? "p-3" : "p-4"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="rounded-lg bg-blue-600 p-1.5 shadow-lg shadow-blue-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight tracking-tight">JCRC CAP-OS</div>
              <div className="mt-0.5 text-[10px] leading-tight text-slate-400">
                Laboratory Quality
                <br />
                Management System
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className={`flex-1 overflow-y-auto py-3 ${collapsed ? "px-1.5" : "px-2"}`}>
        {menuSections.map((section, idx) => {
          const isExpanded = expandedSections[section.id] ?? true;
          const hasItems = section.items.length > 0;

          return (
            <div key={idx} className={`${collapsed ? "mb-2" : "mb-3"}`}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="mb-1.5 flex w-full items-center justify-between px-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition hover:text-slate-300"
                >
                  <span>{section.title}</span>
                  {hasItems && <ChevronDown className={`h-3 w-3 transition ${isExpanded ? "rotate-0" : "-rotate-90"}`} />}
                </button>
              )}

              {(!collapsed && isExpanded) || collapsed ? (
                <div className="space-y-1">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive = item.label === activeItem;

                    return (
                      <a
                        key={itemIdx}
                        href={item.path}
                        className={[
                          "flex items-center rounded-lg text-xs transition-all duration-150",
                          collapsed ? "justify-center px-1.5 py-2" : "justify-between px-2.5 py-2",
                          isActive
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-3.5 w-3.5" />
                          {!collapsed && <span className="font-medium">{item.label}</span>}
                        </div>
                        {!collapsed && section.title !== "MAIN" && <ChevronRight className="h-3 w-3 text-slate-400" />}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className={`border-t border-slate-700/60 ${collapsed ? "p-2" : "p-3"} space-y-1`}>
        <a
          href="/settings"
          className={`flex items-center rounded-lg py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </a>
        <a
          href="/support"
          className={`flex items-center rounded-lg py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
        >
          <HelpCircle className="h-4 w-4" />
          {!collapsed && <span>Support</span>}
        </a>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={`flex w-full items-center rounded-lg py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
