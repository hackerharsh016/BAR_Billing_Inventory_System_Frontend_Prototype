import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, addOrderLine, setOrderQty, clearOrder, addBill, updateTable, fmtINR } from "@/lib/store";
import { Panel } from "@/components/AdminShell";
import { Plus, Minus, Search, Trash2, Save, Printer, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/order/$tableId")({
  component: OrderEntry,
});

function OrderEntry() {
  const { tableId } = Route.useParams();
  const nav = useNavigate();
  const tables = useStore((s) => s.tables);
  const menu = useStore((s) => s.menu);
  const categories = useStore((s) => s.categories);
  const settings = useStore((s) => s.settings);
  const table = tables.find((t) => t.id === tableId);
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [discount, setDiscount] = useState(0);

  const filtered = useMemo(
    () =>
      menu
        .filter((m) => m.active)
        .filter((m) => cat === "All" || m.category === cat)
        .filter((m) => m.name.toLowerCase().includes(q.toLowerCase())),
    [menu, cat, q],
  );

  if (!table) return <div className="p-8 text-center text-muted-foreground">Table not found</div>;

  const subtotal = table.order.reduce((s, l) => s + l.qty * l.rate, 0);
  const tax = Math.round((subtotal - discount) * (settings.gstRate / 100));
  const total = subtotal - discount + tax;

  const saveKOT = () => {
    if (table.order.length === 0) return toast.error("Add items first");
    updateTable(table.id, { status: "Occupied" });
    toast.success("KOT saved & sent to kitchen");
  };

  const printBill = () => {
    if (table.order.length === 0) return toast.error("Add items first");
    updateTable(table.id, { status: "Bill Printed" });
    const bill = {
      id: `b${Date.now()}`,
      number: `INV-${1000 + Math.floor(Math.random() * 9000)}`,
      tableNo: table.number,
      items: table.order,
      subtotal,
      tax,
      discount,
      total,
      payment: "Cash" as const,
      status: "Pending" as const,
      time: new Date().toISOString(),
    };
    addBill(bill);
    toast.success("Bill created");
    nav({ to: "/billing/$id", params: { id: bill.id } });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Panel
        title={`Menu — Table ${table.number}`}
        className="lg:col-span-3"
        actions={
          <Link to="/tables" className="text-xs text-primary hover:underline">
            &larr; Back to Tables
          </Link>
        }
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1 text-xs rounded-sm border ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search items..."
            className="pl-8 pr-3 py-1.5 border border-border rounded-sm text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="admin-table">
            <thead className="bg-muted text-xs uppercase text-muted-foreground sticky top-0">
              <tr>
                <th className="text-left px-3 py-2">Item</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-right px-3 py-2">Price</th>
                <th className="text-right px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">{m.name}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{m.category}</td>
                  <td className="px-3 py-2 text-right">{fmtINR(m.price)}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() =>
                        addOrderLine(table.id, { itemId: m.id, name: m.name, qty: 1, rate: m.price })
                      }
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-sm text-xs hover:bg-primary/90 inline-flex items-center gap-1"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground text-sm">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`Current Order — Table ${table.number}`} className="lg:col-span-2">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-2 py-2">Item</th>
                <th className="text-center px-2 py-2 w-24">Qty</th>
                <th className="text-right px-2 py-2">Rate</th>
                <th className="text-right px-2 py-2">Amt</th>
                <th className="w-6"></th>
              </tr>
            </thead>
            <tbody>
              {table.order.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground text-sm">
                    No items in order.
                  </td>
                </tr>
              )}
              {table.order.map((l) => (
                <tr key={l.itemId} className="border-t">
                  <td className="px-2 py-2">{l.name}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setOrderQty(table.id, l.itemId, l.qty - 1)}
                        className="border border-border w-6 h-6 rounded-sm hover:bg-muted flex items-center justify-center"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button
                        onClick={() => setOrderQty(table.id, l.itemId, l.qty + 1)}
                        className="border border-border w-6 h-6 rounded-sm hover:bg-muted flex items-center justify-center"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right">{fmtINR(l.rate)}</td>
                  <td className="px-2 py-2 text-right font-medium">{fmtINR(l.qty * l.rate)}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => setOrderQty(table.id, l.itemId, 0)}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2 text-sm border-t pt-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{fmtINR(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Discount (₹)</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="w-24 text-right border border-border rounded-sm px-2 py-0.5 text-sm"
            />
          </div>
          <div className="flex justify-between">
            <span>GST ({settings.gstRate}%)</span>
            <span>{fmtINR(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Grand Total</span>
            <span>{fmtINR(total)}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={saveKOT}
            className="bg-info text-info-foreground text-xs py-2 rounded-sm hover:opacity-90 flex items-center justify-center gap-1"
          >
            <Save size={12} /> Save KOT
          </button>
          <button
            onClick={printBill}
            className="bg-primary text-primary-foreground text-xs py-2 rounded-sm hover:opacity-90 flex items-center justify-center gap-1"
          >
            <Printer size={12} /> Print Bill
          </button>
          <button
            onClick={() => {
              clearOrder(table.id);
              toast.success("Order cancelled");
              nav({ to: "/tables" });
            }}
            className="bg-destructive text-destructive-foreground text-xs py-2 rounded-sm hover:opacity-90 flex items-center justify-center gap-1"
          >
            <X size={12} /> Cancel
          </button>
        </div>
      </Panel>
    </div>
  );
}
