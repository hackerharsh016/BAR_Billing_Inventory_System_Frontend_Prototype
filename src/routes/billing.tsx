import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useStore, fmtINR } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";

export const Route = createFileRoute("/billing")({
  component: BillingLayout,
});

function BillingLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/billing") return <Outlet />;
  return <BillingList />;
}

function BillingList() {
  const bills = useStore((s) => s.bills);
  return (
    <Panel title="All Invoices">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Bill No</th>
              <th className="text-left px-3 py-2">Date & Time</th>
              <th className="text-left px-3 py-2">Table</th>
              <th className="text-left px-3 py-2">Items</th>
              <th className="text-right px-3 py-2">Amount</th>
              <th className="text-left px-3 py-2">Payment</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-right px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-2 font-medium">{b.number}</td>
                <td className="px-3 py-2 text-xs">
                  {new Date(b.time).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-3 py-2">Table {b.tableNo}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{b.items.length} items</td>
                <td className="px-3 py-2 text-right font-medium">{fmtINR(b.total)}</td>
                <td className="px-3 py-2">{b.payment}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={b.status} />
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
  );
}
