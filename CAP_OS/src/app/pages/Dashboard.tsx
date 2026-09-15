import { Header } from "../components/layout/Header";
import { KPICards } from "../components/dashboard/KPICards";
import { CAPReadinessChart } from "../components/dashboard/CAPReadinessChart";
import { ComplianceDonut } from "../components/dashboard/ComplianceDonut";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { MyTasks } from "../components/dashboard/MyTasks";
import { QuickAccess } from "../components/dashboard/QuickAccess";

interface DashboardProps {
  sidebarCollapsed?: boolean;
}

export function Dashboard({ sidebarCollapsed = false }: DashboardProps) {
  return (
    <div className={`min-w-0 bg-transparent transition-[margin] duration-200 ${sidebarCollapsed ? 'lg:ml-[4.25rem]' : 'lg:ml-60'}`}>
      <Header />

      <div className="flex-1">
        <main className="mx-auto w-full max-w-[1680px] space-y-4 p-3 sm:p-4 lg:p-5">
          <KPICards />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
            <div className="col-span-1 flex flex-col lg:h-[300px]">
              <CAPReadinessChart />
            </div>
            <div className="col-span-1 flex flex-col lg:h-[300px]">
              <ComplianceDonut />
            </div>
            <div className="col-span-1 flex flex-col lg:h-[300px]">
              <AlertsPanel />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(280px,1fr)]">
            <div className="flex flex-col">
              <RecentActivity />
            </div>
            <div className="col-span-1 flex flex-col">
              <MyTasks />
            </div>
          </div>

          <QuickAccess />
        </main>
      </div>
    </div>
  );
}
