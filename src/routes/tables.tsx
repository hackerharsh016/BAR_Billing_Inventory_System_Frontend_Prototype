import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtINR, clearOrder } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { Utensils, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tables")({
  component: TablesPage,
});

function TablesPage() {
  const tables = useStore((s) => s.tables);

  return (
    <Panel title="All Tables">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tables.map((t) => {
          const total = t.order.reduce((s, l) => s + l.qty * l.rate, 0);
          const border =
            t.status === "Free"
              ? "border-success/40"
              : t.status === "Occupied"
                ? "border-warning/50"
                : "border-info/40";
          return (
            <div key={t.id} className={`border-2 ${border} rounded-sm bg-card p-3 flex flex-col`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-muted-foreground" />
                  <span className="font-semibold">Table {t.number}</span>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="text-xs text-muted-foreground mt-2 min-h-[32px]">
                {t.order.length > 0 ? `${t.order.length} items · ${fmtINR(total)}` : "No active order"}
              </div>
              <Link
                to="/order/$tableId"
                params={{ tableId: t.id }}
                className="mt-2 text-center bg-primary text-primary-foreground text-xs py-1.5 rounded-sm hover:bg-primary/90"
              >
                {t.status === "Free" ? "New Order" : "View Order"}
              </Link>
              {t.status === "Bill Printed" && (
                <button
                  onClick={() => {
                    clearOrder(t.id);
                    toast.success(`Table ${t.number} released`);
                  }}
                  className="mt-1.5 bg-success text-success-foreground text-xs py-1.5 rounded-sm hover:opacity-90 flex items-center justify-center gap-1"
                >
                  <CheckCircle2 size={12} /> Complete & Free
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
