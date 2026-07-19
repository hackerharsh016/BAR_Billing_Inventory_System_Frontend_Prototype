import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { k as useStore, n as Panel, r as StatusBadge, v as fmtINR } from "./AdminShell-DYfqgIMp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-Df3rR5bi.js
var import_jsx_runtime = require_jsx_runtime();
function BillingLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/billing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingList, {});
}
function BillingList() {
	const bills = useStore((s) => s.bills);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "All Invoices",
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
							children: "Date & Time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Table"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Items"
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
							className: "text-right px-3 py-2",
							children: "Action"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bills.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-medium",
							children: b.number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-xs",
							children: new Date(b.time).toLocaleString("en-IN", {
								dateStyle: "medium",
								timeStyle: "short"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: ["Table ", b.tableNo]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: [b.items.length, " items"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-right font-medium",
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
	});
}
//#endregion
export { BillingLayout as component };
