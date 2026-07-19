import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { C as IndianRupee, I as ArrowRight, f as ReceiptText, n as Utensils, o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { k as useStore, n as Panel, r as StatusBadge, v as fmtINR, y as inventoryStatus } from "./AdminShell-DYfqgIMp.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-bgV89_gO.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const bills = useStore((s) => s.bills);
	const tables = useStore((s) => s.tables);
	const inventory = useStore((s) => s.inventory);
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const todaysBills = bills.filter((b) => new Date(b.time) >= today);
	const todaysSales = todaysBills.reduce((s, b) => s + b.total, 0);
	const openTables = tables.filter((t) => t.status !== "Free").length;
	const lowStock = inventory.filter((i) => inventoryStatus(i) !== "In Stock");
	const trend = Array.from({ length: 7 }, (_, i) => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - (6 - i));
		d.setHours(0, 0, 0, 0);
		const next = new Date(d);
		next.setDate(next.getDate() + 1);
		const total = bills.filter((b) => new Date(b.time) >= d && new Date(b.time) < next).reduce((s, b) => s + b.total, 0);
		return {
			day: d.toLocaleDateString("en-IN", { weekday: "short" }),
			sales: total
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					{
						label: "Today's Sales",
						value: fmtINR(todaysSales),
						icon: IndianRupee,
						color: "bg-primary"
					},
					{
						label: "Open Tables",
						value: `${openTables}/${tables.length}`,
						icon: Utensils,
						color: "bg-info"
					},
					{
						label: "Low Stock Items",
						value: lowStock.length,
						icon: TriangleAlert,
						color: "bg-warning"
					},
					{
						label: "Total Bills Today",
						value: todaysBills.length,
						icon: ReceiptText,
						color: "bg-success"
					}
				].map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `stat-box ${s.color}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold leading-none",
							children: s.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs mt-2 opacity-90 uppercase tracking-wide",
							children: s.label
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 40,
							className: "opacity-40"
						})]
					}, s.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Sales — Last 7 Days",
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: trend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										stroke: "var(--muted-foreground)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--muted-foreground)",
										fontSize: 12,
										tickFormatter: (v) => `₹${v / 1e3}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "var(--card)",
											border: "1px solid var(--border)",
											fontSize: 12
										},
										formatter: (v) => fmtINR(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										fill: "var(--primary)",
										radius: [
											2,
											2,
											0,
											0
										]
									})
								]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Low Stock Alerts",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/inventory",
						className: "text-primary text-xs hover:underline flex items-center gap-1",
						children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 12 })]
					}),
					children: lowStock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground py-8 text-center",
						children: "All stock levels healthy."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y",
						children: lowStock.slice(0, 6).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-2 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: i.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									i.category,
									" · Reorder at ",
									i.reorder
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive font-semibold",
								children: i.stock
							})]
						}, i.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Recent Bills",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/billing",
					className: "text-primary text-xs hover:underline flex items-center gap-1",
					children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 12 })]
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
									children: "Bill No"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2",
									children: "Table"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2",
									children: "Payment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bills.slice(0, 10).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-medium",
									children: b.number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2",
									children: ["Table ", b.tableNo]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right",
									children: fmtINR(b.total)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: b.payment
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-muted-foreground",
									children: new Date(b.time).toLocaleString("en-IN", {
										dateStyle: "short",
										timeStyle: "short"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/billing/$id",
										params: { id: b.id },
										className: "text-primary hover:underline text-xs",
										children: "View"
									})
								})
							]
						}, b.id)) })]
					})
				})
			})
		]
	});
}
//#endregion
export { Dashboard as component };
