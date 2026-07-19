import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtINR, inventoryStatus } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { IndianRupee, Utensils, AlertTriangle, ReceiptText, ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const bills = useStore((s) => s.bills);
  const tables = useStore((s) => s.tables);
  const inventory = useStore((s) => s.inventory);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysBills = bills.filter((b) => new Date(b.time) >= today);
  const todaysSales = todaysBills.reduce((s, b) => s + b.total, 0);
  const openTables = tables.filter((t) => t.status !== "Free").length;
  const lowStock = inventory.filter((i) => inventoryStatus(i) !== "In Stock");

  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const total = bills
      .filter((b) => new Date(b.time) >= d && new Date(b.time) < next)
      .reduce((s, b) => s + b.total, 0);
    return { day: d.toLocaleDateString("en-IN", { weekday: "short" }), sales: total };
  });

  const stats = [
    { label: "Today's Sales", value: fmtINR(todaysSales), icon: IndianRupee, color: "bg-primary" },
    { label: "Open Tables", value: `${openTables}/${tables.length}`, icon: Utensils, color: "bg-info" },
    { label: "Low Stock Items", value: lowStock.length, icon: AlertTriangle, color: "bg-warning" },
    { label: "Total Bills Today", value: todaysBills.length, icon: ReceiptText, color: "bg-success" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`stat-box ${s.color}`}>
              <div>
                <div className="text-2xl font-bold leading-none">{s.value}</div>
                <div className="text-xs mt-2 opacity-90 uppercase tracking-wide">{s.label}</div>
              </div>
              <Icon size={40} className="opacity-40" />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Sales — Last 7 Days" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }}
                  formatter={(v: number) => fmtINR(v)}
                />
                <Bar dataKey="sales" fill="var(--primary)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Low Stock Alerts"
          actions={
            <Link to="/inventory" className="text-primary text-xs hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          }
        >
          {lowStock.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">All stock levels healthy.</div>
          ) : (
            <ul className="divide-y">
              {lowStock.slice(0, 6).map((i) => (
                <li key={i.id} className="py-2 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.category} &middot; Reorder at {i.reorder}
                    </div>
                  </div>
                  <span className="text-destructive font-semibold">{i.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title="Recent Bills"
        actions={
          <Link to="/billing" className="text-primary text-xs hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Bill No</th>
                <th className="text-left px-3 py-2">Table</th>
                <th className="text-right px-3 py-2">Amount</th>
                <th className="text-left px-3 py-2">Payment</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Time</th>
                <th className="text-right px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.slice(0, 10).map((b) => (
                <tr key={b.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2 font-medium">{b.number}</td>
                  <td className="px-3 py-2">Table {b.tableNo}</td>
                  <td className="px-3 py-2 text-right">{fmtINR(b.total)}</td>
                  <td className="px-3 py-2">{b.payment}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {new Date(b.time).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to="/billing/$id"
                      params={{ id: b.id }}
                      className="text-primary hover:underline text-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
