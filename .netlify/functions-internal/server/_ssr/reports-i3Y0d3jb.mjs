import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { F as Award, T as FileDown, o as TriangleAlert, w as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { k as useStore, n as Panel, r as StatusBadge, v as fmtINR, y as inventoryStatus } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-i3Y0d3jb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const bills = useStore((s) => s.bills);
	const inventory = useStore((s) => s.inventory);
	const wastage = useStore((s) => s.wastage);
	const purchases = useStore((s) => s.purchases);
	const salesHistory = useStore((s) => s.salesHistory);
	const [kind, setKind] = (0, import_react.useState)("daily");
	const [from, setFrom] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - 29);
		return d.toISOString().slice(0, 10);
	});
	const [to, setTo] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [selectedItemId, setSelectedItemId] = (0, import_react.useState)(() => inventory[0]?.id ?? "");
	const daily = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		bills.filter((b) => {
			const t = new Date(b.time);
			return t >= new Date(from) && t <= /* @__PURE__ */ new Date(to + "T23:59:59");
		}).forEach((b) => {
			const k = new Date(b.time).toISOString().slice(0, 10);
			const e = map.get(k) ?? {
				count: 0,
				total: 0
			};
			e.count++;
			e.total += b.total;
			map.set(k, e);
		});
		return Array.from(map.entries()).sort().map(([date, v]) => ({
			date,
			...v
		}));
	}, [
		bills,
		from,
		to
	]);
	const monthly = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		bills.forEach((b) => {
			const d = new Date(b.time);
			const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			const e = map.get(k) ?? {
				count: 0,
				total: 0
			};
			e.count++;
			e.total += b.total;
			map.set(k, e);
		});
		return Array.from(map.entries()).sort().map(([month, v]) => ({
			month,
			...v
		}));
	}, [bills]);
	const consumptionChartData = (0, import_react.useMemo)(() => {
		const filteredSales = salesHistory.filter((s) => s.itemId === selectedItemId);
		const map = /* @__PURE__ */ new Map();
		const now = /* @__PURE__ */ new Date();
		for (let d = 29; d >= 0; d--) {
			const dateStr = (/* @__PURE__ */ new Date(now.getTime() - d * 24 * 60 * 60 * 1e3)).toISOString().slice(0, 10);
			map.set(dateStr, 0);
		}
		filteredSales.forEach((s) => {
			if (map.has(s.date)) map.set(s.date, (map.get(s.date) ?? 0) + s.qty);
		});
		return Array.from(map.entries()).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).map(([date, qty]) => ({
			label: new Date(date).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short"
			}),
			value: qty
		}));
	}, [salesHistory, selectedItemId]);
	const deadStockItems = (0, import_react.useMemo)(() => {
		return inventory.filter((item) => {
			return salesHistory.filter((s) => s.itemId === item.id).reduce((sum, s) => sum + s.qty, 0) === 0;
		});
	}, [inventory, salesHistory]);
	const stockValuation = (0, import_react.useMemo)(() => {
		const items = inventory.map((i) => {
			const cost = i.costPrice ?? 0;
			return {
				item: i,
				cost,
				val: i.stock * cost
			};
		});
		return {
			items,
			totalVal: items.reduce((sum, i) => sum + i.val, 0)
		};
	}, [inventory]);
	const exciseRegister = (0, import_react.useMemo)(() => {
		return inventory.map((item) => {
			const purchasedQty = purchases.filter((p) => {
				const d = new Date(p.date);
				return d >= new Date(from) && d <= /* @__PURE__ */ new Date(to + "T23:59:59");
			}).flatMap((p) => p.lines).filter((l) => l.itemId === item.id).reduce((sum, l) => sum + l.qty, 0);
			const soldQty = salesHistory.filter((s) => {
				const d = new Date(s.date);
				return d >= new Date(from) && d <= /* @__PURE__ */ new Date(to + "T23:59:59");
			}).filter((s) => s.itemId === item.id).reduce((sum, s) => sum + s.qty, 0);
			const wastedQty = wastage.filter((w) => {
				const d = new Date(w.date);
				return d >= new Date(from) && d <= /* @__PURE__ */ new Date(to + "T23:59:59");
			}).filter((w) => w.itemId === item.id).reduce((sum, w) => sum + w.qty, 0);
			const closing = item.stock;
			return {
				item,
				opening: Math.max(0, closing + soldQty + wastedQty - purchasedQty),
				purchased: purchasedQty,
				sold: soldQty,
				wastage: wastedQty,
				closing
			};
		});
	}, [
		inventory,
		purchases,
		salesHistory,
		wastage,
		from,
		to
	]);
	const chartData = (0, import_react.useMemo)(() => {
		if (kind === "daily") return daily.map((d) => ({
			label: new Date(d.date).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short"
			}),
			value: d.total
		}));
		else if (kind === "monthly") return monthly.map((m) => ({
			label: m.month,
			value: m.total
		}));
		else if (kind === "stock") return inventory.map((i) => ({
			label: i.name.slice(0, 12),
			value: i.stock
		}));
		else if (kind === "consumption") return consumptionChartData;
		return [];
	}, [
		kind,
		daily,
		monthly,
		inventory,
		consumptionChartData
	]);
	const stub = (name) => () => toast.success(`${name} export triggered (prototype)`);
	const activeItemName = (0, import_react.useMemo)(() => {
		return inventory.find((i) => i.id === selectedItemId)?.name ?? "";
	}, [inventory, selectedItemId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Report Filters",
				className: "print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground mb-1",
							children: "Report Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: kind,
							onChange: (e) => setKind(e.target.value),
							className: "inp h-9",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "daily",
									children: "Daily Sales Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "monthly",
									children: "Monthly Sales Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "stock",
									children: "Stock Quantity Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "valuation",
									children: "Stock Valuation Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "consumption",
									children: "Consumption Trend Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "deadstock",
									children: "Dead Stock Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "excise",
									children: "Excise-Style Stock Register"
								})
							]
						})] }),
						kind === "consumption" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground mb-1",
							children: "Select Item to Track"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedItemId,
							onChange: (e) => setSelectedItemId(e.target.value),
							className: "inp h-9 min-w-[200px]",
							children: inventory.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: i.id,
								children: i.name
							}, i.id))
						})] }),
						kind !== "stock" && kind !== "monthly" && kind !== "valuation" && kind !== "deadstock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground mb-1",
							children: "From"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: from,
							onChange: (e) => setFrom(e.target.value),
							className: "inp h-9"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground mb-1",
							children: "To"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: to,
							onChange: (e) => setTo(e.target.value),
							className: "inp h-9"
						})] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: kind === "excise" ? () => window.print() : stub("PDF"),
								className: "text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1 cursor-pointer h-9 font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { size: 12 }),
									" ",
									kind === "excise" ? "Print compliance list" : "Export PDF"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: stub("Excel"),
								className: "text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1 cursor-pointer h-9 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { size: 12 }), " Export Excel"]
							})]
						})
					]
				})
			}),
			kind === "valuation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-1 bg-primary/10 border border-primary/20 p-4 rounded-sm flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase font-bold text-primary/80 tracking-wider",
						children: "Total Stock Value"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold mt-1 text-primary",
						children: fmtINR(stockValuation.totalVal)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
						className: "text-primary opacity-40 shrink-0",
						size: 32
					})]
				})
			}),
			kind === "deadstock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-warning/10 border border-warning/20 p-4 rounded-sm flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "text-warning shrink-0 mt-0.5",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-semibold text-warning-foreground",
					children: "Dead Stock Alert"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: [
						"The following ",
						deadStockItems.length,
						" items have recorded zero sales in the last 30 days. Consider promotions or discounts."
					]
				})] })]
			}),
			(kind === "daily" || kind === "monthly" || kind === "consumption") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: kind === "consumption" ? `Sales Quantities: ${activeItemName}` : "Sales Trends",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chartData,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									fontSize: 11
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									fontSize: 11,
									tickFormatter: (v) => kind === "consumption" ? `${v} units` : `₹${v / 1e3}k`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										fontSize: 12
									},
									formatter: (v) => kind === "consumption" ? `${v} units` : fmtINR(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: "var(--primary)"
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: kind === "daily" ? "Daily Sales Breakdown" : kind === "monthly" ? "Monthly Sales Breakdown" : kind === "stock" ? "Active Stock Level List" : kind === "valuation" ? "Stock Valuation Details" : kind === "deadstock" ? "Dead Stock List (No Sales 30d)" : `Excise compliance stock register (${new Date(from).toLocaleDateString("en-IN")} to ${new Date(to).toLocaleDateString("en-IN")})`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [
						kind === "daily" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Bills Count"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Total Sales"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: daily.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: new Date(d.date).toLocaleDateString("en-IN", { dateStyle: "medium" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right",
										children: d.count
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-semibold",
										children: fmtINR(d.total)
									})
								]
							}, d.date)) })]
						}),
						kind === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2",
										children: "Month"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Bills Count"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2",
										children: "Total Sales"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: monthly.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: m.month
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right",
										children: m.count
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-semibold",
										children: fmtINR(m.total)
									})
								]
							}, m.month)) })]
						}),
						kind === "stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-[10px] uppercase text-muted-foreground",
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
										className: "text-right px-3 py-2 font-semibold",
										children: "Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 text-muted-foreground",
										children: "Reorder"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2 w-28",
										children: "Status"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: inventory.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-medium",
										children: i.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-muted-foreground",
										children: i.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-bold",
										children: i.stock
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right text-muted-foreground",
										children: i.reorder
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: inventoryStatus(i) })
									})
								]
							}, i.id)) })]
						}),
						kind === "valuation" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
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
										className: "text-right px-3 py-2 w-32",
										children: "Current Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 w-32",
										children: "Cost Price (₹)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 w-32 font-bold",
										children: "Stock Value (₹)"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [stockValuation.items.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-medium",
										children: row.item.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-muted-foreground",
										children: row.item.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-semibold",
										children: row.item.stock
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right",
										children: fmtINR(row.cost)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-bold",
										children: fmtINR(row.val)
									})
								]
							}, row.item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t-2 border-black font-bold bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 2,
									className: "px-3 py-3",
									children: "Total Inventory Valuation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 3,
									className: "px-3 py-3 text-right text-sm text-primary",
									children: fmtINR(stockValuation.totalVal)
								})]
							})] })]
						}),
						kind === "deadstock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
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
										className: "text-right px-3 py-2 w-32 font-semibold",
										children: "Stock Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-3 py-2 w-32",
										children: "Idle Value (₹)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-3 py-2 w-28",
										children: "Status"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: deadStockItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "text-center py-6 text-muted-foreground",
								children: "No dead stock! All items have recorded sales in the last 30 days."
							}) }) : deadStockItems.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-medium",
										children: i.name
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
										className: "px-3 py-2 text-right font-semibold",
										children: i.stock
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-right font-bold text-destructive",
										children: fmtINR(i.stock * (i.costPrice ?? 0))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex px-2 py-0.5 rounded-sm border text-[10px] font-bold bg-destructive/15 text-destructive border-destructive/20",
											children: "Dead (30d+)"
										})
									})
								]
							}, i.id)) })]
						}),
						kind === "excise" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-black rounded-sm p-4 bg-white text-black font-sans leading-relaxed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center space-y-1 border-b-2 border-black pb-4 mb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-bold uppercase tracking-wider",
											children: "Excise Stock compliance Register"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs",
											children: [
												"Date Range: ",
												new Date(from).toLocaleDateString("en-IN", { dateStyle: "long" }),
												" to ",
												new Date(to).toLocaleDateString("en-IN", { dateStyle: "long" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "The Copper Barrel · Bengaluru Depot"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-xs border border-collapse border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-muted/50 border-b border-black text-center font-bold",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border border-black px-2 py-1.5 text-left w-1/3",
												children: "Item Details"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border border-black px-2 py-1.5 w-20",
												children: "Opening"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border border-black px-2 py-1.5 w-20",
												children: "Purchased (+)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border border-black px-2 py-1.5 w-20",
												children: "Sold (-)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border border-black px-2 py-1.5 w-20",
												children: "Wastage (-)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border border-black px-2 py-1.5 w-20",
												children: "Closing (=)"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: exciseRegister.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "align-middle text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "border border-black px-2 py-1 text-left font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: row.item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[9px] text-muted-foreground font-normal",
													children: [
														"Category: ",
														row.item.category,
														" ",
														row.item.batchNumber && `· Batch: ${row.item.batchNumber}`
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border border-black px-2 py-1",
												children: row.opening
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border border-black px-2 py-1 text-success font-semibold",
												children: row.purchased > 0 ? `+${row.purchased}` : "0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border border-black px-2 py-1 text-destructive",
												children: row.sold > 0 ? `-${row.sold}` : "0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border border-black px-2 py-1 text-destructive",
												children: row.wastage > 0 ? `-${row.wastage}` : "0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border border-black px-2 py-1 font-bold",
												children: row.closing
											})
										]
									}, row.item.id)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex justify-between text-xs pt-8 border-t border-dashed border-black/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center w-40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b border-black h-8 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-semibold",
											children: "Compliance Officer"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center w-40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b border-black h-8 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-semibold",
											children: "Authorized Signature"
										})]
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
