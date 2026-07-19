import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, addStaff, updateStaff, deleteStaff, type Role } from "@/lib/store";
import { Panel, StatusBadge } from "@/components/AdminShell";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/staff")({
  component: StaffPage,
});

const ROLES: Role[] = ["Owner", "Manager", "Captain", "Bartender", "Cashier"];

function StaffPage() {
  const staff = useStore((s) => s.staff);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", username: "", role: "Captain" as Role, password: "", active: true });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", username: "", role: "Captain", password: "", active: true });
    setOpen(true);
  };
  const openEdit = (id: string) => {
    const s = staff.find((x) => x.id === id);
    if (!s) return;
    setEditing(id);
    setForm({ name: s.name, username: s.username, role: s.role, password: "", active: s.active });
    setOpen(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim()) return toast.error("Name & username required");
    if (editing) {
      updateStaff(editing, { name: form.name, username: form.username, role: form.role, active: form.active });
      toast.success("Staff updated");
    } else {
      addStaff({
        name: form.name,
        username: form.username,
        role: form.role,
        active: form.active,
        lastLogin: new Date().toISOString(),
      });
      toast.success("Staff added");
    }
    setOpen(false);
  };

  const roleColor: Record<Role, string> = {
    Owner: "bg-primary/15 text-primary border-primary/30",
    Manager: "bg-info/15 text-info border-info/30",
    Captain: "bg-warning/20 text-warning-foreground border-warning/40",
    Bartender: "bg-chart-5/15 text-chart-5 border-chart-5/30",
    Cashier: "bg-success/15 text-success border-success/30",
  };

  return (
    <Panel
      title="Staff / Users"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              onClick={openAdd}
              className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1"
            >
              <Plus size={12} /> Add Staff
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Add"} Staff</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium mb-1">Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="inp" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Username</label>
                  <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="inp" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="inp">
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="inp"
                    placeholder={editing ? "Leave blank to keep" : ""}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select value={form.active ? "1" : "0"} onChange={(e) => setForm({ ...form, active: e.target.value === "1" })} className="inp">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
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
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Username</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Last Login</th>
              <th className="text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-2 font-medium">{s.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{s.username}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[11px] font-medium ${roleColor[s.role]}`}>
                    {s.role}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={s.active ? "Active" : "Inactive"} />
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {new Date(s.lastLogin).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => openEdit(s.id)} className="p-1 hover:bg-muted rounded-sm text-info">
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => {
                      deleteStaff(s.id);
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
    </Panel>
  );
}
