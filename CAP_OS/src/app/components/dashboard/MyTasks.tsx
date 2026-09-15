import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export function MyTasks() {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      label: "Review XN-550 Daily QC",
      status: "QC Review",
      statusColor: "bg-blue-100 text-blue-700",
      dueLabel: "Due today",
      dueColor: "text-red-600",
      completed: false
    },
    {
      id: "2",
      label: "Approve Blood Bank SOP",
      status: "SOP Review",
      statusColor: "bg-purple-100 text-purple-700",
      dueLabel: "Due today",
      dueColor: "text-red-600",
      completed: false
    },
    {
      id: "3",
      label: "Train New CD4 Panel Setup",
      status: "Training",
      statusColor: "bg-green-100 text-green-700",
      dueLabel: "Due in 2 days",
      dueColor: "text-gray-600",
      completed: true
    },
    {
      id: "4",
      label: "Complete CAPA Investigation",
      status: "CAPA",
      statusColor: "bg-orange-100 text-orange-700",
      dueLabel: "Due in 2 days",
      dueColor: "text-gray-600",
      completed: true
    },
    {
      id: "5",
      label: "Review Monthly Quality Indicators",
      status: "Quality",
      statusColor: "bg-indigo-100 text-indigo-700",
      dueLabel: "Due in 3 days",
      dueColor: "text-gray-600",
      completed: true
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <Card className="flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">My Tasks</h3>
        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          View all
        </Button>
      </div>

      <div className="mb-3 space-y-1">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="group flex items-start gap-2 rounded-md p-2 transition-colors hover:bg-gray-50"
          >
            <Checkbox 
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="mt-0.5"
            />
            
            <div className="flex-1 min-w-0">
              <label 
                htmlFor={task.id}
                className={`block cursor-pointer text-xs font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {task.label}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`${task.statusColor} text-xs`}
                >
                  {task.status}
                </Badge>
                <span className={`text-xs ${task.dueColor}`}>
                  {task.dueLabel}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">
            {completedCount} of {totalCount} tasks completed
          </span>
          <span className="text-xs font-semibold text-gray-900">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </Card>
  );
}
