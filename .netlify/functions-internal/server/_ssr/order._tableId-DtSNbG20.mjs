import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as Save, h as Plus, m as Printer, s as Trash2, t as X, u as Search, v as Minus } from "../_libs/lucide-react.mjs";
import { O as updateTable, S as setOrderQty, f as clearOrder, i as addBill, k as useStore, n as Panel, s as addOrderLine, v as fmtINR } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./order._tableId-CGJPRp3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._tableId-DtSNbG20.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderEntry() {
	const { tableId } = Route.useParams();
	const nav = useNavigate();
	const tables = useStore((s) => s.tables);
	const menu = useStore((s) => s.menu);
	const categories = useStore((s) => s.categories);
	const settings = useStore((s) => s.settings);
	const table = tables.find((t) => t.id === tableId);
	const [cat, setCat] = (0, import_react.useState)("All");
	const [q, setQ] = (0, import_react.useState)("");
	const [discount, setDiscount] = (0, import_react.useState)(0);
	const filtered = (0, import_react.useMemo)(() => menu.filter((m) => m.active).filter((m) => cat === "All" || m.category === cat).filter((m) => m.name.toLowerCase().includes(q.toLowerCase())), [
		menu,
		cat,
		q
	]);
	if (!table) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Table not found"
	});
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
			number: `INV-${1e3 + Math.floor(Math.random() * 9e3)}`,
			tableNo: table.number,
			items: table.order,
			subtotal,
			tax,
			discount,
			total,
			payment: "Cash",
			status: "Pending",
			time: (/* @__PURE__ */ new Date()).toISOString()
		};
		addBill(bill);
		toast.success("Bill created");
		nav({
			to: "/billing/$id",
			params: { id: bill.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-5 gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: `Menu — Table ${table.number}`,
			className: "lg:col-span-3",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tables",
				className: "text-xs text-primary hover:underline",
				children: "← Back to Tables"
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 mb-3",
					children: ["All", ...categories].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCat(c),
						className: `px-3 py-1 text-xs rounded-sm border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border hover:bg-accent"}`,
						children: c
					}, c))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-2.5 top-2.5 text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search items...",
						className: "pl-8 pr-3 py-1.5 border border-border rounded-sm text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto max-h-[500px] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "admin-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted text-xs uppercase text-muted-foreground sticky top-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: m.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-muted-foreground",
									children: m.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right",
									children: fmtINR(m.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => addOrderLine(table.id, {
											itemId: m.id,
											name: m.name,
											qty: 1,
											rate: m.price
										}),
										className: "bg-primary text-primary-foreground px-2 py-1 rounded-sm text-xs hover:bg-primary/90 inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Add"]
									})
								})
							]
						}, m.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-3 py-8 text-center text-muted-foreground text-sm",
							children: "No items found."
						}) })] })]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: `Current Order — Table ${table.number}`,
			className: "lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "admin-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-2 py-2",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-center px-2 py-2 w-24",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-2 py-2",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-2 py-2",
									children: "Amt"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-6" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [table.order.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-3 py-6 text-center text-muted-foreground text-sm",
							children: "No items in order."
						}) }), table.order.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: l.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setOrderQty(table.id, l.itemId, l.qty - 1),
												className: "border border-border w-6 h-6 rounded-sm hover:bg-muted flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 10 })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-6 text-center text-sm",
												children: l.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setOrderQty(table.id, l.itemId, l.qty + 1),
												className: "border border-border w-6 h-6 rounded-sm hover:bg-muted flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 10 })
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-right",
									children: fmtINR(l.rate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-right font-medium",
									children: fmtINR(l.qty * l.rate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setOrderQty(table.id, l.itemId, 0),
										className: "text-destructive hover:bg-destructive/10 p-1 rounded-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
									})
								})
							]
						}, l.itemId))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 text-sm border-t pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: discount,
								onChange: (e) => setDiscount(Number(e.target.value) || 0),
								className: "w-24 text-right border border-border rounded-sm px-2 py-0.5 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"GST (",
								settings.gstRate,
								"%)"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(tax) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-bold text-base border-t pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(total) })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: saveKOT,
							className: "bg-info text-info-foreground text-xs py-2 rounded-sm hover:opacity-90 flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 12 }), " Save KOT"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: printBill,
							className: "bg-primary text-primary-foreground text-xs py-2 rounded-sm hover:opacity-90 flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { size: 12 }), " Print Bill"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								clearOrder(table.id);
								toast.success("Order cancelled");
								nav({ to: "/tables" });
							},
							className: "bg-destructive text-destructive-foreground text-xs py-2 rounded-sm hover:opacity-90 flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 12 }), " Cancel"]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { OrderEntry as component };
