import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { E as ClipboardCheck, c as ShieldAlert, d as Save, g as Pencil, h as Plus, s as Trash2, u as Search } from "../_libs/lucide-react.mjs";
import { a as addInventoryItem, b as logWastage, d as addVendor, k as useStore, m as deleteInventoryItem, n as Panel, r as StatusBadge, v as fmtINR, w as updateInventoryItem, x as saveStockAudit, y as inventoryStatus } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-C4FWn-g5.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Fv8PDfKy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-Cy0XHbMT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const inventory = useStore((s) => s.inventory);
	const wastage = useStore((s) => s.wastage);
	const vendors = useStore((s) => s.vendors);
	const auditHistory = useStore((s) => s.auditHistory);
	const [activeTab, setActiveTab] = (0, import_react.useState)("master");
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const [brandFilter, setBrandFilter] = (0, import_react.useState)("All");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
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
		sellingPrice: 0
	});
	const [wastageOpen, setWastageOpen] = (0, import_react.useState)(false);
	const [wastageForm, setWastageForm] = (0, import_react.useState)({
		itemId: "",
		qty: 0,
		reason: "Breakage",
		recordedBy: "",
		notes: ""
	});
	const [vendorOpen, setVendorOpen] = (0, import_react.useState)(false);
	const [vendorForm, setVendorForm] = (0, import_react.useState)({
		name: "",
		contact: "",
		itemsSupplied: ""
	});
	const [isAuditing, setIsAuditing] = (0, import_react.useState)(false);
	const [auditorName, setAuditorName] = (0, import_react.useState)("");
	const [auditCounts, setAuditCounts] = (0, import_react.useState)({});
	const cats = Array.from(new Set(inventory.map((i) => i.category)));
	const brands = Array.from(new Set(inventory.map((i) => i.brand).filter(Boolean)));
	const filteredMaster = (0, import_react.useMemo)(() => {
		return inventory.filter((i) => {
			if (cat !== "All" && i.category !== cat) return false;
			if (brandFilter !== "All" && i.brand !== brandFilter) return false;
			if (q && !i.name.toLowerCase().includes(q.toLowerCase()) && !i.brand.toLowerCase().includes(q.toLowerCase())) return false;
			if (statusFilter !== "All") {
				const status = inventoryStatus(i);
				const isNearExpiry = i.expiryDate && (() => {
					const diff = new Date(i.expiryDate).getTime() - (/* @__PURE__ */ new Date()).getTime();
					const diffDays = Math.ceil(diff / (1e3 * 60 * 60 * 24));
					return diffDays >= 0 && diffDays <= 30;
				})();
				if (statusFilter === "In Stock" && status !== "In Stock") return false;
				if (statusFilter === "Low Stock" && status !== "Low Stock") return false;
				if (statusFilter === "Out of Stock" && status !== "Out of Stock") return false;
				if (statusFilter === "Near Expiry" && !isNearExpiry) return false;
			}
			return true;
		});
	}, [
		inventory,
		cat,
		brandFilter,
		q,
		statusFilter
	]);
	const monthlyWastageCost = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		return wastage.filter((w) => {
			const d = new Date(w.date);
			return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
		}).reduce((sum, w) => {
			return sum + (inventory.find((i) => i.id === w.itemId)?.costPrice ?? 0) * w.qty;
		}, 0);
	}, [wastage, inventory]);
	const nearExpiryItems = (0, import_react.useMemo)(() => {
		return inventory.filter((i) => {
			if (!i.expiryDate) return false;
			const diff = new Date(i.expiryDate).getTime() - (/* @__PURE__ */ new Date()).getTime();
			return Math.ceil(diff / (1e3 * 60 * 60 * 24)) <= 30;
		}).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
	}, [inventory]);
	const reorderSuggestions = (0, import_react.useMemo)(() => {
		return inventory.filter((i) => i.stock < i.reorder);
	}, [inventory]);
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
			sellingPrice: 0
		});
		setOpen(true);
	};
	const openEdit = (id) => {
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
			sellingPrice: i.sellingPrice ?? 0
		});
		setOpen(true);
	};
	const submitMaster = (e) => {
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
	const submitWastage = (e) => {
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
			date: (/* @__PURE__ */ new Date()).toISOString()
		});
		toast.success("Wastage logged & stock deducted");
		setWastageForm({
			itemId: "",
			qty: 0,
			reason: "Breakage",
			recordedBy: "",
			notes: ""
		});
		setWastageOpen(false);
	};
	const submitVendor = (e) => {
		e.preventDefault();
		if (!vendorForm.name.trim()) return toast.error("Vendor name required");
		addVendor({
			name: vendorForm.name,
			contact: vendorForm.contact,
			itemsSupplied: vendorForm.itemsSupplied.split(",").map((s) => s.trim()).filter(Boolean)
		});
		toast.success("Vendor added successfully");
		setVendorForm({
			name: "",
			contact: "",
			itemsSupplied: ""
		});
		setVendorOpen(false);
	};
	const startAudit = () => {
		const initialCounts = {};
		inventory.forEach((item) => {
			initialCounts[item.id] = "";
		});
		setAuditCounts(initialCounts);
		setAuditorName("");
		setIsAuditing(true);
	};
	const submitAudit = () => {
		if (!auditorName.trim()) return toast.error("Auditor name required");
		const parsedCounts = {};
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
	const togglePegSize = (size) => {
		const current = form.pegSizes;
		if (current.includes(size)) setForm({
			...form,
			pegSizes: current.filter((s) => s !== size)
		});
		else setForm({
			...form,
			pegSizes: [...current, size]
		});
	};
	const isLiquor = [
		"Beer",
		"Whisky",
		"Wine",
		"Cocktails"
	].includes(form.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		value: activeTab,
		onValueChange: setActiveTab,
		className: "w-full space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-between border-b pb-1 gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "bg-transparent border-none p-0 flex gap-1 h-auto flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "master",
							className: "sub-tab-btn",
							children: "Stock Master"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "wastage",
							className: "sub-tab-btn",
							children: "Wastage Log"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "audit",
							className: "sub-tab-btn",
							children: "Stock Audit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "vendors",
							className: "sub-tab-btn",
							children: "Vendors"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "reorder",
							className: "sub-tab-btn",
							children: ["Reorder suggestions", reorderSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 bg-destructive text-destructive-foreground text-[9px] px-1 py-0.2 rounded-full font-bold",
								children: reorderSuggestions.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "expiry",
							className: "sub-tab-btn",
							children: ["Near Expiry", nearExpiryItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 bg-warning text-warning-foreground text-[9px] px-1 py-0.2 rounded-full font-bold",
								children: nearExpiryItems.length
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "master",
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Stock Master",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openAdd,
								className: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Add Stock Item"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "max-w-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editing ? "Edit" : "Add", " Stock Item"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: submitMaster,
								className: "space-y-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Name",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: form.name,
													onChange: (e) => setForm({
														...form,
														name: e.target.value
													}),
													className: "inp",
													required: true
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Brand",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: form.brand,
													onChange: (e) => setForm({
														...form,
														brand: e.target.value
													}),
													className: "inp",
													placeholder: "e.g. Johnnie Walker"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Category",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: form.category,
													onChange: (e) => setForm({
														...form,
														category: e.target.value
													}),
													className: "inp",
													children: [
														"Beer",
														"Whisky",
														"Wine",
														"Cocktails",
														"Food",
														"Mixers"
													].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Unit Description",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: form.unit,
													onChange: (e) => setForm({
														...form,
														unit: e.target.value
													}),
													className: "inp",
													placeholder: "e.g. Bottle 750ml, Can"
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-3 border-t pt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Stock Count",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: form.stock,
													onChange: (e) => setForm({
														...form,
														stock: Number(e.target.value)
													}),
													className: "inp",
													min: "0"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Reorder Level",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: form.reorder,
													onChange: (e) => setForm({
														...form,
														reorder: Number(e.target.value)
													}),
													className: "inp",
													min: "0"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Unit Type",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: form.unitType,
													onChange: (e) => setForm({
														...form,
														unitType: e.target.value
													}),
													className: "inp",
													children: [
														"bottle",
														"case",
														"ml",
														"kg",
														"piece"
													].map((ut) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: ut,
														children: ut
													}, ut))
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3 border-t pt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Unit Conversion Description",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: form.conversion,
												onChange: (e) => setForm({
													...form,
													conversion: e.target.value
												}),
												className: "inp",
												placeholder: "e.g. 1 case = 12 bottles"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Batch Number",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: form.batchNumber,
												onChange: (e) => setForm({
													...form,
													batchNumber: e.target.value
												}),
												className: "inp",
												placeholder: "e.g. B-ST55A"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-3 border-t pt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Cost Price (₹)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: form.costPrice,
													onChange: (e) => setForm({
														...form,
														costPrice: Number(e.target.value)
													}),
													className: "inp",
													min: "0"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Selling Price (₹)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: form.sellingPrice,
													onChange: (e) => setForm({
														...form,
														sellingPrice: Number(e.target.value)
													}),
													className: "inp",
													min: "0"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Expiry Date",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													value: form.expiryDate,
													onChange: (e) => setForm({
														...form,
														expiryDate: e.target.value
													}),
													className: "inp"
												})
											})
										]
									}),
									isLiquor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t pt-3 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-muted-foreground",
											children: "Peg Sizes (Liquor only)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-4",
											children: [
												"30ml",
												"60ml",
												"90ml"
											].map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-1.5 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: form.pegSizes.includes(size),
													onChange: () => togglePegSize(size)
												}), size]
											}, size))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
										className: "border-t pt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setOpen(false),
											className: "px-3 py-1.5 text-xs border border-border rounded-sm cursor-pointer",
											children: "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm cursor-pointer",
											children: "Save Changes"
										})]
									})
								]
							})]
						})]
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 bg-muted/30 p-2 border border-border rounded-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] uppercase font-semibold text-muted-foreground mb-1",
									children: "Search"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										size: 12,
										className: "absolute left-2 top-2.5 text-muted-foreground"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: q,
										onChange: (e) => setQ(e.target.value),
										placeholder: "Name, brand...",
										className: "pl-7 pr-2 py-1 text-xs border border-border bg-card rounded-sm w-full focus:outline-none focus:ring-1 focus:ring-primary h-8"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] uppercase font-semibold text-muted-foreground mb-1",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cat,
									onChange: (e) => setCat(e.target.value),
									className: "inp py-1 h-8 text-xs bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All",
										children: "All Categories"
									}), cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] uppercase font-semibold text-muted-foreground mb-1",
									children: "Brand"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: brandFilter,
									onChange: (e) => setBrandFilter(e.target.value),
									className: "inp py-1 h-8 text-xs bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All",
										children: "All Brands"
									}), brands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: b,
										children: b
									}, b))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] uppercase font-semibold text-muted-foreground mb-1",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "inp py-1 h-8 text-xs bg-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "All",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "In Stock",
											children: "In Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Low Stock",
											children: "Low Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Out of Stock",
											children: "Out of Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Near Expiry",
											children: "Near Expiry"
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto border border-border rounded-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "admin-table text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted text-[10px] uppercase text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Item Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Category"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Brand"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Unit Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Cost (₹)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Sell (₹)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Reorder"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Expiry Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2 w-20",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredMaster.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 11,
									className: "text-center py-6 text-muted-foreground",
									children: "No stock items match your filter criteria."
								}) }) : filteredMaster.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t hover:bg-muted/40 align-middle",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: i.name }), i.batchNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[9px] text-muted-foreground font-normal",
												children: [
													"Batch: ",
													i.batchNumber,
													" ",
													i.conversion && `· ${i.conversion}`
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: i.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: i.brand || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 capitalize",
											children: i.unitType || i.unit
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: i.costPrice ? fmtINR(i.costPrice) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: i.sellingPrice ? fmtINR(i.sellingPrice) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right font-semibold",
											children: i.stock
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right text-muted-foreground",
											children: i.reorder
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: i.expiryDate ? new Date(i.expiryDate).toLocaleDateString("en-IN") : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: inventoryStatus(i) })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => openEdit(i.id),
													className: "p-1 hover:bg-muted rounded-sm text-info cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 13 })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														if (confirm(`Delete ${i.name}?`)) {
															deleteInventoryItem(i.id);
															toast.success("Stock item deleted");
														}
													},
													className: "p-1 hover:bg-muted rounded-sm text-destructive cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
												})]
											})
										})
									]
								}, i.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex items-center justify-between text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Showing ",
								filteredMaster.length,
								" of ",
								inventory.length,
								" items"
							] })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "wastage",
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1 bg-destructive/10 border border-destructive/20 p-4 rounded-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase font-bold text-destructive/80 tracking-wider",
							children: "Total Wastage This Month"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold mt-1 text-destructive",
							children: fmtINR(monthlyWastageCost)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
							className: "text-destructive opacity-40 shrink-0",
							size: 32
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Wastage & Breakage Log",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: wastageOpen,
						onOpenChange: setWastageOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setWastageForm({
									itemId: inventory[0]?.id ?? "",
									qty: 1,
									reason: "Breakage",
									recordedBy: "Rajesh Kumar",
									notes: ""
								}),
								className: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Log Wastage"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Log Wastage / Breakage Entry" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submitWastage,
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Inventory Item",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: wastageForm.itemId,
										onChange: (e) => setWastageForm({
											...wastageForm,
											itemId: e.target.value
										}),
										className: "inp",
										required: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											disabled: true,
											children: "Select Item"
										}), inventory.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: i.id,
											children: [
												i.name,
												" (",
												i.unit,
												")"
											]
										}, i.id))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Quantity to Deduct",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: wastageForm.qty,
											onChange: (e) => setWastageForm({
												...wastageForm,
												qty: Number(e.target.value)
											}),
											className: "inp",
											min: "1",
											required: true
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Wastage Reason",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: wastageForm.reason,
											onChange: (e) => setWastageForm({
												...wastageForm,
												reason: e.target.value
											}),
											className: "inp",
											children: [
												"Breakage",
												"Spillage",
												"Expired",
												"Staff Consumption",
												"Complimentary",
												"Other"
											].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: r,
												children: r
											}, r))
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Recorded By",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: wastageForm.recordedBy,
										onChange: (e) => setWastageForm({
											...wastageForm,
											recordedBy: e.target.value
										}),
										className: "inp",
										placeholder: "e.g. Rajesh Kumar",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Audit Notes / Explanation",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: wastageForm.notes,
										onChange: (e) => setWastageForm({
											...wastageForm,
											notes: e.target.value
										}),
										className: "inp",
										rows: 2,
										placeholder: "Explain how the wastage/breakage occurred..."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
									className: "border-t pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWastageOpen(false),
										className: "px-3 py-1.5 text-xs border border-border rounded-sm cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded-sm cursor-pointer",
										children: "Save Wastage"
									})]
								})
							]
						})] })]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-border rounded-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Item Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 w-20",
										children: "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Reason"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Recorded By"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Notes"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: wastage.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "text-center py-6 text-muted-foreground",
								children: "No wastage logged yet."
							}) }) : wastage.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-muted-foreground",
										children: new Date(w.date).toLocaleString("en-IN", {
											dateStyle: "short",
											timeStyle: "short"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-medium",
										children: w.itemName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-semibold",
										children: w.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex px-1.5 py-0.5 rounded-sm text-[10px] font-semibold border ${w.reason === "Breakage" || w.reason === "Spillage" ? "bg-destructive/15 text-destructive border-destructive/20" : w.reason === "Expired" ? "bg-warning/20 text-warning-foreground border-warning/30" : "bg-muted text-muted-foreground border-border"}`,
											children: w.reason
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: w.recordedBy
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-muted-foreground max-w-xs truncate",
										title: w.notes,
										children: w.notes || "—"
									})
								]
							}, w.id)) })]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "audit",
				className: "space-y-4",
				children: isAuditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Perform Inventory Audit / Reconciliation",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsAuditing(false),
							className: "border border-border text-xs px-3 py-1.5 rounded-sm hover:bg-muted cursor-pointer",
							children: "Cancel Audit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: submitAudit,
							className: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:opacity-90 flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 12 }), " Save Audit"]
						})]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold mb-1",
								children: "Auditor/Conducted By"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: auditorName,
								onChange: (e) => setAuditorName(e.target.value),
								placeholder: "e.g. Priya Sharma",
								className: "inp h-9",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto border border-border rounded-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "admin-table text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted text-[10px] uppercase text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2 w-1/3",
											children: "Item Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Category"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "System Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-2 w-32",
											children: "Counted Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Variance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Cost Impact (₹)"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: inventory.map((item) => {
									const counted = auditCounts[item.id];
									const system = item.stock;
									const variance = counted !== "" ? Number(counted) - system : null;
									const costImpact = variance !== null ? variance * (item.costPrice ?? 0) : null;
									let varianceColor = "";
									if (variance === 0) varianceColor = "text-success font-semibold";
									else if (variance !== null && Math.abs(variance) <= 5) varianceColor = "text-warning font-semibold";
									else if (variance !== null) varianceColor = "text-destructive font-semibold";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-2 font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[9px] text-muted-foreground font-normal",
													children: item.unit
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 text-muted-foreground",
												children: item.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 text-right font-semibold",
												children: system
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-1 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													placeholder: "Counted...",
													value: counted,
													onChange: (e) => setAuditCounts({
														...auditCounts,
														[item.id]: e.target.value
													}),
													className: "inp py-1 text-xs text-center max-w-[100px] mx-auto"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: `px-3 py-2 text-right ${varianceColor}`,
												children: variance !== null ? variance > 0 ? `+${variance}` : variance : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: `px-3 py-2 text-right ${varianceColor}`,
												children: costImpact !== null ? costImpact > 0 ? `+${fmtINR(costImpact)}` : `-${fmtINR(Math.abs(costImpact))}` : "—"
											})
										]
									}, item.id);
								}) })]
							})
						})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Stock Audit & Reconciliation",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: startAudit,
						className: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { size: 12 }), " Start New Audit"]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Audit History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Reconciliation records of stock discrepancies"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto border border-border rounded-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "admin-table text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted text-[10px] uppercase text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Conducted By"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Total Items Audited"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2",
											children: "Total Cost Discrepancy"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: auditHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 4,
									className: "text-center py-6 text-muted-foreground",
									children: "No stock audits performed yet."
								}) }) : auditHistory.map((au) => {
									const discrepancyVal = au.totalVarianceValue;
									const varianceClass = discrepancyVal < 0 ? "text-destructive font-semibold" : discrepancyVal > 0 ? "text-success font-semibold" : "text-muted-foreground";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t hover:bg-muted/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 text-muted-foreground",
												children: new Date(au.date).toLocaleDateString("en-IN", { dateStyle: "medium" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 font-medium",
												children: au.conductedBy
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 text-right",
												children: au.totalItemsAudited
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: `px-3 py-2 text-right ${varianceClass}`,
												children: discrepancyVal === 0 ? "No Variance" : discrepancyVal < 0 ? `-${fmtINR(Math.abs(discrepancyVal))}` : `+${fmtINR(discrepancyVal)}`
											})
										]
									}, au.id);
								}) })]
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "vendors",
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Vendor Registry",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: vendorOpen,
						onOpenChange: setVendorOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setVendorForm({
									name: "",
									contact: "",
									itemsSupplied: ""
								}),
								className: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 flex items-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Add Vendor"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add New Vendor" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submitVendor,
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Vendor Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: vendorForm.name,
										onChange: (e) => setVendorForm({
											...vendorForm,
											name: e.target.value
										}),
										className: "inp",
										placeholder: "e.g. Diageo Brands India",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Contact Info",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: vendorForm.contact,
										onChange: (e) => setVendorForm({
											...vendorForm,
											contact: e.target.value
										}),
										className: "inp",
										placeholder: "e.g. Anil (9876543210)"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Items Supplied (comma-separated)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: vendorForm.itemsSupplied,
										onChange: (e) => setVendorForm({
											...vendorForm,
											itemsSupplied: e.target.value
										}),
										className: "inp",
										placeholder: "e.g. Johnnie Walker, Smirnoff, Gin"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
									className: "border-t pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVendorOpen(false),
										className: "px-3 py-1.5 text-xs border border-border rounded-sm cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm cursor-pointer",
										children: "Save Vendor"
									})]
								})
							]
						})] })]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-border rounded-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2 w-1/4",
										children: "Vendor Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Contact Details"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Supplied Items"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Amount Outstanding"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: vendors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 4,
								className: "text-center py-6 text-muted-foreground",
								children: "No vendors added yet."
							}) }) : vendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-medium",
										children: v.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-muted-foreground",
										children: v.contact || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1",
											children: v.itemsSupplied.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-muted px-1.5 py-0.5 rounded-sm border text-[9px] font-semibold text-muted-foreground",
												children: item
											}, idx))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-semibold text-destructive",
										children: fmtINR(v.amountOutstanding)
									})
								]
							}, v.id)) })]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "reorder",
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Reorder Suggestions & Low Stock Items",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-3",
						children: "Items currently below minimum stock levels. Suggestions are calculated to bring stock back to 2x reorder level."
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-border rounded-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Item Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "System Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Reorder Level"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Suggested Purchase Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Last Vendor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 w-28",
										children: "Action"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: reorderSuggestions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "text-center py-6 text-muted-foreground",
								children: "All inventory stocks are healthy. No reorders needed!"
							}) }) : reorderSuggestions.map((item) => {
								const suggestedQty = item.reorder * 2 - item.stock;
								const matchingVendor = vendors.find((v) => v.itemsSupplied.some((brand) => item.name.includes(brand) || item.brand?.includes(brand))) || vendors[0];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t hover:bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-medium",
											children: item.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: item.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right font-bold text-destructive",
											children: item.stock
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right text-muted-foreground",
											children: item.reorder
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2 text-right font-semibold text-success",
											children: ["+", suggestedQty]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: matchingVendor?.name || "KSBCL"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `/purchase?itemId=${item.id}&qty=${suggestedQty}`,
												className: "inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] px-2.5 py-1.5 rounded-sm hover:opacity-90 font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 10 }), " Create PO"]
											})
										})
									]
								}, item.id);
							}) })]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "expiry",
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Expiry Date Tracking",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-3",
						children: "Stock items with expiry dates within the next 30 days. Expired stock should be logged under Wastage."
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-border rounded-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Item Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Batch No"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 font-semibold",
										children: "Stock Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Expiry Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Days Remaining"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2 w-28",
										children: "Status Badge"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: nearExpiryItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "text-center py-6 text-muted-foreground",
								children: "No items expiring in the next 30 days."
							}) }) : nearExpiryItems.map((item) => {
								const diffTime = new Date(item.expiryDate).getTime() - (/* @__PURE__ */ new Date()).getTime();
								const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
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
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t hover:bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-medium",
											children: item.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground font-mono",
											children: item.batchNumber || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: item.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right font-semibold",
											children: item.stock
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: new Date(item.expiryDate).toLocaleDateString("en-IN", { dateStyle: "medium" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-semibold",
											children: diffDays <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive font-bold",
												children: "Expired"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [diffDays, " days"] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex px-2 py-0.5 rounded-sm border text-[10px] font-bold ${badgeClass}`,
												children: label
											})
										})
									]
								}, item.id);
							}) })]
						})
					})]
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "block text-xs font-semibold text-muted-foreground mb-1",
		children: label
	}), children] });
}
//#endregion
export { InventoryPage as component };
