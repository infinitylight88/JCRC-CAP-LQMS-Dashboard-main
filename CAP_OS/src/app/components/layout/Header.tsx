import { Search, Bell, Mail, Menu, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-3 py-2 backdrop-blur-sm sm:px-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">Dashboard</h1>
            <p className="hidden text-[11px] text-slate-500 sm:block">
              Real-time overview of laboratory quality and compliance
            </p>
          </div>
        </div>

        <div className="mx-4 hidden max-w-xl flex-1 md:block xl:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search anything..."
              className="border-slate-200 bg-slate-50 pl-10 pr-16 text-sm shadow-sm focus-visible:ring-blue-100"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                ⌘
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
          <Button variant="outline" className="hidden gap-2 border-slate-200 bg-white xl:flex">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-700">May 20, 2026</span>
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-red-500 p-0 text-[10px] text-white">
                3
              </Badge>
            </Button>
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
              <Mail className="h-5 w-5 text-slate-600" />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-blue-600 p-0 text-[10px] text-white">
                5
              </Badge>
            </Button>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-2 sm:pl-3">
            <Avatar className="h-8 w-8 ring-2 ring-slate-100">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Edie" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 text-sm lg:block">
              <div className="whitespace-nowrap font-semibold leading-tight text-slate-900">Edie Rubanga</div>
              <div className="text-[10px] leading-tight text-slate-500">Quality Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
