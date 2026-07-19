import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, addMenuItem, updateMenuItem, deleteMenuItem, fmtINR } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
});

function MenuPage() {
  const menu = useStore((s) => s.menu);
  const categories = useStore((s) => s.categories);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "Beer", price: 0, description: "", active: true });

  const filtered = useMemo(
    () => menu.filter((m) => cat === "All" || m.category === cat).filter((m) => m.name.toLowerCase().includes(q.toLowerCase())),
    [menu, cat, q],
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "Beer", price: 0, description: "", active: true });
    setOpen(true);
  };
  const openEdit = (id: string) => {
    const m = menu.find((x) => x.id === id);
    if (!m) return;
    setEditing(id);
    setForm({ name: m.name, category: m.category, price: m.price, description: m.description ?? "", active: m.active });
    setOpen(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name required");
    if (editing) {
      updateMenuItem(editing, form);
      toast.success("Item updated");
    } else {
      addMenuItem(form);
      toast.success("Item added");
    }
    setOpen(false);
  };

  return (
    <Panel
      title="Menu / Item Master"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              onClick={openAdd}
              className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1"
            >
              <Plus size={12} /> Add Item
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="inp" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="inp">
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="inp"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="inp"
                  rows={2}
                />
              </div>
              <DialogFooter>
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs border border-border rounded-sm">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm">
                  Save
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search items..."
            className="pl-8 pr-3 py-1.5 border border-border rounded-sm text-sm w-full"
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-border rounded-sm px-3 py-1.5 text-sm">
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Category</th>
              <th className="text-right px-3 py-2">Price</th>
              <th className="text-left px-3 py-2">Active</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-2 font-medium">{m.name}</td>
                <td className="px-3 py-2">{m.category}</td>
                <td className="px-3 py-2 text-right">{fmtINR(m.price)}</td>
                <td className="px-3 py-2">
                  <Switch checked={m.active} onCheckedChange={(v) => updateMenuItem(m.id, { active: v })} />
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={m.active ? "Active" : "Inactive"} />
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => openEdit(m.id)} className="p-1 hover:bg-muted rounded-sm text-info">
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => {
                      deleteMenuItem(m.id);
                      toast.success("Deleted");
                    }}
                    className="p-1 hover:bg-muted rounded-sm text-destructive"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filtered.length} of {menu.length} items</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 border border-border rounded-sm">&laquo;</button>
          <button className="px-2 py-1 border border-primary bg-primary text-primary-foreground rounded-sm">1</button>
          <button className="px-2 py-1 border border-border rounded-sm">&raquo;</button>
        </div>
      </div>
    </Panel>
  );
}
