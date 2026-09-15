import { ArrowRight, CheckCircle2, ClipboardCheck, Clock3, FileCheck2, ShieldCheck, TrendingUp, TriangleAlert, Users } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

interface ComplianceProps {
  sidebarCollapsed?: boolean;
}

const readinessMetrics = [
  { label: "Overall CAP readiness", value: 88, tone: "bg-emerald-500" },
  { label: "Documentation status", value: 94, tone: "bg-blue-500" },
  { label: "Competency compliance", value: 81, tone: "bg-violet-500" },
  { label: "QC monitoring", value: 92, tone: "bg-amber-500" },
];

const complianceChecks = [
  { name: "Daily QC logging", status: "Pass", detail: "Completed for 6/6 shifts", tone: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "Calibration verification", status: "Pass", detail: "Last review 3 days ago", tone: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "Competency signoff", status: "Pending", detail: "2 staff records awaiting review", tone: "text-amber-600 bg-amber-50 border-amber-200" },
  { name: "Equipment maintenance", status: "Flagged", detail: "1 analyzer due for validation", tone: "text-rose-600 bg-rose-50 border-rose-200" },
];

const departmentFocus = [
  { name: "Hematology", readiness: 92, owner: "Dr. K. Underwood" },
  { name: "Coagulation", readiness: 87, owner: "Mrs. A. Yeboah" },
  { name: "Transfusion Medicine", readiness: 90, owner: "Mr. F. Njeri" },
  { name: "Molecular Diagnostics", readiness: 76, owner: "Pending assignment" },
];

const actionItems = [
  "Review annual competency packets for technologists",
  "Reconcile open corrective actions for analyzer maintenance",
  "Schedule monthly director signoff for QC review",
  "Finalize document control updates for quality plan",
];

export function Compliance({ sidebarCollapsed = false }: ComplianceProps) {
  return (
    <div className={`min-w-0 bg-transparent transition-[margin] duration-200 ${sidebarCollapsed ? "lg:ml-[4.25rem]" : "lg:ml-60"}`}>
      <Header />

      <main className="mx-auto w-full max-w-[1680px] space-y-4 p-3 sm:p-4 lg:p-5">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              CAP Readiness
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Compliance overview
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Continuous quality monitoring across the laboratory’s high-risk testing domains.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
              Export report
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Review checklist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {readinessMetrics.map((metric) => (
            <Card key={metric.label} className="overflow-hidden border-slate-200/80">
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{metric.label}</span>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">{metric.value}%</Badge>
                </div>
                <div className="mb-2 flex items-end justify-between">
                  <div className="text-3xl font-bold tracking-tight text-slate-900">{metric.value}</div>
                  <div className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">Target 90%</div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`${metric.tone} h-full rounded-full`} style={{ width: `${metric.value}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <Card className="border-slate-200/80">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold text-slate-900">Compliance checks</CardTitle>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">12 active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              {complianceChecks.map((check) => (
                <div key={check.name} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="flex items-start gap-3">
                    {check.status === "Pass" ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    ) : check.status === "Pending" ? (
                      <Clock3 className="mt-0.5 h-5 w-5 text-amber-600" />
                    ) : (
                      <TriangleAlert className="mt-0.5 h-5 w-5 text-rose-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{check.name}</p>
                      <p className="text-xs text-slate-500">{check.detail}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${check.tone}`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold text-slate-900">Priority actions</CardTitle>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">4 items</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              {actionItems.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <Card className="border-slate-200/80">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold text-slate-900">Department readiness</CardTitle>
                <Badge className="bg-slate-100 text-slate-700">Q2 review</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {departmentFocus.map((department) => (
                <div key={department.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{department.name}</span>
                      <span className="ml-2 text-xs text-slate-500">{department.owner}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{department.readiness}%</span>
                  </div>
                  <Progress value={department.readiness} className="h-2.5 bg-slate-100" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold text-slate-900">Compliance snapshot</CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Stable</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <FileCheck2 className="mb-2 h-5 w-5 text-blue-600" />
                  <div className="text-2xl font-bold text-slate-900">168</div>
                  <div className="text-xs text-slate-500">Checklist items tracked</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Users className="mb-2 h-5 w-5 text-violet-600" />
                  <div className="text-2xl font-bold text-slate-900">26</div>
                  <div className="text-xs text-slate-500">Staff competency files</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <ClipboardCheck className="mb-2 h-5 w-5 text-emerald-600" />
                  <div className="text-2xl font-bold text-slate-900">96%</div>
                  <div className="text-xs text-slate-500">Documentation completion</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <TrendingUp className="mb-2 h-5 w-5 text-amber-600" />
                  <div className="text-2xl font-bold text-slate-900">+7%</div>
                  <div className="text-xs text-slate-500">Quarter over quarter</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
