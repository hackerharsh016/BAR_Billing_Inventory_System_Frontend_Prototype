import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setState, fmtINR, updateTable, type PaymentMode } from "@/lib/store";
import { Panel } from "@/components/AdminShell";
import { Printer, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/billing/$id")({
  component: InvoiceView,
});

function InvoiceView() {
  const { id } = Route.useParams();
  const bill = useStore((s) => s.bills.find((b) => b.id === id));
  const settings = useStore((s) => s.settings);
  const [payment, setPayment] = useState<PaymentMode>(bill?.payment ?? "Cash");
  const [cashReceived, setCashReceived] = useState<string>("");
  const received = parseFloat(cashReceived) || 0;
  const billAmt = bill?.total ?? 0;
  const changeDue = received - billAmt;

  if (!bill) return <div className="p-8 text-center text-muted-foreground">Invoice not found</div>;

  const finalize = () => {
    if (payment === "Cash" && received < billAmt) {
      toast.error("Cash received is less than the bill amount");
      return;
    }
    const cashFields = payment === "Cash"
      ? { cashReceived: received, cashReturned: Math.max(0, changeDue) }
      : { cashReceived: undefined, cashReturned: undefined };
    setState((s) => ({
      ...s,
      bills: s.bills.map((b) => (b.id === bill.id ? { ...b, status: "Paid", payment, ...cashFields } : b)),
      tables: s.tables.map((t) => (t.number === bill.tableNo ? { ...t, order: [], status: "Free" } : t)),
    }));
    toast.success("Bill finalized & table released");
    setTimeout(() => window.print(), 200);
  };

  return (
    <>
      {/* Screen View (Hidden when printing) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 print:hidden">
        <Panel
          title={`Invoice ${bill.number}`}
          className="lg:col-span-2"
          actions={
            <Link to="/billing" className="text-xs text-primary hover:underline">
              &larr; Back
            </Link>
          }
        >
          <div className="border border-border p-6 bg-white text-black text-sm">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-lg font-bold">{settings.venueName}</h2>
                <p className="text-xs">{settings.address}</p>
                <p className="text-xs">Phone: {settings.phone}</p>
                <p className="text-xs">GSTIN: {settings.gstNumber}</p>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-base">TAX INVOICE</div>
                <div>Bill No: <span className="font-semibold">{bill.number}</span></div>
                <div>Table: {bill.tableNo}</div>
                <div>{new Date(bill.time).toLocaleString("en-IN")}</div>
              </div>
            </div>
            <table className="w-full mt-4 text-xs">
              <thead>
                <tr className="border-b border-black/20">
                  <th className="text-left py-1.5">#</th>
                  <th className="text-left py-1.5">Item</th>
                  <th className="text-center py-1.5">Qty</th>
                  <th className="text-right py-1.5">Rate</th>
                  <th className="text-right py-1.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((l, i) => (
                  <tr key={i} className="border-b border-dashed border-black/10">
                    <td className="py-1.5">{i + 1}</td>
                    <td className="py-1.5">{l.name}</td>
                    <td className="py-1.5 text-center">{l.qty}</td>
                    <td className="py-1.5 text-right">{fmtINR(l.rate)}</td>
                    <td className="py-1.5 text-right">{fmtINR(l.qty * l.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <div className="w-56 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{fmtINR(bill.subtotal)}</span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>- {fmtINR(bill.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({settings.gstRate}%)</span>
                  <span>{fmtINR(bill.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-black/40 pt-1 mt-1">
                  <span>Grand Total</span>
                  <span>{fmtINR(bill.total)}</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] mt-6 text-black/60">Thank you for your visit!</p>
          </div>
        </Panel>

        <Panel title="Payment & Actions">
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium mb-2">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Cash", "Card", "UPI"] as PaymentMode[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPayment(p)}
                    className={`py-2 text-xs rounded-sm border ${
                      payment === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border hover:bg-accent"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {payment === "Cash" && (
              <div className="border border-border rounded-sm bg-muted/40 p-3 space-y-2">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wide">Cash Exchange</div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">Bill Amount</label>
                  <input
                    type="text"
                    value={fmtINR(billAmt)}
                    readOnly
                    className="w-full px-2 py-1.5 text-xs bg-background border border-border rounded-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">Total Cash Received</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-xs bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {[100, 500, 1000, 2000].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCashReceived(String(received + d))}
                      className="text-[10px] px-2 py-1 bg-background border border-border rounded-sm hover:bg-accent"
                    >
                      +{d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCashReceived(String(billAmt))}
                    className="text-[10px] px-2 py-1 bg-background border border-border rounded-sm hover:bg-accent"
                  >
                    Exact
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashReceived("")}
                    className="text-[10px] px-2 py-1 bg-background border border-border rounded-sm hover:bg-accent"
                  >
                    Clear
                  </button>
                </div>
                <div className={`flex justify-between text-xs pt-2 border-t border-border ${
                  received === 0 ? "text-muted-foreground" : changeDue < 0 ? "text-destructive" : "text-success"
                }`}>
                  <span className="font-medium">
                    {changeDue < 0 ? "Balance Due" : "Return Amount"}
                  </span>
                  <span className="font-bold">{fmtINR(Math.abs(changeDue))}</span>
                </div>
              </div>
            )}
            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold">{bill.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Due</span>
                <span className="font-bold">{fmtINR(bill.total)}</span>
              </div>
              {bill.status === "Paid" && bill.payment === "Cash" && bill.cashReceived !== undefined && (
                <div className="mt-2 p-2 bg-muted/40 border border-border rounded-sm text-xs space-y-1">
                  <div className="font-semibold uppercase tracking-wide text-[10px] text-muted-foreground">Cash Exchange</div>
                  <div className="flex justify-between">
                    <span>Cash Received</span>
                    <span className="font-semibold">{fmtINR(bill.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returned</span>
                    <span className="font-semibold">{fmtINR(bill.cashReturned ?? 0)}</span>
                  </div>
                </div>
              )}
            </div>
            {bill.status === "Pending" ? (
              <button
                onClick={finalize}
                className="w-full bg-success text-success-foreground py-2 rounded-sm text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={14} /> Finalize & Print
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Printer size={14} /> Print Receipt
              </button>
            )}
          </div>
        </Panel>
      </div>

      {/* Print-only layout (Strictly styled for thermal roll printers) */}
      <div className="hidden print:block w-full max-w-[76mm] mx-auto p-4 text-black bg-white font-mono text-[11px] leading-tight">
        {/* Header */}
        <div className="text-center space-y-1 mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider">{settings.venueName}</h2>
          <p className="text-[10px]">{settings.address}</p>
          <p className="text-[10px]">Phone: {settings.phone}</p>
          {settings.gstNumber && <p className="text-[10px]">GSTIN: {settings.gstNumber}</p>}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-black my-2"></div>

        {/* Bill Info */}
        <div className="space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span>Bill No: <strong className="font-bold">{bill.number}</strong></span>
            <span>Table: <strong>{bill.tableNo}</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Date: {new Date(bill.time).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "medium" })}</span>
            <span>Status: {bill.status}</span>
          </div>
          {bill.status === "Paid" && (
            <div className="flex justify-between">
              <span>Payment: {bill.payment}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-black my-2"></div>

        {/* Items Table */}
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-black pb-1">
              <th className="text-left font-bold py-0.5 w-[50%]">Item</th>
              <th className="text-center font-bold py-0.5 w-[15%]">Qty</th>
              <th className="text-right font-bold py-0.5 w-[35%]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index} className="align-top border-b border-dashed border-black/10">
                <td className="py-1">
                  <div>{item.name}</div>
                  <div className="text-[9px] text-black/70">@{fmtINR(item.rate)}</div>
                </td>
                <td className="py-1 text-center font-semibold">{item.qty}</td>
                <td className="py-1 text-right font-semibold">{fmtINR(item.qty * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Divider */}
        <div className="border-t border-dashed border-black my-2"></div>

        {/* Totals */}
        <div className="space-y-1 text-[10px] font-semibold">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{fmtINR(bill.subtotal)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-black/80">
              <span>Discount</span>
              <span>- {fmtINR(bill.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>GST ({settings.gstRate}%)</span>
            <span>{fmtINR(bill.tax)}</span>
          </div>
          
          <div className="border-t border-black my-1"></div>
          
          <div className="flex justify-between text-xs font-bold pt-0.5">
            <span>GRAND TOTAL</span>
            <span>{fmtINR(bill.total)}</span>
          </div>

          {bill.payment === "Cash" && bill.cashReceived !== undefined && (
            <>
              <div className="flex justify-between text-[9px] pt-1 font-normal">
                <span>Cash Received</span>
                <span>{fmtINR(bill.cashReceived)}</span>
              </div>
              <div className="flex justify-between text-[9px] font-normal">
                <span>Change Returned</span>
                <span>{fmtINR(bill.cashReturned ?? 0)}</span>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-black my-3"></div>

        {/* Footer Message */}
        <div className="text-center space-y-1">
          <p className="text-[10px] font-bold text-center">THANK YOU FOR YOUR VISIT!</p>
          <p className="text-[8px] text-black/60 text-center">Software by Copper Barrel v1.0</p>
        </div>
      </div>
    </>
  );
}

// suppress unused warning
void updateTable;
