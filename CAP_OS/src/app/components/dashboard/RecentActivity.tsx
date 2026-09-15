import { Card } from "../ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  FlaskConical, 
  FileCheck, 
  Wrench, 
  AlertTriangle, 
  GraduationCap 
} from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      icon: FlaskConical,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      activity: "QC review completed - Level 2",
      department: "Hematology",
      user: "Mwanje Jhon Bosco",
      time: "May 20, 2025 08:30",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700"
    },
    {
      icon: FileCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      activity: "SOP approved - CBC Procedure",
      department: "Hematology",
      user: "Roodny Kazoba",
      time: "May 20, 2025 08:15",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700"
    },
    {
      icon: Wrench,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      activity: "Equipment maintenance logged",
      department: "Chemistry",
      user: "Charlse Draleku",
      time: "May 20, 2025 07:45",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700"
    },
    {
      icon: AlertTriangle,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      activity: "CAPA created - Sample Rejection",
      department: "Microbiology",
      user: "Katemba C.",
      time: "May 20, 2025 07:10",
      status: "Open",
      statusColor: "bg-orange-100 text-orange-700"
    },
    {
      icon: GraduationCap,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      activity: "Competency assessment completed",
      department: "Flow Cytometry",
      user: "Dr. Ann R. Namuganga",
      time: "May 20, 2025 07:15",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700"
    }
  ];

  return (
    <Card className="flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          View all activity
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Activity</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`${item.iconBg} rounded-md p-1.5`}>
                        <Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                      </div>
                      <span className="text-xs font-medium">{item.activity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {item.department}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {item.user}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {item.time}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className={item.statusColor}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
