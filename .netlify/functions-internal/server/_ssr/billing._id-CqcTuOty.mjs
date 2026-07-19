import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { O as CircleCheck, m as Printer } from "../_libs/lucide-react.mjs";
import { C as setState, k as useStore, n as Panel, v as fmtINR } from "./AdminShell-DYfqgIMp.mjs";
import { t as Route } from "./billing._id-46ueJaWg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing._id-CqcTuOty.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvoiceView() {
	const { id } = Route.useParams();
	const bill = useStore((s) => s.bills.find((b) => b.id === id));
	const settings = useStore((s) => s.settings);
	const [payment, setPayment] = (0, import_react.useState)(bill?.payment ?? "Cash");
	const [cashReceived, setCashReceived] = (0, import_react.useState)("");
	const received = parseFloat(cashReceived) || 0;
	const billAmt = bill?.total ?? 0;
	const changeDue = received - billAmt;
	if (!bill) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Invoice not found"
	});
	const finalize = () => {
		if (payment === "Cash" && received < billAmt) {
			toast.error("Cash received is less than the bill amount");
			return;
		}
		const cashFields = payment === "Cash" ? {
			cashReceived: received,
			cashReturned: Math.max(0, changeDue)
		} : {
			cashReceived: void 0,
			cashReturned: void 0
		};
		setState((s) => ({
			...s,
			bills: s.bills.map((b) => b.id === bill.id ? {
				...b,
				status: "Paid",
				payment,
				...cashFields
			} : b),
			tables: s.tables.map((t) => t.number === bill.tableNo ? {
				...t,
				order: [],
				status: "Free"
			} : t)
		}));
		toast.success("Bill finalized & table released");
		setTimeout(() => window.print(), 200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-3 gap-4 print:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `Invoice ${bill.number}`,
			className: "lg:col-span-2",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/billing",
				className: "text-xs text-primary hover:underline",
				children: "← Back"
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border p-6 bg-white text-black text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-start border-b pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold",
								children: settings.venueName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: settings.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs",
								children: ["Phone: ", settings.phone]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs",
								children: ["GSTIN: ", settings.gstNumber]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-base",
									children: "TAX INVOICE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Bill No: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: bill.number
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Table: ", bill.tableNo] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: new Date(bill.time).toLocaleString("en-IN") })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full mt-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-black/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-1.5",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-1.5",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-center py-1.5",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right py-1.5",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right py-1.5",
									children: "Amount"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bill.items.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-dashed border-black/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5",
									children: l.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5 text-center",
									children: l.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5 text-right",
									children: fmtINR(l.rate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5 text-right",
									children: fmtINR(l.qty * l.rate)
								})
							]
						}, i)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-56 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.subtotal) })]
								}),
								bill.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["- ", fmtINR(bill.discount)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"GST (",
										settings.gstRate,
										"%)"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.tax) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-bold text-sm border-t border-black/40 pt-1 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.total) })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[10px] mt-6 text-black/60",
						children: "Thank you for your visit!"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Payment & Actions",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium mb-2",
						children: "Payment Mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							"Cash",
							"Card",
							"UPI"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPayment(p),
							className: `py-2 text-xs rounded-sm border ${payment === p ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border hover:bg-accent"}`,
							children: p
						}, p))
					})] }),
					payment === "Cash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border rounded-sm bg-muted/40 p-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-foreground uppercase tracking-wide",
								children: "Cash Exchange"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] text-muted-foreground mb-1",
								children: "Bill Amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: fmtINR(billAmt),
								readOnly: true,
								className: "w-full px-2 py-1.5 text-xs bg-background border border-border rounded-sm font-semibold"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] text-muted-foreground mb-1",
								children: "Total Cash Received"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0",
								step: "1",
								value: cashReceived,
								onChange: (e) => setCashReceived(e.target.value),
								placeholder: "0",
								className: "w-full px-2 py-1.5 text-xs bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1 flex-wrap",
								children: [
									[
										100,
										500,
										1e3,
										2e3
									].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setCashReceived(String(received + d)),
										className: "text-[10px] px-2 py-1 bg-background border border-border rounded-sm hover:bg-accent",
										children: ["+", d]
									}, d)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCashReceived(String(billAmt)),
										className: "text-[10px] px-2 py-1 bg-background border border-border rounded-sm hover:bg-accent",
										children: "Exact"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCashReceived(""),
										className: "text-[10px] px-2 py-1 bg-background border border-border rounded-sm hover:bg-accent",
										children: "Clear"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex justify-between text-xs pt-2 border-t border-border ${received === 0 ? "text-muted-foreground" : changeDue < 0 ? "text-destructive" : "text-success"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: changeDue < 0 ? "Balance Due" : "Return Amount"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: fmtINR(Math.abs(changeDue))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: bill.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount Due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: fmtINR(bill.total)
								})]
							}),
							bill.status === "Paid" && bill.payment === "Cash" && bill.cashReceived !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 p-2 bg-muted/40 border border-border rounded-sm text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold uppercase tracking-wide text-[10px] text-muted-foreground",
										children: "Cash Exchange"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cash Received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: fmtINR(bill.cashReceived)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Returned" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: fmtINR(bill.cashReturned ?? 0)
										})]
									})
								]
							})
						]
					}),
					bill.status === "Pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: finalize,
						className: "w-full bg-success text-success-foreground py-2 rounded-sm text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " Finalize & Print"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => window.print(),
						className: "w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { size: 14 }), " Print Receipt"]
					})
				]
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden print:block w-full max-w-[76mm] mx-auto p-4 text-black bg-white font-mono text-[11px] leading-tight",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-1 mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-wider",
						children: settings.venueName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px]",
						children: settings.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px]",
						children: ["Phone: ", settings.phone]
					}),
					settings.gstNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px]",
						children: ["GSTIN: ", settings.gstNumber]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-black my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5 text-[10px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Bill No: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-bold",
							children: bill.number
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Table: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bill.tableNo })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Date: ", new Date(bill.time).toLocaleString("en-IN", {
							dateStyle: "short",
							timeStyle: "medium"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Status: ", bill.status] })]
					}),
					bill.status === "Paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Payment: ", bill.payment] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-black my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-[10px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-black pb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left font-bold py-0.5 w-[50%]",
							children: "Item"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-center font-bold py-0.5 w-[15%]",
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right font-bold py-0.5 w-[35%]",
							children: "Amount"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bill.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "align-top border-b border-dashed border-black/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[9px] text-black/70",
								children: ["@", fmtINR(item.rate)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1 text-center font-semibold",
							children: item.qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1 text-right font-semibold",
							children: fmtINR(item.qty * item.rate)
						})
					]
				}, index)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-black my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 text-[10px] font-semibold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.subtotal) })]
					}),
					bill.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-black/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["- ", fmtINR(bill.discount)] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"GST (",
							settings.gstRate,
							"%)"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.tax) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-black my-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-xs font-bold pt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GRAND TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.total) })]
					}),
					bill.payment === "Cash" && bill.cashReceived !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[9px] pt-1 font-normal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cash Received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.cashReceived) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[9px] font-normal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Change Returned" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtINR(bill.cashReturned ?? 0) })]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-black my-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-bold text-center",
					children: "THANK YOU FOR YOUR VISIT!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[8px] text-black/60 text-center",
					children: "Software by Copper Barrel v1.0"
				})]
			})
		]
	})] });
}
//#endregion
export { InvoiceView as component };
