import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  useStore,
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  inventoryStatus,
  logWastage,
  addVendor,
  saveStockAudit,
  fmtINR,
  type InventoryItem,
  type WastageReason,
  type Role,
} from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  AlertTriangle, 
  ClipboardCheck, 
  Users, 
  ShieldAlert, 
  History, 
  Calendar,
  Layers,
  Save
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const inventory = useStore((s) => s.inventory);
  const wastage = useStore((s) => s.wastage);
  const vendors = useStore((s) => s.vendors);
  const auditHistory = useStore((s) => s.auditHistory);

  // Tab State
  const [activeTab, setActiveTab] = useState("master");

  // Stock Master Filters
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dialog State (Stock Master Add/Edit)
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Beer",
    brand: "",
    unit: "Bottle",
    stock: 0,
    reorder: 0,
    unitType: "bottle" as any,
    conversion: "",
    pegSizes: [] as string[],
    batchNumber: "",
    expiryDate: "",
    costPrice: 0,
    sellingPrice: 0,
  });

  // Wastage Log Form State
  const [wastageOpen, setWastageOpen] = useState(false);
  const [wastageForm, setWastageForm] = useState({
    itemId: "",
    qty: 0,
    reason: "Breakage" as WastageReason,
    recordedBy: "",
    notes: "",
  });

  // Vendor Form State
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: "",
    contact: "",
    itemsSupplied: "",
  });

  // Audit Form State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditorName, setAuditorName] = useState("");
  const [auditCounts, setAuditCounts] = useState<Record<string, string>>({});

  // Dynamic filter values
  const cats = Array.from(new Set(inventory.map((i) => i.category)));
  const brands = Array.from(new Set(inventory.map((i) => i.brand).filter(Boolean)));

  // Filtered Stock Master List
  const filteredMaster = useMemo(() => {
    return inventory.filter((i) => {
      if (cat !== "All" && i.category !== cat) return false;
      if (brandFilter !== "All" && i.brand !== brandFilter) return false;
      if (q && !i.name.toLowerCase().includes(q.toLowerCase()) && !i.brand.toLowerCase().includes(q.toLowerCase())) return false;
      
      if (statusFilter !== "All") {
        const status = inventoryStatus(i);
        
        // Expiry calculation helper
        const isNearExpiry = i.expiryDate && (() => {
          const diff = new Date(i.expiryDate).getTime() - new Date().getTime();
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 30;
        })();

        if (statusFilter === "In Stock" && status !== "In Stock") return false;
        if (statusFilter === "Low Stock" && status !== "Low Stock") return false;
        if (statusFilter === "Out of Stock" && status !== "Out of Stock") return false;
        if (statusFilter === "Near Expiry" && !isNearExpiry) return false;
      }
      return true;
    });
  }, [inventory, cat, brandFilter, q, statusFilter]);

  // Wastage Summary Card (Calculated this month, cost basis)
  const monthlyWastageCost = useMemo(() => {
    const now = new Date();
    const currentMonthEntries = wastage.filter((w) => {
      const d = new Date(w.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return currentMonthEntries.reduce((sum, w) => {
      const item = inventory.find((i) => i.id === w.itemId);
      const cost = item?.costPrice ?? 0;
      return sum + cost * w.qty;
    }, 0);
  }, [wastage, inventory]);

  // Items Expiring in < 30 days
  const nearExpiryItems = useMemo(() => {
    return inventory
      .filter((i) => {
        if (!i.expiryDate) return false;
        const diff = new Date(i.expiryDate).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      })
      .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());
  }, [inventory]);

  // Reorder Suggestions List
  const reorderSuggestions = useMemo(() => {
    return inventory.filter((i) => i.stock < i.reorder);
  }, [inventory]);

  // Form Submissions (Stock Master Add/Edit)
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      category: "Beer",
      brand: "",
      unit: "Bottle",
      stock: 0,
      reorder: 0,
      unitType: "bottle",
      conversion: "",
      pegSizes: [],
      batchNumber: "",
      expiryDate: "",
      costPrice: 0,
      sellingPrice: 0,
    });
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const i = inventory.find((x) => x.id === id);
    if (!i) return;
    setEditing(id);
    setForm({
      name: i.name,
      category: i.category,
      brand: i.brand ?? "",
      unit: i.unit,
      stock: i.stock,
      reorder: i.reorder,
      unitType: i.unitType ?? "bottle",
      conversion: i.conversion ?? "",
      pegSizes: i.pegSizes ?? [],
      batchNumber: i.batchNumber ?? "",
      expiryDate: i.expiryDate ?? "",
      costPrice: i.costPrice ?? 0,
      sellingPrice: i.sellingPrice ?? 0,
    });
    setOpen(true);
  };

  const submitMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name required");
    if (editing) {
      updateInventoryItem(editing, form);
      toast.success("Stock item updated");
    } else {
      addInventoryItem(form);
      toast.success("Stock item added");
    }
    setOpen(false);
  };

  // Log Wastage Submission
  const submitWastage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageForm.itemId) return toast.error("Please select an item");
    if (wastageForm.qty <= 0) return toast.error("Quantity must be greater than zero");
    if (!wastageForm.recordedBy.trim()) return toast.error("Recorded by required");

    logWastage({
      itemId: wastageForm.itemId,
      qty: wastageForm.qty,
      reason: wastageForm.reason,
      recordedBy: wastageForm.recordedBy,
      notes: wastageForm.notes,
      date: new Date().toISOString(),
    });

    toast.success("Wastage logged & stock deducted");
    setWastageForm({ itemId: "", qty: 0, reason: "Breakage", recordedBy: "", notes: "" });
    setWastageOpen(false);
  };

  // Add Vendor Submission
  const submitVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.name.trim()) return toast.error("Vendor name required");
    
    addVendor({
      name: vendorForm.name,
      contact: vendorForm.contact,
      itemsSupplied: vendorForm.itemsSupplied.split(",").map((s) => s.trim()).filter(Boolean),
    });

    toast.success("Vendor added successfully");
    setVendorForm({ name: "", contact: "", itemsSupplied: "" });
    setVendorOpen(false);
  };

  // Start Audit flow
  const startAudit = () => {
    const initialCounts: Record<string, string> = {};
    inventory.forEach((item) => {
      initialCounts[item.id] = "";
    });
    setAuditCounts(initialCounts);
    setAuditorName("");
    setIsAuditing(true);
  };

  // Save Audit flow
  const submitAudit = () => {
    if (!auditorName.trim()) return toast.error("Auditor name required");
    
    // Parse counts
    const parsedCounts: Record<string, number> = {};
    let hasCount = false;
    Object.entries(auditCounts).forEach(([id, val]) => {
      if (val !== "") {
        parsedCounts[id] = Number(val);
        hasCount = true;
      }
    });

    if (!hasCount) {
      toast.error("Please enter at least one counted quantity");
      return;
    }

    saveStockAudit(auditorName, parsedCounts);
    toast.success("Audit saved and stock updated");
    setIsAuditing(false);
  };

  // Peg size checkbox helper
  const togglePegSize = (size: string) => {
    const current = form.pegSizes;
    if (current.includes(size)) {
      setForm({ ...form, pegSizes: current.filter((s) => s !== size) });
    } else {
      setForm({ ...form, pegSizes: [...current, size] });
    }
  };

  const isLiquor = ["Beer", "Whisky", "Wine", "Cocktails"].includes(form.category);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between border-b pb-1 gap-2">
        <TabsList className="bg-transparent border-none p-0 flex gap-1 h-auto flex-wrap">
          <TabsTrigger value="master" className="sub-tab-btn">Stock Master</TabsTrigger>
          <TabsTrigger value="wastage" className="sub-tab-btn">Wastage Log</TabsTrigger>
          <TabsTrigger value="audit" className="sub-tab-btn">Stock Audit</TabsTrigger>
          <TabsTrigger value="vendors" className="sub-tab-btn">Vendors</TabsTrigger>
          <TabsTrigger value="reorder" className="sub-tab-btn">
            Reorder suggestions
            {reorderSuggestions.length > 0 && (
              <span className="ml-1 bg-destructive text-destructive-foreground text-[9px] px-1 py-0.2 rounded-full font-bold">
                {reorderSuggestions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="expiry" className="sub-tab-btn">
            Near Expiry
            {nearExpiryItems.length > 0 && (
              <span className="ml-1 bg-warning text-warning-foreground text-[9px] px-1 py-0.2 rounded-full font-bold">
                {nearExpiryItems.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      {/* 1. STOCK MASTER TAB */}
      <TabsContent value="master" className="space-y-4">
        <Panel
          title="Stock Master"
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={openAdd}
                  className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Stock Item
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit" : "Add"} Stock Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitMaster} className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name">
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="inp"
                        required
                      />
                    </Field>
                    <Field label="Brand">
                      <input
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="inp"
                        placeholder="e.g. Johnnie Walker"
                      />
                    </Field>
                    <Field label="Category">
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="inp"
                      >
                        {["Beer", "Whisky", "Wine", "Cocktails", "Food", "Mixers"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Unit Description">
                      <input
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="inp"
                        placeholder="e.g. Bottle 750ml, Can"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t pt-3">
                    <Field label="Stock Count">
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        className="inp"
                        min="0"
                      />
                    </Field>
                    <Field label="Reorder Level">
                      <input
                        type="number"
                        value={form.reorder}
                        onChange={(e) => setForm({ ...form, reorder: Number(e.target.value) })}
                        className="inp"
                        min="0"
                      />
                    </Field>
                    <Field label="Unit Type">
                      <select
                        value={form.unitType}
                        onChange={(e) => setForm({ ...form, unitType: e.target.value as any })}
                        className="inp"
                      >
                        {["bottle", "case", "ml", "kg", "piece"].map((ut) => (
                          <option key={ut} value={ut}>{ut}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t pt-3">
                    <Field label="Unit Conversion Description">
                      <input
                        value={form.conversion}
                        onChange={(e) => setForm({ ...form, conversion: e.target.value })}
                        className="inp"
                        placeholder="e.g. 1 case = 12 bottles"
                      />
                    </Field>
                    <Field label="Batch Number">
                      <input
                        value={form.batchNumber}
                        onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                        className="inp"
                        placeholder="e.g. B-ST55A"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t pt-3">
                    <Field label="Cost Price (₹)">
                      <input
                        type="number"
                        value={form.costPrice}
                        onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                        className="inp"
                        min="0"
                      />
                    </Field>
                    <Field label="Selling Price (₹)">
                      <input
                        type="number"
                        value={form.sellingPrice}
                        onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                        className="inp"
                        min="0"
                      />
                    </Field>
                    <Field label="Expiry Date">
                      <input
                        type="date"
                        value={form.expiryDate}
                        onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                        className="inp"
                      />
                    </Field>
                  </div>

                  {isLiquor && (
                    <div className="border-t pt-3 space-y-2">
                      <label className="block text-xs font-semibold text-muted-foreground">Peg Sizes (Liquor only)</label>
                      <div className="flex gap-4">
                        {["30ml", "60ml", "90ml"].map((size) => (
                          <label key={size} className="flex items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              checked={form.pegSizes.includes(size)}
                              onChange={() => togglePegSize(size)}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <DialogFooter className="border-t pt-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 text-xs border border-border rounded-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        >
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 bg-muted/30 p-2 border border-border rounded-sm">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Search</label>
              <div className="relative">
                <Search size={12} className="absolute left-2 top-2.5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Name, brand..."
                  className="pl-7 pr-2 py-1 text-xs border border-border bg-card rounded-sm w-full focus:outline-none focus:ring-1 focus:ring-primary h-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Category</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="inp py-1 h-8 text-xs bg-card"
              >
                <option value="All">All Categories</option>
                {cats.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Brand</label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="inp py-1 h-8 text-xs bg-card"
              >
                <option value="All">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="inp py-1 h-8 text-xs bg-card"
              >
                <option value="All">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Near Expiry">Near Expiry</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item Name</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-left px-3 py-2">Brand</th>
                  <th className="text-left px-3 py-2">Unit Type</th>
                  <th className="text-right px-3 py-2">Cost (₹)</th>
                  <th className="text-right px-3 py-2">Sell (₹)</th>
                  <th className="text-right px-3 py-2">Stock</th>
                  <th className="text-right px-3 py-2">Reorder</th>
                  <th className="text-left px-3 py-2">Expiry Date</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-right px-3 py-2 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaster.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-6 text-muted-foreground">
                      No stock items match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMaster.map((i) => (
                    <tr key={i.id} className="border-t hover:bg-muted/40 align-middle">
                      <td className="px-3 py-2 font-medium">
                        <div>{i.name}</div>
                        {i.batchNumber && (
                          <div className="text-[9px] text-muted-foreground font-normal">
                            Batch: {i.batchNumber} {i.conversion && `· ${i.conversion}`}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{i.category}</td>
                      <td className="px-3 py-2 text-muted-foreground">{i.brand || "—"}</td>
                      <td className="px-3 py-2 capitalize">{i.unitType || i.unit}</td>
                      <td className="px-3 py-2 text-right">{i.costPrice ? fmtINR(i.costPrice) : "—"}</td>
                      <td className="px-3 py-2 text-right">{i.sellingPrice ? fmtINR(i.sellingPrice) : "—"}</td>
                      <td className="px-3 py-2 text-right font-semibold">{i.stock}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{i.reorder}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {i.expiryDate ? new Date(i.expiryDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={inventoryStatus(i)} />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => openEdit(i.id)} className="p-1 hover:bg-muted rounded-sm text-info cursor-pointer">
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${i.name}?`)) {
                                deleteInventoryItem(i.id);
                                toast.success("Stock item deleted");
                              }
                            }}
                            className="p-1 hover:bg-muted rounded-sm text-destructive cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filteredMaster.length} of {inventory.length} items</span>
          </div>
        </Panel>
      </TabsContent>

      {/* 2. WASTAGE / BREAKAGE LOG TAB */}
      <TabsContent value="wastage" className="space-y-4">
        {/* Wastage Month Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-destructive/10 border border-destructive/20 p-4 rounded-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-destructive/80 tracking-wider">Total Wastage This Month</div>
              <div className="text-xl font-bold mt-1 text-destructive">{fmtINR(monthlyWastageCost)}</div>
            </div>
            <ShieldAlert className="text-destructive opacity-40 shrink-0" size={32} />
          </div>
        </div>

        <Panel
          title="Wastage & Breakage Log"
          actions={
            <Dialog open={wastageOpen} onOpenChange={setWastageOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setWastageForm({ itemId: inventory[0]?.id ?? "", qty: 1, reason: "Breakage", recordedBy: "Rajesh Kumar", notes: "" })}
                  className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Log Wastage
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Wastage / Breakage Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitWastage} className="space-y-3 text-sm">
                  <Field label="Inventory Item">
                    <select
                      value={wastageForm.itemId}
                      onChange={(e) => setWastageForm({ ...wastageForm, itemId: e.target.value })}
                      className="inp"
                      required
                    >
                      <option value="" disabled>Select Item</option>
                      {inventory.map((i) => (
                        <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                      ))}
                    </select>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Quantity to Deduct">
                      <input
                        type="number"
                        value={wastageForm.qty}
                        onChange={(e) => setWastageForm({ ...wastageForm, qty: Number(e.target.value) })}
                        className="inp"
                        min="1"
                        required
                      />
                    </Field>
                    <Field label="Wastage Reason">
                      <select
                        value={wastageForm.reason}
                        onChange={(e) => setWastageForm({ ...wastageForm, reason: e.target.value as WastageReason })}
                        className="inp"
                      >
                        {["Breakage", "Spillage", "Expired", "Staff Consumption", "Complimentary", "Other"].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Recorded By">
                    <input
                      value={wastageForm.recordedBy}
                      onChange={(e) => setWastageForm({ ...wastageForm, recordedBy: e.target.value })}
                      className="inp"
                      placeholder="e.g. Rajesh Kumar"
                      required
                    />
                  </Field>
                  <Field label="Audit Notes / Explanation">
                    <textarea
                      value={wastageForm.notes}
                      onChange={(e) => setWastageForm({ ...wastageForm, notes: e.target.value })}
                      className="inp"
                      rows={2}
                      placeholder="Explain how the wastage/breakage occurred..."
                    />
                  </Field>
                  <DialogFooter className="border-t pt-3">
                    <button
                      type="button"
                      onClick={() => setWastageOpen(false)}
                      className="px-3 py-1.5 text-xs border border-border rounded-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded-sm cursor-pointer"
                    >
                      Save Wastage
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        >
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Date</th>
                  <th className="text-left px-3 py-2">Item Name</th>
                  <th className="text-right px-3 py-2 w-20">Qty</th>
                  <th className="text-left px-3 py-2">Reason</th>
                  <th className="text-left px-3 py-2">Recorded By</th>
                  <th className="text-left px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {wastage.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">
                      No wastage logged yet.
                    </td>
                  </tr>
                ) : (
                  wastage.map((w) => (
                    <tr key={w.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2 text-muted-foreground">
                        {new Date(w.date).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-3 py-2 font-medium">{w.itemName}</td>
                      <td className="px-3 py-2 text-right font-semibold">{w.qty}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex px-1.5 py-0.5 rounded-sm text-[10px] font-semibold border ${
                          w.reason === "Breakage" || w.reason === "Spillage"
                            ? "bg-destructive/15 text-destructive border-destructive/20"
                            : w.reason === "Expired"
                              ? "bg-warning/20 text-warning-foreground border-warning/30"
                              : "bg-muted text-muted-foreground border-border"
                        }`}>
                          {w.reason}
                        </span>
                      </td>
                      <td className="px-3 py-2">{w.recordedBy}</td>
                      <td className="px-3 py-2 text-muted-foreground max-w-xs truncate" title={w.notes}>
                        {w.notes || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </TabsContent>

      {/* 3. STOCK AUDIT / RECONCILIATION TAB */}
      <TabsContent value="audit" className="space-y-4">
        {isAuditing ? (
          <Panel
            title="Perform Inventory Audit / Reconciliation"
            actions={
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAuditing(false)}
                  className="border border-border text-xs px-3 py-1.5 rounded-sm hover:bg-muted cursor-pointer"
                >
                  Cancel Audit
                </button>
                <button
                  onClick={submitAudit}
                  className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:opacity-90 flex items-center gap-1 cursor-pointer"
                >
                  <Save size={12} /> Save Audit
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="max-w-md">
                <label className="block text-xs font-semibold mb-1">Auditor/Conducted By</label>
                <input
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="inp h-9"
                  required
                />
              </div>

              <div className="overflow-x-auto border border-border rounded-sm">
                <table className="admin-table text-xs">
                  <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2 w-1/3">Item Name</th>
                      <th className="text-left px-3 py-2">Category</th>
                      <th className="text-right px-3 py-2">System Stock</th>
                      <th className="text-center px-3 py-2 w-32">Counted Stock</th>
                      <th className="text-right px-3 py-2">Variance</th>
                      <th className="text-right px-3 py-2">Cost Impact (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const counted = auditCounts[item.id];
                      const system = item.stock;
                      const variance = counted !== "" ? Number(counted) - system : null;
                      const costImpact = variance !== null ? variance * (item.costPrice ?? 0) : null;

                      let varianceColor = "";
                      if (variance === 0) varianceColor = "text-success font-semibold";
                      else if (variance !== null && Math.abs(variance) <= 5) varianceColor = "text-warning font-semibold";
                      else if (variance !== null) varianceColor = "text-destructive font-semibold";

                      return (
                        <tr key={item.id} className="border-t">
                          <td className="px-3 py-2 font-medium">
                            <div>{item.name}</div>
                            <div className="text-[9px] text-muted-foreground font-normal">{item.unit}</div>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{item.category}</td>
                          <td className="px-3 py-2 text-right font-semibold">{system}</td>
                          <td className="px-3 py-1 text-center">
                            <input
                              type="number"
                              min="0"
                              placeholder="Counted..."
                              value={counted}
                              onChange={(e) => setAuditCounts({ ...auditCounts, [item.id]: e.target.value })}
                              className="inp py-1 text-xs text-center max-w-[100px] mx-auto"
                            />
                          </td>
                          <td className={`px-3 py-2 text-right ${varianceColor}`}>
                            {variance !== null ? (variance > 0 ? `+${variance}` : variance) : "—"}
                          </td>
                          <td className={`px-3 py-2 text-right ${varianceColor}`}>
                            {costImpact !== null ? (costImpact > 0 ? `+${fmtINR(costImpact)}` : `-${fmtINR(Math.abs(costImpact))}`) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel
            title="Stock Audit & Reconciliation"
            actions={
              <button
                onClick={startAudit}
                className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer"
              >
                <ClipboardCheck size={12} /> Start New Audit
              </button>
            }
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Audit History</h3>
                <p className="text-xs text-muted-foreground">Reconciliation records of stock discrepancies</p>
              </div>

              <div className="overflow-x-auto border border-border rounded-sm">
                <table className="admin-table text-xs">
                  <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Conducted By</th>
                      <th className="text-right px-3 py-2">Total Items Audited</th>
                      <th className="text-right px-3 py-2">Total Cost Discrepancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-muted-foreground">
                          No stock audits performed yet.
                        </td>
                      </tr>
                    ) : (
                      auditHistory.map((au) => {
                        const discrepancyVal = au.totalVarianceValue;
                        const varianceClass = discrepancyVal < 0 ? "text-destructive font-semibold" : discrepancyVal > 0 ? "text-success font-semibold" : "text-muted-foreground";

                        return (
                          <tr key={au.id} className="border-t hover:bg-muted/40">
                            <td className="px-3 py-2 text-muted-foreground">
                              {new Date(au.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                            </td>
                            <td className="px-3 py-2 font-medium">{au.conductedBy}</td>
                            <td className="px-3 py-2 text-right">{au.totalItemsAudited}</td>
                            <td className={`px-3 py-2 text-right ${varianceClass}`}>
                              {discrepancyVal === 0 
                                ? "No Variance" 
                                : discrepancyVal < 0 
                                  ? `-${fmtINR(Math.abs(discrepancyVal))}` 
                                  : `+${fmtINR(discrepancyVal)}`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        )}
      </TabsContent>

      {/* 4. VENDORS TAB */}
      <TabsContent value="vendors" className="space-y-4">
        <Panel
          title="Vendor Registry"
          actions={
            <Dialog open={vendorOpen} onOpenChange={setVendorOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setVendorForm({ name: "", contact: "", itemsSupplied: "" })}
                  className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Vendor
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitVendor} className="space-y-3 text-sm">
                  <Field label="Vendor Name">
                    <input
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                      className="inp"
                      placeholder="e.g. Diageo Brands India"
                      required
                    />
                  </Field>
                  <Field label="Contact Info">
                    <input
                      value={vendorForm.contact}
                      onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })}
                      className="inp"
                      placeholder="e.g. Anil (9876543210)"
                    />
                  </Field>
                  <Field label="Items Supplied (comma-separated)">
                    <input
                      value={vendorForm.itemsSupplied}
                      onChange={(e) => setVendorForm({ ...vendorForm, itemsSupplied: e.target.value })}
                      className="inp"
                      placeholder="e.g. Johnnie Walker, Smirnoff, Gin"
                    />
                  </Field>
                  <DialogFooter className="border-t pt-3">
                    <button
                      type="button"
                      onClick={() => setVendorOpen(false)}
                      className="px-3 py-1.5 text-xs border border-border rounded-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm cursor-pointer"
                    >
                      Save Vendor
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        >
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2 w-1/4">Vendor Name</th>
                  <th className="text-left px-3 py-2">Contact Details</th>
                  <th className="text-left px-3 py-2">Supplied Items</th>
                  <th className="text-right px-3 py-2">Amount Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      No vendors added yet.
                    </td>
                  </tr>
                ) : (
                  vendors.map((v) => (
                    <tr key={v.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2 font-medium">{v.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v.contact || "—"}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {v.itemsSupplied.map((item, idx) => (
                            <span key={idx} className="bg-muted px-1.5 py-0.5 rounded-sm border text-[9px] font-semibold text-muted-foreground">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-destructive">
                        {fmtINR(v.amountOutstanding)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </TabsContent>

      {/* 5. REORDER SUGGESTIONS TAB */}
      <TabsContent value="reorder" className="space-y-4">
        <Panel title="Reorder Suggestions & Low Stock Items">
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Items currently below minimum stock levels. Suggestions are calculated to bring stock back to 2x reorder level.
            </p>
          </div>
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item Name</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-right px-3 py-2">System Stock</th>
                  <th className="text-right px-3 py-2">Reorder Level</th>
                  <th className="text-right px-3 py-2">Suggested Purchase Qty</th>
                  <th className="text-left px-3 py-2">Last Vendor</th>
                  <th className="text-right px-3 py-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody>
                {reorderSuggestions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-muted-foreground">
                      All inventory stocks are healthy. No reorders needed!
                    </td>
                  </tr>
                ) : (
                  reorderSuggestions.map((item) => {
                    const suggestedQty = item.reorder * 2 - item.stock;
                    
                    // Match a vendor to items supplied
                    const matchingVendor = vendors.find((v) => 
                      v.itemsSupplied.some((brand) => item.name.includes(brand) || item.brand?.includes(brand))
                    ) || vendors[0];

                    return (
                      <tr key={item.id} className="border-t hover:bg-muted/40">
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.category}</td>
                        <td className="px-3 py-2 text-right font-bold text-destructive">{item.stock}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{item.reorder}</td>
                        <td className="px-3 py-2 text-right font-semibold text-success">+{suggestedQty}</td>
                        <td className="px-3 py-2 text-muted-foreground">{matchingVendor?.name || "KSBCL"}</td>
                        <td className="px-3 py-2 text-right">
                          <a
                            href={`/purchase?itemId=${item.id}&qty=${suggestedQty}`}
                            className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] px-2.5 py-1.5 rounded-sm hover:opacity-90 font-semibold"
                          >
                            <Plus size={10} /> Create PO
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </TabsContent>

      {/* 6. EXPIRY TRACKING TAB */}
      <TabsContent value="expiry" className="space-y-4">
        <Panel title="Expiry Date Tracking">
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Stock items with expiry dates within the next 30 days. Expired stock should be logged under Wastage.
            </p>
          </div>
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="admin-table text-xs">
              <thead className="bg-muted text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Item Name</th>
                  <th className="text-left px-3 py-2">Batch No</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-right px-3 py-2 font-semibold">Stock Qty</th>
                  <th className="text-left px-3 py-2">Expiry Date</th>
                  <th className="text-left px-3 py-2">Days Remaining</th>
                  <th className="text-left px-3 py-2 w-28">Status Badge</th>
                </tr>
              </thead>
              <tbody>
                {nearExpiryItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-muted-foreground">
                      No items expiring in the next 30 days.
                    </td>
                  </tr>
                ) : (
                  nearExpiryItems.map((item) => {
                    const diffTime = new Date(item.expiryDate!).getTime() - new Date().getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    let badgeClass = "";
                    let label = "";

                    if (diffDays <= 0) {
                      badgeClass = "bg-destructive/15 text-destructive border-destructive/20";
                      label = "Expired";
                    } else if (diffDays <= 7) {
                      badgeClass = "bg-warning/20 text-warning-foreground border-warning/30";
                      label = `${diffDays} days left`;
                    } else {
                      badgeClass = "bg-info/15 text-info border-info/30";
                      label = `${diffDays} days left`;
                    }

                    return (
                      <tr key={item.id} className="border-t hover:bg-muted/40">
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-3 py-2 text-muted-foreground font-mono">{item.batchNumber || "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.category}</td>
                        <td className="px-3 py-2 text-right font-semibold">{item.stock}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {new Date(item.expiryDate!).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </td>
                        <td className="px-3 py-2 font-semibold">
                          {diffDays <= 0 ? (
                            <span className="text-destructive font-bold">Expired</span>
                          ) : (
                            <span>{diffDays} days</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[10px] font-bold ${badgeClass}`}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </TabsContent>
    </Tabs>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}
