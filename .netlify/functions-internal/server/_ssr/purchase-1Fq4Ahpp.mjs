import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as Save, h as Plus, s as Trash2 } from "../_libs/lucide-react.mjs";
import { c as addPurchase, k as useStore, n as Panel, v as fmtINR } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchase-1Fq4Ahpp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PurchasePage() {
	const inventory = useStore((s) => s.inventory);
	const purchases = useStore((s) => s.purchases);
	const vendors = useStore((s) => s.vendors);
	const [supplier, setSupplier] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [invoiceNo, setInvoiceNo] = (0, import_react.useState)("");
	const [paymentStatus, setPaymentStatus] = (0, import_react.useState)("Paid");
	const [amountDue, setAmountDue] = (0, import_react.useState)(0);
	const [lines, setLines] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && inventory.length > 0) {
			const params = new URLSearchParams(window.location.search);
			const prefillItemId = params.get("itemId");
			const prefillQty = params.get("qty");
			if (prefillItemId) {
				const item = inventory.find((i) => i.id === prefillItemId);
				if (item) {
					const qty = parseInt(prefillQty || "1") || 1;
					const cost = item.costPrice ?? 0;
					setLines([{
						itemId: prefillItemId,
						qty,
						cost
					}]);
					const matchingVendor = vendors.find((v) => v.itemsSupplied.some((brand) => item.name.includes(brand) || item.brand?.includes(brand))) || vendors[0];
					if (matchingVendor) setSupplier(matchingVendor.name);
					return;
				}
			}
		}
		if (lines.length === 0 && inventory.length > 0) setLines([{
			itemId: inventory[0].id,
			qty: 1,
			cost: inventory[0].costPrice ?? 0
		}]);
	}, [inventory, vendors]);
	const total = lines.reduce((s, l) => s + l.qty * l.cost, 0);
	(0, import_react.useEffect)(() => {
		if (paymentStatus === "Paid") setAmountDue(0);
		else if (paymentStatus === "Unpaid") setAmountDue(total);
		else if (amountDue > total) setAmountDue(total);
	}, [total, paymentStatus]);
	const addRow = () => {
		const firstItem = inventory[0];
		setLines([...lines, {
			itemId: firstItem?.id ?? "",
			qty: 1,
			cost: firstItem?.costPrice ?? 0
		}]);
	};
	const remove = (i) => setLines(lines.filter((_, idx) => idx !== i));
	const update = (i, patch) => {
		setLines(lines.map((l, idx) => {
			if (idx !== i) return l;
			const updatedLine = {
				...l,
				...patch
			};
			if (patch.itemId) {
				const item = inventory.find((item) => item.id === patch.itemId);
				if (item) updatedLine.cost = item.costPrice ?? 0;
			}
			return updatedLine;
		}));
	};
	const save = (e) => {
		e.preventDefault();
		if (!supplier) return toast.error("Please select a supplier");
		if (!invoiceNo.trim()) return toast.error("Invoice number required");
		if (lines.length === 0) return toast.error("Please add at least one line item");
		if (paymentStatus === "Partial" && (amountDue <= 0 || amountDue >= total)) return toast.error("For partial payments, amount due must be between 0 and the total amount");
		addPurchase({
			supplier,
			date: new Date(date).toISOString(),
			invoiceNo,
			lines,
			total,
			paymentStatus,
			amountDue
		});
		toast.success("Purchase entry logged and stocks incremented");
		setSupplier("");
		setInvoiceNo("");
		setPaymentStatus("Paid");
		setAmountDue(0);
		setLines([{
			itemId: inventory[0]?.id ?? "",
			qty: 1,
			cost: inventory[0]?.costPrice ?? 0
		}]);
		if (typeof window !== "undefined" && window.location.search) window.history.replaceState({}, document.title, window.location.pathname);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "New Purchase Entry / Stock In",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Supplier / Vendor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: supplier,
								onChange: (e) => setSupplier(e.target.value),
								className: "inp h-9",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									disabled: true,
									children: "Select Supplier"
								}), vendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: v.name,
									children: v.name
								}, v.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Purchase Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								className: "inp h-9"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Invoice No."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: invoiceNo,
								onChange: (e) => setInvoiceNo(e.target.value),
								className: "inp h-9",
								placeholder: "e.g. INV-2026-981",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Payment Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: paymentStatus,
								onChange: (e) => setPaymentStatus(e.target.value),
								className: "inp h-9",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Paid",
										children: "Paid (Full)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Partial",
										children: "Partial Payment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Unpaid",
										children: "Unpaid (On Credit)"
									})
								]
							})] })
						]
					}),
					paymentStatus === "Partial" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xs bg-muted/40 p-3 border rounded-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Outstanding Amount Due (₹)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "1",
								max: total - 1,
								value: amountDue,
								onChange: (e) => setAmountDue(Number(e.target.value)),
								className: "inp h-9",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground block mt-1",
								children: [
									"Total Invoice: ",
									fmtINR(total),
									". Amount paid: ",
									fmtINR(total - amountDue),
									"."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border border-border rounded-sm overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "admin-table text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted text-[10px] uppercase text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-3 py-2",
											children: "Item"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2 w-28",
											children: "Quantity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2 w-32",
											children: "Cost / Unit (₹)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-3 py-2 w-32",
											children: "Subtotal"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-10" })
									] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: l.itemId,
												onChange: (e) => update(i, { itemId: e.target.value }),
												className: "inp py-1",
												children: inventory.map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: inv.id,
													children: [
														inv.name,
														" (",
														inv.unit,
														")"
													]
												}, inv.id))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "1",
												value: l.qty,
												onChange: (e) => update(i, { qty: Number(e.target.value) }),
												className: "inp text-right py-1"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												value: l.cost,
												onChange: (e) => update(i, { cost: Number(e.target.value) }),
												className: "inp text-right py-1"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right font-medium",
											children: fmtINR(l.qty * l.cost)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => remove(i),
												className: "text-destructive hover:bg-destructive/10 p-1 rounded-sm cursor-pointer",
												disabled: lines.length <= 1,
												style: { opacity: lines.length <= 1 ? .3 : 1 },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
											})
										})
									]
								}, i)) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t bg-muted/40 font-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 3,
											className: "px-3 py-2 text-right",
											children: "Total"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right text-sm",
											children: fmtINR(total)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
									]
								}) })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: addRow,
							className: "text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Add Line Item"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm hover:opacity-90 flex items-center gap-1 cursor-pointer font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 12 }), " Save Purchase Log"]
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Recent Purchases History",
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
								children: "Supplier / Vendor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left px-3 py-2",
								children: "Invoice No"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right px-3 py-2",
								children: "Items Count"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right px-3 py-2",
								children: "Total Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left px-3 py-2",
								children: "Payment Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right px-3 py-2",
								children: "Amount Outstanding"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: purchases.map((p) => {
						const status = p.paymentStatus ?? "Paid";
						const isPaid = status === "Paid";
						const isUnpaid = status === "Unpaid";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: new Date(p.date).toLocaleDateString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-medium",
									children: p.supplier
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono",
									children: p.invoiceNo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right",
									children: p.lines.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right font-semibold",
									children: fmtINR(p.total)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold border ${isPaid ? "bg-success/15 text-success border-success/20" : isUnpaid ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-warning/20 text-warning-foreground border-warning/30"}`,
										children: status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-3 py-2 text-right font-semibold ${p.amountDue && p.amountDue > 0 ? "text-destructive" : "text-muted-foreground"}`,
									children: p.amountDue ? fmtINR(p.amountDue) : "₹0"
								})
							]
						}, p.id);
					}) })]
				})
			})
		})]
	});
}
//#endregion
export { PurchasePage as component };
