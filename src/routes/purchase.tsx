import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useStore, addPurchase, fmtINR } from "@/lib/store";
import { Panel } from "@/components/AdminShell";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/purchase")({
  component: PurchasePage,
});

interface Line {
  itemId: string;
  qty: number;
  cost: number;
}

function PurchasePage() {
  const inventory = useStore((s) => s.inventory);
  const purchases = useStore((s) => s.purchases);
  const vendors = useStore((s) => s.vendors);

  // States
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [invoiceNo, setInvoiceNo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Partial" | "Unpaid">("Paid");
  const [amountDue, setAmountDue] = useState<number>(0);
  const [lines, setLines] = useState<Line[]>([]);

  // Parse query parameters for reorder prefill
  useEffect(() => {
    if (typeof window !== "undefined" && inventory.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const prefillItemId = params.get("itemId");
      const prefillQty = params.get("qty");

      if (prefillItemId) {
        const item = inventory.find((i) => i.id === prefillItemId);
        if (item) {
          const qty = parseInt(prefillQty || "1") || 1;
          const cost = item.costPrice ?? 0;
          setLines([{ itemId: prefillItemId, qty, cost }]);

          // Auto-select matching vendor if possible
          const matchingVendor = vendors.find((v) =>
            v.itemsSupplied.some((brand) => item.name.includes(brand) || item.brand?.includes(brand))
          ) || vendors[0];
          if (matchingVendor) {
            setSupplier(matchingVendor.name);
          }
          return;
        }
      }
    }
    
    // Default fallback
    if (lines.length === 0 && inventory.length > 0) {
      setLines([{ itemId: inventory[0].id, qty: 1, cost: inventory[0].costPrice ?? 0 }]);
    }
  }, [inventory, vendors]);

  const total = lines.reduce((s, l) => s + l.qty * l.cost, 0);

  // Keep amountDue synchronized when total or paymentStatus changes
  useEffect(() => {
    if (paymentStatus === "Paid") {
      setAmountDue(0);
    } else if (paymentStatus === "Unpaid") {
      setAmountDue(total);
    } else if (amountDue > total) {
      setAmountDue(total);
    }
  }, [total, paymentStatus]);

  const addRow = () => {
    const firstItem = inventory[0];
    setLines([...lines, { itemId: firstItem?.id ?? "", qty: 1, cost: firstItem?.costPrice ?? 0 }]);
  };

  const remove = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  
  const update = (i: number, patch: Partial<Line>) => {
    setLines(lines.map((l, idx) => {
      if (idx !== i) return l;
      
      const updatedLine = { ...l, ...patch };
      
      // Auto-update cost if item changed
      if (patch.itemId) {
        const item = inventory.find((item) => item.id === patch.itemId);
        if (item) {
          updatedLine.cost = item.costPrice ?? 0;
        }
      }
      return updatedLine;
    }));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return toast.error("Please select a supplier");
    if (!invoiceNo.trim()) return toast.error("Invoice number required");
    if (lines.length === 0) return toast.error("Please add at least one line item");

    if (paymentStatus === "Partial" && (amountDue <= 0 || amountDue >= total)) {
      return toast.error("For partial payments, amount due must be between 0 and the total amount");
    }

    addPurchase({ 
      supplier, 
      date: new Date(date).toISOString(), 
      invoiceNo, 
      lines, 
      total,
      paymentStatus,
      amountDue
    });

    toast.success("Purchase entry logged and stocks incremented");
    
    // Clear forms
    setSupplier("");
    setInvoiceNo("");
    setPaymentStatus("Paid");
    setAmountDue(0);
    setLines([{ itemId: inventory[0]?.id ?? "", qty: 1, cost: inventory[0]?.costPrice ?? 0 }]);
    
    // Clear window search query if we redirected here
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <Panel title="New Purchase Entry / Stock In">
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Supplier / Vendor</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="inp h-9"
                required
              >
                <option value="" disabled>Select Supplier</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Purchase Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="inp h-9" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Invoice No.</label>
              <input 
                value={invoiceNo} 
                onChange={(e) => setInvoiceNo(e.target.value)} 
                className="inp h-9" 
                placeholder="e.g. INV-2026-981" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="inp h-9"
              >
                <option value="Paid">Paid (Full)</option>
                <option value="Partial">Partial Payment</option>
                <option value="Unpaid">Unpaid (On Credit)</option>
              </select>
            </div>
          </div>

          {paymentStatus === "Partial" && (
            <div className="max-w-xs bg-muted/40 p-3 border rounded-sm">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Outstanding Amount Due (₹)</label>
              <input
                type="number"
                min="1"
                max={total - 1}
                value={amountDue}
                onChange={(e) => setAmountDue(Number(e.target.value))}
                className="inp h-9"
                required
              />
              <span className="text-[10px] text-muted-foreground block mt-1">
                Total Invoice: {fmtINR(total)}. Amount paid: {fmtINR(total - amountDue)}.
              </span>
            </div>
          )}

          <div className="border border-border rounded-sm overflow-x-auto">
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-right px-3 py-2 w-28">Quantity</th>
                  <th className="text-right px-3 py-2 w-32">Cost / Unit (₹)</th>
                  <th className="text-right px-3 py-2 w-32">Subtotal</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">
                      <select
                        value={l.itemId}
                        onChange={(e) => update(i, { itemId: e.target.value })}
                        className="inp py-1"
                      >
                        {inventory.map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name} ({inv.unit})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        value={l.qty}
                        onChange={(e) => update(i, { qty: Number(e.target.value) })}
                        className="inp text-right py-1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={l.cost}
                        onChange={(e) => update(i, { cost: Number(e.target.value) })}
                        className="inp text-right py-1"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium">{fmtINR(l.qty * l.cost)}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded-sm cursor-pointer"
                        disabled={lines.length <= 1}
                        style={{ opacity: lines.length <= 1 ? 0.3 : 1 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/40 font-bold">
                  <td colSpan={3} className="px-3 py-2 text-right">
                    Total
                  </td>
                  <td className="px-3 py-2 text-right text-sm">{fmtINR(total)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addRow}
              className="text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Line Item
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm hover:opacity-90 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Save size={12} /> Save Purchase Log
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Recent Purchases History">
        <div className="overflow-x-auto border border-border rounded-sm">
          <table className="admin-table text-xs">
            <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Supplier / Vendor</th>
                <th className="text-left px-3 py-2">Invoice No</th>
                <th className="text-right px-3 py-2">Items Count</th>
                <th className="text-right px-3 py-2">Total Value</th>
                <th className="text-left px-3 py-2">Payment Status</th>
                <th className="text-right px-3 py-2">Amount Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => {
                const status = p.paymentStatus ?? "Paid";
                const isPaid = status === "Paid";
                const isUnpaid = status === "Unpaid";

                return (
                  <tr key={p.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2 text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN")}</td>
                    <td className="px-3 py-2 font-medium">{p.supplier}</td>
                    <td className="px-3 py-2 font-mono">{p.invoiceNo}</td>
                    <td className="px-3 py-2 text-right">{p.lines.length}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmtINR(p.total)}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold border ${
                        isPaid
                          ? "bg-success/15 text-success border-success/20"
                          : isUnpaid
                            ? "bg-destructive/15 text-destructive border-destructive/20"
                            : "bg-warning/20 text-warning-foreground border-warning/30"
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className={`px-3 py-2 text-right font-semibold ${p.amountDue && p.amountDue > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {p.amountDue ? fmtINR(p.amountDue) : "₹0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
