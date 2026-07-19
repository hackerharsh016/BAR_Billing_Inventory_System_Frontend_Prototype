import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { O as CircleCheck, n as Utensils } from "../_libs/lucide-react.mjs";
import { f as clearOrder, k as useStore, n as Panel, r as StatusBadge, v as fmtINR } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tables-DGBh-XeF.js
var import_jsx_runtime = require_jsx_runtime();
function TablesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "All Tables",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
			children: useStore((s) => s.tables).map((t) => {
				const total = t.order.reduce((s, l) => s + l.qty * l.rate, 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `border-2 ${t.status === "Free" ? "border-success/40" : t.status === "Occupied" ? "border-warning/50" : "border-info/40"} rounded-sm bg-card p-3 flex flex-col`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, {
									size: 16,
									className: "text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: ["Table ", t.number]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: t.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-2 min-h-[32px]",
							children: t.order.length > 0 ? `${t.order.length} items · ${fmtINR(total)}` : "No active order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/order/$tableId",
							params: { tableId: t.id },
							className: "mt-2 text-center bg-primary text-primary-foreground text-xs py-1.5 rounded-sm hover:bg-primary/90",
							children: t.status === "Free" ? "New Order" : "View Order"
						}),
						t.status === "Bill Printed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								clearOrder(t.id);
								toast.success(`Table ${t.number} released`);
							},
							className: "mt-1.5 bg-success text-success-foreground text-xs py-1.5 rounded-sm hover:opacity-90 flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }), " Complete & Free"]
						})
					]
				}, t.id);
			})
		})
	});
}
//#endregion
export { TablesPage as component };
