import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, updateSettings, addTable, deleteTable, updateTable, fmtINR } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Printer, Plus, Pencil, Trash2, Check, X, Utensils } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const [general, setGeneral] = useState({
    venueName: settings.venueName,
    address: settings.address,
    phone: settings.phone,
    gstNumber: settings.gstNumber,
  });
  const [tax, setTax] = useState({ gstRate: settings.gstRate, taxInclusive: settings.taxInclusive });
  const [printer, setPrinter] = useState(settings.printer);

  const tables = useStore((s) => s.tables);
  const [singleNumber, setSingleNumber] = useState("");
  const [batchStart, setBatchStart] = useState("");
  const [batchCount, setBatchCount] = useState("5");
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingTableNum, setEditingTableNum] = useState<string>("");

  const saveGeneral = () => {
    updateSettings(general);
    toast.success("General settings saved");
  };
  const saveTax = () => {
    updateSettings(tax);
    toast.success("Tax settings saved");
  };
  const savePrinter = () => {
    updateSettings({ printer });
    toast.success("Printer settings saved");
  };

  const maxTableNum = tables.length > 0 ? Math.max(...tables.map((t) => t.number)) : 0;
  const suggestedStart = maxTableNum + 1;

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(singleNumber);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid table number");
      return;
    }
    try {
      addTable(num);
      toast.success(`Table ${num} added successfully`);
      setSingleNumber("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add table");
    }
  };

  const handleBatchGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const startVal = batchStart.trim() === "" ? suggestedStart : parseInt(batchStart);
    const count = parseInt(batchCount);
    if (isNaN(startVal) || startVal <= 0) {
      toast.error("Please enter a valid starting table number");
      return;
    }
    if (isNaN(count) || count <= 0 || count > 50) {
      toast.error("Please enter a count between 1 and 50");
      return;
    }

    let addedCount = 0;
    const skipped: number[] = [];
    for (let i = 0; i < count; i++) {
      const tableNum = startVal + i;
      try {
        addTable(tableNum);
        addedCount++;
      } catch (err) {
        skipped.push(tableNum);
      }
    }

    if (addedCount > 0) {
      toast.success(`Generated ${addedCount} tables`);
      setBatchStart("");
    }
    if (skipped.length > 0) {
      toast.error(`Skipped tables (already exist): ${skipped.join(", ")}`);
    }
  };

  const handleStartEdit = (id: string, num: number) => {
    setEditingTableId(id);
    setEditingTableNum(String(num));
  };

  const handleSaveEdit = (id: string) => {
    const num = parseInt(editingTableNum);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid table number");
      return;
    }
    try {
      updateTable(id, { number: num });
      toast.success(`Table number updated to ${num}`);
      setEditingTableId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update table");
    }
  };

  const handleCancelEdit = () => {
    setEditingTableId(null);
    setEditingTableNum("");
  };

  const handleDeleteTable = (id: string, number: number) => {
    if (confirm(`Are you sure you want to delete Table ${number}?`)) {
      try {
        deleteTable(id);
        toast.success(`Table ${number} deleted`);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete table");
      }
    }
  };

  return (
    <Panel title="Settings">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="printer">Printer</TabsTrigger>
          <TabsTrigger value="tables">Tables Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 max-w-2xl space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Venue Name</label>
            <input value={general.venueName} onChange={(e) => setGeneral({ ...general, venueName: e.target.value })} className="inp" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address</label>
            <textarea value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} className="inp" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Phone</label>
              <input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className="inp" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">GST Number</label>
              <input value={general.gstNumber} onChange={(e) => setGeneral({ ...general, gstNumber: e.target.value })} className="inp" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Logo</label>
            <input type="file" accept="image/*" className="text-xs" />
          </div>
          <button onClick={saveGeneral} className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm flex items-center gap-1">
            <Save size={12} /> Save Changes
          </button>
        </TabsContent>

        <TabsContent value="tax" className="mt-4 max-w-2xl space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">GST Rate (%)</label>
            <input
              type="number"
              value={tax.gstRate}
              onChange={(e) => setTax({ ...tax, gstRate: Number(e.target.value) })}
              className="inp w-32"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={tax.taxInclusive}
              onChange={(e) => setTax({ ...tax, taxInclusive: e.target.checked })}
            />
            Tax-inclusive pricing
          </label>
          <button onClick={saveTax} className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm flex items-center gap-1">
            <Save size={12} /> Save Changes
          </button>
        </TabsContent>

        <TabsContent value="printer" className="mt-4 max-w-2xl space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Printer Device</label>
            <select value={printer} onChange={(e) => setPrinter(e.target.value)} className="inp">
              <option>Epson TM-T82 (USB)</option>
              <option>TVS RP-3160 Star (USB)</option>
              <option>Bixolon SRP-330 (Network)</option>
              <option>Generic / Text Only</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Connected</span>
          </div>
          <div className="flex gap-2">
            <button onClick={savePrinter} className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm flex items-center gap-1">
              <Save size={12} /> Save Changes
            </button>
            <button
              onClick={() => toast.success("Test page sent to printer (prototype)")}
              className="border border-border text-xs px-4 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1"
            >
              <Printer size={12} /> Test Print
            </button>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side: List of Tables */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold">Active Tables ({tables.length})</h3>
                  <p className="text-xs text-muted-foreground">List of tables in service and their status</p>
                </div>
              </div>
              
              <div className="overflow-x-auto border border-border rounded-sm">
                <table className="admin-table">
                  <thead className="bg-muted text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2 w-1/3">Table Number</th>
                      <th className="text-left px-3 py-2">Status</th>
                      <th className="text-left px-3 py-2">Active Order</th>
                      <th className="text-right px-3 py-2 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((t) => {
                      const isEditing = editingTableId === t.id;
                      const orderTotal = t.order.reduce((sum, item) => sum + (item.qty * item.rate), 0);
                      const orderText = t.order.length > 0 
                        ? `${t.order.length} items (${fmtINR(orderTotal)})` 
                        : "None";

                      return (
                        <tr key={t.id} className="border-t hover:bg-muted/40">
                          <td className="px-3 py-2 font-medium">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingTableNum}
                                onChange={(e) => setEditingTableNum(e.target.value)}
                                className="inp py-1 text-xs w-24"
                                autoFocus
                              />
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <Utensils size={12} className="text-muted-foreground" />
                                Table {t.number}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {orderText}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveEdit(t.id)}
                                  className="p-1 hover:bg-success/20 text-success rounded-sm"
                                  title="Save"
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 hover:bg-destructive/20 text-destructive rounded-sm"
                                  title="Cancel"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleStartEdit(t.id, t.number)}
                                  className="p-1 hover:bg-muted rounded-sm text-info"
                                  title="Edit number"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTable(t.id, t.number)}
                                  className="p-1 hover:bg-muted rounded-sm text-destructive"
                                  title="Delete Table"
                                  disabled={t.status !== "Free"}
                                  style={{ opacity: t.status !== "Free" ? 0.4 : 1 }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right side: Add Options */}
            <div className="space-y-4">
              {/* Add Single Table */}
              <div className="border border-border rounded-sm p-4 bg-card space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Single Table</h4>
                  <p className="text-[11px] text-muted-foreground">Add a new table manually</p>
                </div>
                <form onSubmit={handleAddTable} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Table Number</label>
                    <input
                      type="number"
                      value={singleNumber}
                      onChange={(e) => setSingleNumber(e.target.value)}
                      placeholder="e.g. 11"
                      className="inp"
                      min="1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground text-xs py-1.5 rounded-sm flex items-center justify-center gap-1 hover:bg-primary/95"
                  >
                    <Plus size={12} /> Add Table
                  </button>
                </form>
              </div>

              {/* Batch Add Tables */}
              <div className="border border-border rounded-sm p-4 bg-card space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Generator</h4>
                  <p className="text-[11px] text-muted-foreground">Batch create multiple tables at once</p>
                </div>
                <form onSubmit={handleBatchGenerate} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Start Number</label>
                      <input
                        type="number"
                        value={batchStart}
                        onChange={(e) => setBatchStart(e.target.value)}
                        placeholder={String(suggestedStart)}
                        className="inp"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Total Tables</label>
                      <input
                        type="number"
                        value={batchCount}
                        onChange={(e) => setBatchCount(e.target.value)}
                        placeholder="5"
                        className="inp"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full border border-border text-xs py-1.5 rounded-sm hover:bg-muted flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Generate Tables
                  </button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Panel>
  );
}
