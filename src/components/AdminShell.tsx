import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Utensils,
  Receipt,
  Package,
  Truck,
  BookOpen,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  Bell,
  Search,
  ChevronDown,
  Menu as MenuIcon,
  LogOut,
  User,
} from "lucide-react";
import { useStore, inventoryStatus } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tables", label: "Tables / Orders", icon: Utensils },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/purchase", label: "Purchase Entry", icon: Truck },
  { to: "/menu", label: "Menu Management", icon: BookOpen },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/staff", label: "Staff", icon: Users },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function crumbFor(pathname: string) {
  if (pathname === "/") return ["Home", "Dashboard"];
  const seg = pathname.split("/").filter(Boolean);
  const map: Record<string, string> = {
    tables: "Tables / Orders",
    billing: "Billing",
    inventory: "Inventory",
    purchase: "Purchase Entry",
    menu: "Menu Management",
    reports: "Reports",
    staff: "Staff",
    settings: "Settings",
    order: "Order Entry",
  };
  return ["Home", ...seg.map((s) => map[s] ?? s)];
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(true);
  const inventory = useStore((s) => s.inventory);
  const settings = useStore((s) => s.settings);
  const lowStock = inventory.filter((i) => inventoryStatus(i) !== "In Stock");
  const crumbs = crumbFor(pathname);

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={`${open ? "w-60" : "w-16"} transition-all duration-200 shrink-0 bg-sidebar-bg text-sidebar-fg flex flex-col`}
      >
        <div className="h-14 flex items-center gap-2 px-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            CB
          </div>
          {open && (
            <div className="leading-tight">
              <div className="font-semibold text-sm">Copper Barrel</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</div>
            </div>
          )}
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-4 py-2 text-sm border-l-[3px] ${
                  active
                    ? "bg-sidebar-hover border-primary text-white"
                    : "border-transparent hover:bg-sidebar-hover hover:text-white"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {open && <span>{n.label}</span>}
                {n.label === "Inventory" && lowStock.length > 0 && open && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {lowStock.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 text-[11px] text-white/40">
          {open && <>v1.0.0 &middot; Prototype</>}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-navbar border-b border-border flex items-center px-4 gap-3">
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 hover:bg-muted rounded-sm text-navbar-fg"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={18} />
          </button>
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>{c}</span>
              </span>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 bg-muted border border-border rounded-sm text-sm w-56 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 hover:bg-muted rounded-sm">
                  <Bell size={16} />
                  {lowStock.length > 0 && (
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      {lowStock.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Low Stock Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {lowStock.length === 0 && (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">All stock healthy</div>
                )}
                {lowStock.slice(0, 6).map((i) => (
                  <DropdownMenuItem key={i.id} className="flex justify-between">
                    <span>{i.name}</span>
                    <span className="text-destructive font-medium">{i.stock}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-sm text-sm">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                    RK
                  </div>
                  <span className="hidden sm:inline">Rajesh Kumar</span>
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="text-sm">Rajesh Kumar</div>
                  <div className="text-xs text-muted-foreground font-normal">Owner</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User size={14} className="mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login">
                    <LogOut size={14} className="mr-2" /> Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{crumbs[crumbs.length - 1]}</h1>
            <p className="text-xs text-muted-foreground">{settings.venueName}</p>
          </div>
        </div>

        <main className="flex-1 p-4 min-w-0">{children}</main>

        <footer className="border-t border-border py-2 px-4 text-xs text-muted-foreground bg-panel">
          &copy; {new Date().getFullYear()} {settings.venueName} &middot; Classic Billing UI Prototype
        </footer>
      </div>
    </div>
  );
}

export function Panel({ title, actions, children, className = "" }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`admin-panel ${className}`}>
      {title && (
        <div className="admin-panel-header">
          <span>{title}</span>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Free: "bg-success/15 text-success border-success/30",
    Occupied: "bg-warning/20 text-warning-foreground border-warning/40",
    "Bill Printed": "bg-info/15 text-info border-info/30",
    Paid: "bg-success/15 text-success border-success/30",
    Pending: "bg-warning/20 text-warning-foreground border-warning/40",
    Active: "bg-success/15 text-success border-success/30",
    Inactive: "bg-muted text-muted-foreground border-border",
    "In Stock": "bg-success/15 text-success border-success/30",
    "Low Stock": "bg-warning/20 text-warning-foreground border-warning/40",
    "Out of Stock": "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-[11px] font-medium ${
        map[status] || "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}
