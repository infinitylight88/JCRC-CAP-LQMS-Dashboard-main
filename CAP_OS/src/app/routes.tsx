import { createBrowserRouter } from "react-router";
import { cloneElement, useState, type ReactElement } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Compliance } from "./pages/Compliance";
import { Sidebar } from "./components/layout/Sidebar";

function AppShell({
  activeItem,
  children,
}: {
  activeItem: string;
  children: ReactElement<{ sidebarCollapsed?: boolean }>;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar
          activeItem={activeItem}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
      </div>
      {cloneElement(children, { sidebarCollapsed })}
    </div>
  );
}

function Root() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar
          activeItem="Dashboard"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
      </div>
      <Dashboard sidebarCollapsed={sidebarCollapsed} />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  {
    path: "/cap-readiness",
    element: (
      <AppShell activeItem="CAP Readiness">
        <Compliance />
      </AppShell>
    ),
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 lg:ml-64">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Coming Soon</h1>
            <p className="text-gray-600">This page is under development</p>
          </div>
        </div>
      </div>
    ),
  },
]);
