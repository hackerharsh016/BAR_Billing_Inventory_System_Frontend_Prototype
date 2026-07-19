import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, fmtINR, inventoryStatus } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileDown, FileSpreadsheet, ShieldAlert, Award, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

type Kind = "daily" | "monthly" | "stock" | "valuation" | "consumption" | "deadstock" | "excise";

function ReportsPage() {
  const bills = useStore((s) => s.bills);
  const inventory = useStore((s) => s.inventory);
  const wastage = useStore((s) => s.wastage);
  const purchases = useStore((s) => s.purchases);
  const salesHistory = useStore((s) => s.salesHistory);

  // Filters State
  const [kind, setKind] = useState<Kind>("daily");
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29); // Default to last 30 days
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  
  // Selected item for consumption trend
  const [selectedItemId, setSelectedItemId] = useState(() => inventory[0]?.id ?? "");

  const daily = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    bills
      .filter((b) => {
        const t = new Date(b.time);
        return t >= new Date(from) && t <= new Date(to + "T23:59:59");
      })
      .forEach((b) => {
        const k = new Date(b.time).toISOString().slice(0, 10);
        const e = map.get(k) ?? { count: 0, total: 0 };
        e.count++;
        e.total += b.total;
        map.set(k, e);
      });
    return Array.from(map.entries())
      .sort()
      .map(([date, v]) => ({ date, ...v }));
  }, [bills, from, to]);

  const monthly = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    bills.forEach((b) => {
      const d = new Date(b.time);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const e = map.get(k) ?? { count: 0, total: 0 };
      e.count++;
      e.total += b.total;
      map.set(k, e);
    });
    return Array.from(map.entries())
      .sort()
      .map(([month, v]) => ({ month, ...v }));
  }, [bills]);

  // Consumption Trend Chart Data
  const consumptionChartData = useMemo(() => {
    const filteredSales = salesHistory.filter((s) => s.itemId === selectedItemId);
    
    // Group and sort by date
    const map = new Map<string, number>();
    // Pre-populate with last 30 days to show continuous zero points
    const now = new Date();
    for (let d = 29; d >= 0; d--) {
      const dateStr = new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      map.set(dateStr, 0);
    }
    
    filteredSales.forEach((s) => {
      if (map.has(s.date)) {
        map.set(s.date, (map.get(s.date) ?? 0) + s.qty);
      }
    });

    return Array.from(map.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, qty]) => ({
        label: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        value: qty,
      }));
  }, [salesHistory, selectedItemId]);

  // Dead Stock Calculation (No sales in 30 days)
  const deadStockItems = useMemo(() => {
    return inventory.filter((item) => {
      const totalSales = salesHistory
        .filter((s) => s.itemId === item.id)
        .reduce((sum, s) => sum + s.qty, 0);
      return totalSales === 0;
    });
  }, [inventory, salesHistory]);

  // Stock Valuation Calculation
  const stockValuation = useMemo(() => {
    const items = inventory.map((i) => {
      const cost = i.costPrice ?? 0;
      const val = i.stock * cost;
      return { item: i, cost, val };
    });
    const totalVal = items.reduce((sum, i) => sum + i.val, 0);
    return { items, totalVal };
  }, [inventory]);

  // Excise Compliance Register Calculation
  const exciseRegister = useMemo(() => {
    return inventory.map((item) => {
      // 1. Purchased in date range
      const purchasedQty = purchases
        .filter((p) => {
          const d = new Date(p.date);
          return d >= new Date(from) && d <= new Date(to + "T23:59:59");
        })
        .flatMap((p) => p.lines)
        .filter((l) => l.itemId === item.id)
        .reduce((sum, l) => sum + l.qty, 0);

      // 2. Sold in date range
      const soldQty = salesHistory
        .filter((s) => {
          const d = new Date(s.date);
          return d >= new Date(from) && d <= new Date(to + "T23:59:59");
        })
        .filter((s) => s.itemId === item.id)
        .reduce((sum, s) => sum + s.qty, 0);

      // 3. Wasted in date range
      const wastedQty = wastage
        .filter((w) => {
          const d = new Date(w.date);
          return d >= new Date(from) && d <= new Date(to + "T23:59:59");
        })
        .filter((w) => w.itemId === item.id)
        .reduce((sum, w) => sum + w.qty, 0);

      const closing = item.stock;
      const opening = Math.max(0, closing + soldQty + wastedQty - purchasedQty);

      return {
        item,
        opening,
        purchased: purchasedQty,
        sold: soldQty,
        wastage: wastedQty,
        closing,
      };
    });
  }, [inventory, purchases, salesHistory, wastage, from, to]);

  const chartData = useMemo(() => {
    if (kind === "daily") {
      return daily.map((d) => ({
        label: new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        value: d.total,
      }));
    } else if (kind === "monthly") {
      return monthly.map((m) => ({ label: m.month, value: m.total }));
    } else if (kind === "stock") {
      return inventory.map((i) => ({ label: i.name.slice(0, 12), value: i.stock }));
    } else if (kind === "consumption") {
      return consumptionChartData;
    }
    return [];
  }, [kind, daily, monthly, inventory, consumptionChartData]);

  const stub = (name: string) => () => toast.success(`${name} export triggered (prototype)`);

  const activeItemName = useMemo(() => {
    return inventory.find((i) => i.id === selectedItemId)?.name ?? "";
  }, [inventory, selectedItemId]);

  return (
    <div className="space-y-4 text-sm">
      <Panel title="Report Filters" className="print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Report Type</label>
            <select value={kind} onChange={(e) => setKind(e.target.value as Kind)} className="inp h-9">
              <option value="daily">Daily Sales Report</option>
              <option value="monthly">Monthly Sales Report</option>
              <option value="stock">Stock Quantity Report</option>
              <option value="valuation">Stock Valuation Report</option>
              <option value="consumption">Consumption Trend Report</option>
              <option value="deadstock">Dead Stock Report</option>
              <option value="excise">Excise-Style Stock Register</option>
            </select>
          </div>

          {kind === "consumption" && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Item to Track</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="inp h-9 min-w-[200px]"
              >
                {inventory.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kind !== "stock" && kind !== "monthly" && kind !== "valuation" && kind !== "deadstock" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">From</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="inp h-9" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">To</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="inp h-9" />
              </div>
            </>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={kind === "excise" ? () => window.print() : stub("PDF")}
              className="text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1 cursor-pointer h-9 font-semibold"
            >
              <FileDown size={12} /> {kind === "excise" ? "Print compliance list" : "Export PDF"}
            </button>
            <button
              onClick={stub("Excel")}
              className="text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1 cursor-pointer h-9 font-semibold"
            >
              <FileSpreadsheet size={12} /> Export Excel
            </button>
          </div>
        </div>
      </Panel>

      {/* Valuation Header Card */}
      {kind === "valuation" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-1">
          <div className="md:col-span-1 bg-primary/10 border border-primary/20 p-4 rounded-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-primary/80 tracking-wider">Total Stock Value</div>
              <div className="text-xl font-bold mt-1 text-primary">{fmtINR(stockValuation.totalVal)}</div>
            </div>
            <Award className="text-primary opacity-40 shrink-0" size={32} />
          </div>
        </div>
      )}

      {/* Dead Stock Header Alert */}
      {kind === "deadstock" && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-sm flex items-start gap-3">
          <AlertTriangle className="text-warning shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-semibold text-warning-foreground">Dead Stock Alert</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              The following {deadStockItems.length} items have recorded zero sales in the last 30 days. Consider promotions or discounts.
            </p>
          </div>
        </div>
      )}

      {/* Chart Panel (only for sales and consumption) */}
      {(kind === "daily" || kind === "monthly" || kind === "consumption") && (
        <Panel title={kind === "consumption" ? `Sales Quantities: ${activeItemName}` : "Sales Trends"}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" fontSize={11} />
                <YAxis
                  fontSize={11}
                  tickFormatter={(v) => (kind === "consumption" ? `${v} units` : `₹${v / 1000}k`)}
                />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }}
                  formatter={(v: number) => (kind === "consumption" ? `${v} units` : fmtINR(v))}
                />
                <Bar dataKey="value" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}

      {/* Main Details Panel */}
      <Panel
        title={
          kind === "daily"
            ? "Daily Sales Breakdown"
            : kind === "monthly"
              ? "Monthly Sales Breakdown"
              : kind === "stock"
                ? "Active Stock Level List"
                : kind === "valuation"
                  ? "Stock Valuation Details"
                  : kind === "deadstock"
                    ? "Dead Stock List (No Sales 30d)"
                    : `Excise compliance stock register (${new Date(from).toLocaleDateString("en-IN")} to ${new Date(to).toLocaleDateString("en-IN")})`
        }
      >
        <div className="overflow-x-auto">
          {kind === "daily" && (
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Date</th>
                  <th className="text-right px-3 py-2">Bills Count</th>
                  <th className="text-right px-3 py-2">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((d) => (
                  <tr key={d.date} className="border-t">
                    <td className="px-3 py-2">{new Date(d.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                    <td className="px-3 py-2 text-right">{d.count}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmtINR(d.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {kind === "monthly" && (
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Month</th>
                  <th className="text-right px-3 py-2">Bills Count</th>
                  <th className="text-right px-3 py-2">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.month} className="border-t">
                    <td className="px-3 py-2">{m.month}</td>
                    <td className="px-3 py-2 text-right">{m.count}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmtINR(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {kind === "stock" && (
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-right px-3 py-2 font-semibold">Stock</th>
                  <th className="text-right px-3 py-2 text-muted-foreground">Reorder</th>
                  <th className="text-left px-3 py-2 w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((i) => (
                  <tr key={i.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{i.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{i.category}</td>
                    <td className="px-3 py-2 text-right font-bold">{i.stock}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{i.reorder}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={inventoryStatus(i)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {kind === "valuation" && (
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item Name</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-right px-3 py-2 w-32">Current Stock</th>
                  <th className="text-right px-3 py-2 w-32">Cost Price (₹)</th>
                  <th className="text-right px-3 py-2 w-32 font-bold">Stock Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {stockValuation.items.map((row) => (
                  <tr key={row.item.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{row.item.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.item.category}</td>
                    <td className="px-3 py-2 text-right font-semibold">{row.item.stock}</td>
                    <td className="px-3 py-2 text-right">{fmtINR(row.cost)}</td>
                    <td className="px-3 py-2 text-right font-bold">{fmtINR(row.val)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-black font-bold bg-muted/30">
                  <td colSpan={2} className="px-3 py-3">Total Inventory Valuation</td>
                  <td colSpan={3} className="px-3 py-3 text-right text-sm text-primary">
                    {fmtINR(stockValuation.totalVal)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {kind === "deadstock" && (
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item Name</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-left px-3 py-2">Brand</th>
                  <th className="text-right px-3 py-2 w-32 font-semibold">Stock Qty</th>
                  <th className="text-right px-3 py-2 w-32">Idle Value (₹)</th>
                  <th className="text-left px-3 py-2 w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {deadStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">
                      No dead stock! All items have recorded sales in the last 30 days.
                    </td>
                  </tr>
                ) : (
                  deadStockItems.map((i) => (
                    <tr key={i.id} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium">{i.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{i.category}</td>
                      <td className="px-3 py-2 text-muted-foreground">{i.brand || "—"}</td>
                      <td className="px-3 py-2 text-right font-semibold">{i.stock}</td>
                      <td className="px-3 py-2 text-right font-bold text-destructive">
                        {fmtINR(i.stock * (i.costPrice ?? 0))}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex px-2 py-0.5 rounded-sm border text-[10px] font-bold bg-destructive/15 text-destructive border-destructive/20">
                          Dead (30d+)
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {kind === "excise" && (
            <div className="border border-black rounded-sm p-4 bg-white text-black font-sans leading-relaxed">
              <div className="text-center space-y-1 border-b-2 border-black pb-4 mb-4">
                <h2 className="text-base font-bold uppercase tracking-wider">Excise Stock compliance Register</h2>
                <p className="text-xs">Date Range: {new Date(from).toLocaleDateString("en-IN", { dateStyle: "long" })} to {new Date(to).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
                <p className="text-[10px] text-muted-foreground">The Copper Barrel · Bengaluru Depot</p>
              </div>

              <table className="w-full text-xs border border-collapse border-black">
                <thead>
                  <tr className="bg-muted/50 border-b border-black text-center font-bold">
                    <th className="border border-black px-2 py-1.5 text-left w-1/3">Item Details</th>
                    <th className="border border-black px-2 py-1.5 w-20">Opening</th>
                    <th className="border border-black px-2 py-1.5 w-20">Purchased (+)</th>
                    <th className="border border-black px-2 py-1.5 w-20">Sold (-)</th>
                    <th className="border border-black px-2 py-1.5 w-20">Wastage (-)</th>
                    <th className="border border-black px-2 py-1.5 w-20">Closing (=)</th>
                  </tr>
                </thead>
                <tbody>
                  {exciseRegister.map((row) => (
                    <tr key={row.item.id} className="align-middle text-center">
                      <td className="border border-black px-2 py-1 text-left font-medium">
                        <div>{row.item.name}</div>
                        <div className="text-[9px] text-muted-foreground font-normal">
                          Category: {row.item.category} {row.item.batchNumber && `· Batch: ${row.item.batchNumber}`}
                        </div>
                      </td>
                      <td className="border border-black px-2 py-1">{row.opening}</td>
                      <td className="border border-black px-2 py-1 text-success font-semibold">
                        {row.purchased > 0 ? `+${row.purchased}` : "0"}
                      </td>
                      <td className="border border-black px-2 py-1 text-destructive">
                        {row.sold > 0 ? `-${row.sold}` : "0"}
                      </td>
                      <td className="border border-black px-2 py-1 text-destructive">
                        {row.wastage > 0 ? `-${row.wastage}` : "0"}
                      </td>
                      <td className="border border-black px-2 py-1 font-bold">{row.closing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 flex justify-between text-xs pt-8 border-t border-dashed border-black/30">
                <div className="text-center w-40">
                  <div className="border-b border-black h-8 w-full"></div>
                  <div className="mt-1 font-semibold">Compliance Officer</div>
                </div>
                <div className="text-center w-40">
                  <div className="border-b border-black h-8 w-full"></div>
                  <div className="mt-1 font-semibold">Authorized Signature</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
