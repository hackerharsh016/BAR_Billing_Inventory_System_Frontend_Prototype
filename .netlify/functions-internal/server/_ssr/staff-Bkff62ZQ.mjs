import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { g as Pencil, h as Plus, s as Trash2 } from "../_libs/lucide-react.mjs";
import { D as updateStaff, g as deleteStaff, k as useStore, l as addStaff, n as Panel, r as StatusBadge } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-C4FWn-g5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-Bkff62ZQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"Owner",
	"Manager",
	"Captain",
	"Bartender",
	"Cashier"
];
function StaffPage() {
	const staff = useStore((s) => s.staff);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		username: "",
		role: "Captain",
		password: "",
		active: true
	});
	const openAdd = () => {
		setEditing(null);
		setForm({
			name: "",
			username: "",
			role: "Captain",
			password: "",
			active: true
		});
		setOpen(true);
	};
	const openEdit = (id) => {
		const s = staff.find((x) => x.id === id);
		if (!s) return;
		setEditing(id);
		setForm({
			name: s.name,
			username: s.username,
			role: s.role,
			password: "",
			active: s.active
		});
		setOpen(true);
	};
	const submit = (e) => {
		e.preventDefault();
		if (!form.name.trim() || !form.username.trim()) return toast.error("Name & username required");
		if (editing) {
			updateStaff(editing, {
				name: form.name,
				username: form.username,
				role: form.role,
				active: form.active
			});
			toast.success("Staff updated");
		} else {
			addStaff({
				name: form.name,
				username: form.username,
				role: form.role,
				active: form.active,
				lastLogin: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast.success("Staff added");
		}
		setOpen(false);
	};
	const roleColor = {
		Owner: "bg-primary/15 text-primary border-primary/30",
		Manager: "bg-info/15 text-info border-info/30",
		Captain: "bg-warning/20 text-warning-foreground border-warning/40",
		Bartender: "bg-chart-5/15 text-chart-5 border-chart-5/30",
		Cashier: "bg-success/15 text-success border-success/30"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Staff / Users",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: openAdd,
					className: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Add Staff"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editing ? "Edit" : "Add", " Staff"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium mb-1",
						children: "Full Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						}),
						className: "inp",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium mb-1",
								children: "Username"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.username,
								onChange: (e) => setForm({
									...form,
									username: e.target.value
								}),
								className: "inp",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium mb-1",
								children: "Role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: form.role,
								onChange: (e) => setForm({
									...form,
									role: e.target.value
								}),
								className: "inp",
								children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium mb-1",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: form.password,
								onChange: (e) => setForm({
									...form,
									password: e.target.value
								}),
								className: "inp",
								placeholder: editing ? "Leave blank to keep" : ""
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium mb-1",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.active ? "1" : "0",
								onChange: (e) => setForm({
									...form,
									active: e.target.value === "1"
								}),
								className: "inp",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1",
									children: "Active"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "0",
									children: "Inactive"
								})]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOpen(false),
						className: "px-3 py-1.5 text-xs border border-border rounded-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm",
						children: "Save"
					})] })
				]
			})] })]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "admin-table",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Username"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Last Login"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-3 py-2",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-medium",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-muted-foreground",
							children: s.username
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex px-2 py-0.5 rounded-sm border text-[11px] font-medium ${roleColor[s.role]}`,
								children: s.role
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.active ? "Active" : "Inactive" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: new Date(s.lastLogin).toLocaleString("en-IN", {
								dateStyle: "short",
								timeStyle: "short"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openEdit(s.id),
								className: "p-1 hover:bg-muted rounded-sm text-info",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 13 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									deleteStaff(s.id);
									toast.success("Deleted");
								},
								className: "p-1 hover:bg-muted rounded-sm text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
							})]
						})
					]
				}, s.id)) })]
			})
		})
	});
}
//#endregion
export { StaffPage as component };
