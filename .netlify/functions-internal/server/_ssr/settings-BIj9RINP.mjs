import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as Save, g as Pencil, h as Plus, j as Check, m as Printer, n as Utensils, s as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { E as updateSettings, O as updateTable, _ as deleteTable, k as useStore, n as Panel, r as StatusBadge, u as addTable, v as fmtINR } from "./AdminShell-DYfqgIMp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Fv8PDfKy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BIj9RINP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useStore((s) => s.settings);
	const [general, setGeneral] = (0, import_react.useState)({
		venueName: settings.venueName,
		address: settings.address,
		phone: settings.phone,
		gstNumber: settings.gstNumber
	});
	const [tax, setTax] = (0, import_react.useState)({
		gstRate: settings.gstRate,
		taxInclusive: settings.taxInclusive
	});
	const [printer, setPrinter] = (0, import_react.useState)(settings.printer);
	const tables = useStore((s) => s.tables);
	const [singleNumber, setSingleNumber] = (0, import_react.useState)("");
	const [batchStart, setBatchStart] = (0, import_react.useState)("");
	const [batchCount, setBatchCount] = (0, import_react.useState)("5");
	const [editingTableId, setEditingTableId] = (0, import_react.useState)(null);
	const [editingTableNum, setEditingTableNum] = (0, import_react.useState)("");
	const saveGeneral = () => {
		updateSettings(general);
		toast.success("General settings saved");
	};
	const saveTax = () => {
		updateSettings(tax);
		toast.success("Tax settings saved");
	};
	const savePrinter = () => {
		updateSettings({ printer });
		toast.success("Printer settings saved");
	};
	const suggestedStart = (tables.length > 0 ? Math.max(...tables.map((t) => t.number)) : 0) + 1;
	const handleAddTable = (e) => {
		e.preventDefault();
		const num = parseInt(singleNumber);
		if (isNaN(num) || num <= 0) {
			toast.error("Please enter a valid table number");
			return;
		}
		try {
			addTable(num);
			toast.success(`Table ${num} added successfully`);
			setSingleNumber("");
		} catch (err) {
			toast.error(err.message || "Failed to add table");
		}
	};
	const handleBatchGenerate = (e) => {
		e.preventDefault();
		const startVal = batchStart.trim() === "" ? suggestedStart : parseInt(batchStart);
		const count = parseInt(batchCount);
		if (isNaN(startVal) || startVal <= 0) {
			toast.error("Please enter a valid starting table number");
			return;
		}
		if (isNaN(count) || count <= 0 || count > 50) {
			toast.error("Please enter a count between 1 and 50");
			return;
		}
		let addedCount = 0;
		const skipped = [];
		for (let i = 0; i < count; i++) {
			const tableNum = startVal + i;
			try {
				addTable(tableNum);
				addedCount++;
			} catch (err) {
				skipped.push(tableNum);
			}
		}
		if (addedCount > 0) {
			toast.success(`Generated ${addedCount} tables`);
			setBatchStart("");
		}
		if (skipped.length > 0) toast.error(`Skipped tables (already exist): ${skipped.join(", ")}`);
	};
	const handleStartEdit = (id, num) => {
		setEditingTableId(id);
		setEditingTableNum(String(num));
	};
	const handleSaveEdit = (id) => {
		const num = parseInt(editingTableNum);
		if (isNaN(num) || num <= 0) {
			toast.error("Please enter a valid table number");
			return;
		}
		try {
			updateTable(id, { number: num });
			toast.success(`Table number updated to ${num}`);
			setEditingTableId(null);
		} catch (err) {
			toast.error(err.message || "Failed to update table");
		}
	};
	const handleCancelEdit = () => {
		setEditingTableId(null);
		setEditingTableNum("");
	};
	const handleDeleteTable = (id, number) => {
		if (confirm(`Are you sure you want to delete Table ${number}?`)) try {
			deleteTable(id);
			toast.success(`Table ${number} deleted`);
		} catch (err) {
			toast.error(err.message || "Failed to delete table");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Settings",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "general",
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full max-w-lg grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "general",
							children: "General"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "tax",
							children: "Tax"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "printer",
							children: "Printer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "tables",
							children: "Tables Setup"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "general",
					className: "mt-4 max-w-2xl space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium mb-1",
							children: "Venue Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: general.venueName,
							onChange: (e) => setGeneral({
								...general,
								venueName: e.target.value
							}),
							className: "inp"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium mb-1",
							children: "Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: general.address,
							onChange: (e) => setGeneral({
								...general,
								address: e.target.value
							}),
							className: "inp",
							rows: 2
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium mb-1",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: general.phone,
								onChange: (e) => setGeneral({
									...general,
									phone: e.target.value
								}),
								className: "inp"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium mb-1",
								children: "GST Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: general.gstNumber,
								onChange: (e) => setGeneral({
									...general,
									gstNumber: e.target.value
								}),
								className: "inp"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium mb-1",
							children: "Logo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "text-xs"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: saveGeneral,
							className: "bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 12 }), " Save Changes"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "tax",
					className: "mt-4 max-w-2xl space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium mb-1",
							children: "GST Rate (%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: tax.gstRate,
							onChange: (e) => setTax({
								...tax,
								gstRate: Number(e.target.value)
							}),
							className: "inp w-32"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: tax.taxInclusive,
								onChange: (e) => setTax({
									...tax,
									taxInclusive: e.target.checked
								})
							}), "Tax-inclusive pricing"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: saveTax,
							className: "bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 12 }), " Save Changes"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "printer",
					className: "mt-4 max-w-2xl space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium mb-1",
							children: "Printer Device"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: printer,
							onChange: (e) => setPrinter(e.target.value),
							className: "inp",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Epson TM-T82 (USB)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "TVS RP-3160 Star (USB)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Bixolon SRP-330 (Network)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Generic / Text Only" })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Connected"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: savePrinter,
								className: "bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-sm flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 12 }), " Save Changes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toast.success("Test page sent to printer (prototype)"),
								className: "border border-border text-xs px-4 py-1.5 rounded-sm hover:bg-muted flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { size: 12 }), " Test Print"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "tables",
					className: "mt-4 space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-between items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold",
									children: [
										"Active Tables (",
										tables.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "List of tables in service and their status"
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto border border-border rounded-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "admin-table",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted text-xs uppercase text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left px-3 py-2 w-1/3",
												children: "Table Number"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left px-3 py-2",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left px-3 py-2",
												children: "Active Order"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-right px-3 py-2 w-24",
												children: "Actions"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: tables.map((t) => {
										const isEditing = editingTableId === t.id;
										const orderTotal = t.order.reduce((sum, item) => sum + item.qty * item.rate, 0);
										const orderText = t.order.length > 0 ? `${t.order.length} items (${fmtINR(orderTotal)})` : "None";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-t hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-2 font-medium",
													children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														value: editingTableNum,
														onChange: (e) => setEditingTableNum(e.target.value),
														className: "inp py-1 text-xs w-24",
														autoFocus: true
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, {
																size: 12,
																className: "text-muted-foreground"
															}),
															"Table ",
															t.number
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: t.status })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-2 text-xs text-muted-foreground",
													children: orderText
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-2 text-right",
													children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-end gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleSaveEdit(t.id),
															className: "p-1 hover:bg-success/20 text-success rounded-sm",
															title: "Save",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: handleCancelEdit,
															className: "p-1 hover:bg-destructive/20 text-destructive rounded-sm",
															title: "Cancel",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 13 })
														})]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-end gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleStartEdit(t.id, t.number),
															className: "p-1 hover:bg-muted rounded-sm text-info",
															title: "Edit number",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 13 })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleDeleteTable(t.id, t.number),
															className: "p-1 hover:bg-muted rounded-sm text-destructive",
															title: "Delete Table",
															disabled: t.status !== "Free",
															style: { opacity: t.status !== "Free" ? .4 : 1 },
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
														})]
													})
												})
											]
										}, t.id);
									}) })]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-border rounded-sm p-4 bg-card space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Add Single Table"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Add a new table manually"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleAddTable,
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-medium mb-1",
										children: "Table Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: singleNumber,
										onChange: (e) => setSingleNumber(e.target.value),
										placeholder: "e.g. 11",
										className: "inp",
										min: "1"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "w-full bg-primary text-primary-foreground text-xs py-1.5 rounded-sm flex items-center justify-center gap-1 hover:bg-primary/95",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 }), " Add Table"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-border rounded-sm p-4 bg-card space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Quick Generator"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Batch create multiple tables at once"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleBatchGenerate,
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-medium mb-1",
											children: "Start Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: batchStart,
											onChange: (e) => setBatchStart(e.target.value),
											placeholder: String(suggestedStart),
											className: "inp",
											min: "1"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-medium mb-1",
											children: "Total Tables"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: batchCount,
											onChange: (e) => setBatchCount(e.target.value),
											placeholder: "5",
											className: "inp",
											min: "1",
											max: "50"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "w-full border border-border text-xs py-1.5 rounded-sm hover:bg-muted flex items-center justify-center gap-1 cursor-pointer",
										children: "Generate Tables"
									})]
								})]
							})]
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
