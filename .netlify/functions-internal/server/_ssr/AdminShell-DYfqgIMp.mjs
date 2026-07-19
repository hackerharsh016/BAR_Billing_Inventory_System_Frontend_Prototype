import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { A as ChevronDown, D as Circle, M as ChartColumn, N as BookOpen, P as Bell, S as LayoutDashboard, _ as Package, a as Truck, b as LogOut, i as User, j as Check, k as ChevronRight, l as Settings, n as Utensils, p as Receipt, r as Users, u as Search, y as Menu } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminShell-DYfqgIMp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Beer",
	"Whisky",
	"Wine",
	"Cocktails",
	"Food",
	"Mixers"
];
var menuSeed = [
	[
		"Kingfisher Premium",
		"Beer",
		220
	],
	[
		"Bira 91 White",
		"Beer",
		260
	],
	[
		"Corona Extra",
		"Beer",
		380
	],
	[
		"Heineken",
		"Beer",
		340
	],
	[
		"Budweiser Magnum",
		"Beer",
		300
	],
	[
		"Johnnie Walker Black 60ml",
		"Whisky",
		650
	],
	[
		"Glenfiddich 12 60ml",
		"Whisky",
		950
	],
	[
		"Jack Daniel's 60ml",
		"Whisky",
		550
	],
	[
		"Chivas Regal 12 60ml",
		"Whisky",
		600
	],
	[
		"Blenders Pride 60ml",
		"Whisky",
		260
	],
	[
		"Sula Sauvignon Blanc",
		"Wine",
		480
	],
	[
		"Jacob's Creek Shiraz",
		"Wine",
		560
	],
	[
		"Fratelli Cabernet",
		"Wine",
		520
	],
	[
		"Old Monk Mojito",
		"Cocktails",
		320
	],
	[
		"Long Island Iced Tea",
		"Cocktails",
		450
	],
	[
		"Margarita Classic",
		"Cocktails",
		380
	],
	[
		"Whisky Sour",
		"Cocktails",
		400
	],
	[
		"Mojito Virgin",
		"Cocktails",
		220
	],
	[
		"Chicken Tikka",
		"Food",
		380
	],
	[
		"Paneer 65",
		"Food",
		320
	],
	[
		"Chilli Chicken Dry",
		"Food",
		360
	],
	[
		"Veg Manchurian",
		"Food",
		280
	],
	[
		"French Fries",
		"Food",
		180
	],
	[
		"Peanut Masala",
		"Food",
		140
	],
	[
		"Fish Fingers",
		"Food",
		420
	],
	[
		"Chicken Wings",
		"Food",
		400
	],
	[
		"Coke 330ml",
		"Mixers",
		90
	],
	[
		"Sprite 330ml",
		"Mixers",
		90
	],
	[
		"Soda",
		"Mixers",
		60
	],
	[
		"Tonic Water",
		"Mixers",
		120
	]
].map(([name, category, price], i) => ({
	id: `m${i + 1}`,
	name,
	category,
	price,
	active: true
}));
var inventorySeed = [
	[
		"Kingfisher Premium",
		"Beer",
		"Kingfisher",
		"Bottle",
		48,
		24,
		"bottle",
		"1 case = 24 bottles",
		void 0,
		120,
		220,
		"B-KF441",
		45
	],
	[
		"Bira 91 White",
		"Beer",
		"Bira",
		"Bottle",
		12,
		24,
		"bottle",
		"1 case = 24 bottles",
		void 0,
		140,
		260,
		"B-BI982",
		-5
	],
	[
		"Corona Extra",
		"Beer",
		"Corona",
		"Bottle",
		30,
		12,
		"bottle",
		"1 case = 24 bottles",
		void 0,
		200,
		380,
		"B-CR221",
		60
	],
	[
		"Heineken",
		"Beer",
		"Heineken",
		"Bottle",
		8,
		12,
		"bottle",
		"1 case = 24 bottles",
		void 0,
		180,
		340,
		"B-HK889",
		15
	],
	[
		"Johnnie Walker Black",
		"Whisky",
		"JW",
		"Bottle 750ml",
		6,
		4,
		"bottle",
		"1 bottle = 750ml",
		[
			"30ml",
			"60ml",
			"90ml"
		],
		3500,
		6500,
		"B-JW901",
		void 0
	],
	[
		"Glenfiddich 12",
		"Whisky",
		"Glenfiddich",
		"Bottle 750ml",
		2,
		3,
		"bottle",
		"1 bottle = 750ml",
		[
			"30ml",
			"60ml",
			"90ml"
		],
		5500,
		9500,
		"B-GF102",
		void 0
	],
	[
		"Jack Daniel's",
		"Whisky",
		"JD",
		"Bottle 750ml",
		5,
		3,
		"bottle",
		"1 bottle = 750ml",
		[
			"30ml",
			"60ml",
			"90ml"
		],
		3e3,
		5500,
		"B-JD332",
		void 0
	],
	[
		"Blenders Pride",
		"Whisky",
		"Pernod",
		"Bottle 750ml",
		14,
		6,
		"bottle",
		"1 bottle = 750ml",
		[
			"30ml",
			"60ml",
			"90ml"
		],
		1200,
		2600,
		"B-BP110",
		void 0
	],
	[
		"Sula Sauvignon Blanc",
		"Wine",
		"Sula",
		"Bottle 750ml",
		9,
		6,
		"bottle",
		"1 bottle = 750ml",
		void 0,
		300,
		480,
		"B-SL891",
		20
	],
	[
		"Jacob's Creek Shiraz",
		"Wine",
		"Jacob's Creek",
		"Bottle 750ml",
		4,
		6,
		"bottle",
		"1 bottle = 750ml",
		void 0,
		400,
		560,
		"B-JC773",
		90
	],
	[
		"Old Monk Rum",
		"Whisky",
		"Mohan Meakin",
		"Bottle 750ml",
		20,
		6,
		"bottle",
		"1 bottle = 750ml",
		[
			"30ml",
			"60ml",
			"90ml"
		],
		150,
		320,
		"B-OM551",
		void 0
	],
	[
		"Coke 330ml",
		"Mixers",
		"Coca-Cola",
		"Can",
		120,
		48,
		"piece",
		"1 case = 24 cans",
		void 0,
		45,
		90,
		"B-CK211",
		8
	],
	[
		"Sprite 330ml",
		"Mixers",
		"Coca-Cola",
		"Can",
		18,
		48,
		"piece",
		"1 case = 24 cans",
		void 0,
		45,
		90,
		"B-SP552",
		35
	],
	[
		"Tonic Water",
		"Mixers",
		"Schweppes",
		"Bottle",
		40,
		24,
		"bottle",
		"1 case = 24 bottles",
		void 0,
		60,
		120,
		"B-TW091",
		45
	],
	[
		"Soda",
		"Mixers",
		"Kinley",
		"Bottle",
		60,
		24,
		"bottle",
		"1 case = 24 bottles",
		void 0,
		30,
		60,
		"B-SD001",
		100
	]
].map(([name, cat, brand, unit, stock, reorder, unitType, conversion, pegSizes, costPrice, sellingPrice, batchNo, expiryDays], i) => {
	const expiryDate = expiryDays !== void 0 ? new Date((/* @__PURE__ */ new Date()).getTime() + expiryDays * 24 * 60 * 60 * 1e3).toISOString().slice(0, 10) : void 0;
	return {
		id: `i${i + 1}`,
		name,
		category: cat,
		brand,
		unit,
		stock,
		reorder,
		unitType,
		conversion,
		pegSizes,
		costPrice,
		sellingPrice,
		batchNumber: batchNo,
		expiryDate
	};
});
var tablesSeed = Array.from({ length: 10 }, (_, i) => {
	const n = i + 1;
	let status = "Free";
	let order = [];
	if ([
		2,
		5,
		7
	].includes(n)) {
		status = "Occupied";
		order = [{
			itemId: "m1",
			name: "Kingfisher Premium",
			qty: 2,
			rate: 220
		}, {
			itemId: "m19",
			name: "Chicken Tikka",
			qty: 1,
			rate: 380
		}];
	} else if (n === 4) {
		status = "Bill Printed";
		order = [{
			itemId: "m6",
			name: "Johnnie Walker Black 60ml",
			qty: 4,
			rate: 650
		}, {
			itemId: "m23",
			name: "French Fries",
			qty: 1,
			rate: 180
		}];
	}
	return {
		id: `t${n}`,
		number: n,
		status,
		order
	};
});
function daysAgo(d, hours = 20) {
	const t = /* @__PURE__ */ new Date();
	t.setDate(t.getDate() - d);
	t.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
	return t.toISOString();
}
var billSeed = [
	{
		d: 0,
		table: 3,
		items: [[
			"Kingfisher Premium",
			4,
			220
		], [
			"Peanut Masala",
			1,
			140
		]],
		pay: "UPI"
	},
	{
		d: 0,
		table: 6,
		items: [[
			"Blenders Pride 60ml",
			6,
			260
		], [
			"Chicken Tikka",
			2,
			380
		]],
		pay: "Card"
	},
	{
		d: 0,
		table: 1,
		items: [[
			"Bira 91 White",
			3,
			260
		], [
			"French Fries",
			1,
			180
		]],
		pay: "Cash"
	},
	{
		d: 0,
		table: 8,
		items: [[
			"Long Island Iced Tea",
			2,
			450
		], [
			"Fish Fingers",
			1,
			420
		]],
		pay: "UPI"
	},
	{
		d: 0,
		table: 2,
		items: [[
			"Corona Extra",
			4,
			380
		]],
		pay: "Card"
	},
	{
		d: 1,
		table: 5,
		items: [[
			"Johnnie Walker Black 60ml",
			4,
			650
		], [
			"Paneer 65",
			1,
			320
		]],
		pay: "Card"
	},
	{
		d: 1,
		table: 9,
		items: [[
			"Sula Sauvignon Blanc",
			1,
			480
		], [
			"Chilli Chicken Dry",
			1,
			360
		]],
		pay: "UPI"
	},
	{
		d: 1,
		table: 4,
		items: [[
			"Old Monk Rum 60ml",
			3,
			320
		]],
		pay: "Cash"
	},
	{
		d: 2,
		table: 7,
		items: [[
			"Heineken",
			6,
			340
		], [
			"Chicken Wings",
			2,
			400
		]],
		pay: "UPI"
	},
	{
		d: 2,
		table: 3,
		items: [[
			"Margarita Classic",
			2,
			380
		], [
			"Veg Manchurian",
			1,
			280
		]],
		pay: "Card"
	},
	{
		d: 3,
		table: 10,
		items: [[
			"Glenfiddich 12 60ml",
			4,
			950
		]],
		pay: "Card"
	},
	{
		d: 3,
		table: 2,
		items: [[
			"Whisky Sour",
			2,
			400
		], [
			"Fish Fingers",
			1,
			420
		]],
		pay: "Cash"
	},
	{
		d: 3,
		table: 6,
		items: [[
			"Kingfisher Premium",
			5,
			220
		]],
		pay: "UPI"
	},
	{
		d: 4,
		table: 1,
		items: [[
			"Jack Daniel's 60ml",
			4,
			550
		], [
			"Chicken Tikka",
			1,
			380
		]],
		pay: "Card"
	},
	{
		d: 4,
		table: 8,
		items: [[
			"Mojito Virgin",
			3,
			220
		]],
		pay: "UPI"
	},
	{
		d: 5,
		table: 5,
		items: [[
			"Chivas Regal 12 60ml",
			6,
			600
		], [
			"Paneer 65",
			2,
			320
		]],
		pay: "Card"
	},
	{
		d: 5,
		table: 4,
		items: [[
			"Bira 91 White",
			4,
			260
		]],
		pay: "Cash"
	},
	{
		d: 6,
		table: 3,
		items: [[
			"Fratelli Cabernet",
			1,
			520
		], [
			"Chilli Chicken Dry",
			1,
			360
		]],
		pay: "UPI"
	},
	{
		d: 6,
		table: 7,
		items: [[
			"Corona Extra",
			3,
			380
		], [
			"French Fries",
			1,
			180
		]],
		pay: "Card"
	},
	{
		d: 6,
		table: 9,
		items: [[
			"Long Island Iced Tea",
			3,
			450
		]],
		pay: "Card"
	}
].map((b, i) => {
	const items = b.items.map(([n, q, r]) => ({
		itemId: "m0",
		name: n,
		qty: q,
		rate: r
	}));
	const subtotal = items.reduce((s, l) => s + l.qty * l.rate, 0);
	const tax = Math.round(subtotal * .18);
	return {
		id: `b${i + 1}`,
		number: `INV-${String(1e3 + i + 1)}`,
		tableNo: b.table,
		items,
		subtotal,
		tax,
		discount: 0,
		total: subtotal + tax,
		payment: b.pay,
		status: "Paid",
		time: daysAgo(b.d, 12 + i % 10)
	};
});
var staffSeed = [
	{
		id: "s1",
		name: "Rajesh Kumar",
		username: "rajesh",
		role: "Owner",
		active: true,
		lastLogin: daysAgo(0, 10)
	},
	{
		id: "s2",
		name: "Priya Sharma",
		username: "priya",
		role: "Manager",
		active: true,
		lastLogin: daysAgo(0, 14)
	},
	{
		id: "s3",
		name: "Amit Singh",
		username: "amit",
		role: "Captain",
		active: true,
		lastLogin: daysAgo(1, 20)
	},
	{
		id: "s4",
		name: "Vikram Rao",
		username: "vikram",
		role: "Bartender",
		active: true,
		lastLogin: daysAgo(0, 19)
	},
	{
		id: "s5",
		name: "Sneha Nair",
		username: "sneha",
		role: "Cashier",
		active: false,
		lastLogin: daysAgo(5, 15)
	}
];
var purchaseSeed = [{
	id: "p1",
	supplier: "United Breweries Ltd",
	date: daysAgo(2, 11),
	invoiceNo: "UB-4521",
	lines: [{
		itemId: "i1",
		qty: 48,
		cost: 120
	}, {
		itemId: "i2",
		qty: 24,
		cost: 140
	}],
	total: 9120,
	paymentStatus: "Paid",
	amountDue: 0
}, {
	id: "p2",
	supplier: "Pernod Ricard India",
	date: daysAgo(5, 11),
	invoiceNo: "PR-9812",
	lines: [{
		itemId: "i6",
		qty: 6,
		cost: 5500
	}],
	total: 6 * 5500,
	paymentStatus: "Unpaid",
	amountDue: 6 * 5500
}];
var wastageSeed = [
	{
		id: "w1",
		date: daysAgo(3, 15),
		itemId: "i1",
		itemName: "Kingfisher Premium",
		qty: 6,
		reason: "Breakage",
		recordedBy: "Amit Singh",
		notes: "Dropped case while loading bar fridge"
	},
	{
		id: "w2",
		date: daysAgo(8, 22),
		itemId: "i7",
		itemName: "Jack Daniel's",
		qty: 1,
		reason: "Spillage",
		recordedBy: "Vikram Rao",
		notes: "Accidentally spilled shot during high-volume hour"
	},
	{
		id: "w3",
		date: daysAgo(12, 10),
		itemId: "i12",
		itemName: "Coke 330ml",
		qty: 12,
		reason: "Expired",
		recordedBy: "Priya Sharma",
		notes: "Expired cans in back store"
	}
];
var vendorSeed = [
	{
		id: "v1",
		name: "United Breweries Ltd",
		contact: "Rajesh (9845011223)",
		itemsSupplied: ["Kingfisher Premium", "Heineken"],
		amountOutstanding: 14500
	},
	{
		id: "v2",
		name: "Pernod Ricard India",
		contact: "Sanjay (9886033445)",
		itemsSupplied: ["Glenfiddich 12", "Chivas Regal 12"],
		amountOutstanding: 0
	},
	{
		id: "v3",
		name: "Sula Vineyards",
		contact: "Aditi (9731055667)",
		itemsSupplied: ["Sula Sauvignon Blanc", "Fratelli Cabernet"],
		amountOutstanding: 5400
	},
	{
		id: "v4",
		name: "Coca-Cola Beverages",
		contact: "Naresh (9900011224)",
		itemsSupplied: [
			"Coke 330ml",
			"Sprite 330ml",
			"Soda"
		],
		amountOutstanding: 2100
	},
	{
		id: "v5",
		name: "Karnataka State Beverages (KSBCL)",
		contact: "Depot Manager (080-2234000)",
		itemsSupplied: [
			"Johnnie Walker Black",
			"Jack Daniel's",
			"Blenders Pride"
		],
		amountOutstanding: 45e3
	}
];
var auditHistorySeed = [{
	id: "au1",
	date: daysAgo(15, 9),
	conductedBy: "Priya Sharma",
	totalItemsAudited: 15,
	totalVarianceValue: -4200
}, {
	id: "au2",
	date: daysAgo(30, 9),
	conductedBy: "Rajesh Kumar",
	totalItemsAudited: 15,
	totalVarianceValue: -1500
}];
var generateSalesHistory = (inventory) => {
	const history = [];
	const now = /* @__PURE__ */ new Date();
	for (let d = 0; d < 30; d++) {
		const dateStr = (/* @__PURE__ */ new Date(now.getTime() - d * 24 * 60 * 60 * 1e3)).toISOString().slice(0, 10);
		inventory.forEach((item) => {
			if (item.name === "Jacob's Creek Shiraz" || item.name === "Corona Extra") return;
			let baseQty = 0;
			if (item.category === "Beer") baseQty = Math.floor(Math.random() * 8) + 2;
			else if (item.category === "Whisky") baseQty = Math.floor(Math.random() * 3) + 1;
			else if (item.category === "Mixers") baseQty = Math.floor(Math.random() * 12) + 4;
			else baseQty = Math.floor(Math.random() * 3);
			const dayOfWeek = new Date(dateStr).getDay();
			if (dayOfWeek === 5 || dayOfWeek === 6) baseQty = Math.floor(baseQty * 1.5);
			if (baseQty > 0) history.push({
				date: dateStr,
				itemId: item.id,
				qty: baseQty,
				amount: baseQty * (item.sellingPrice ?? 200)
			});
		});
	}
	return history;
};
var state = {
	menu: menuSeed,
	inventory: inventorySeed,
	tables: tablesSeed,
	bills: billSeed,
	purchases: purchaseSeed,
	staff: staffSeed,
	categories: CATEGORIES,
	vendors: vendorSeed,
	wastage: wastageSeed,
	auditHistory: auditHistorySeed,
	salesHistory: generateSalesHistory(inventorySeed),
	settings: {
		venueName: "The Copper Barrel",
		address: "12, MG Road, Bengaluru, KA 560001",
		phone: "+91 98765 43210",
		gstNumber: "29ABCDE1234F1Z5",
		gstRate: 18,
		taxInclusive: false,
		printer: "Epson TM-T82 (USB)"
	}
};
var listeners = /* @__PURE__ */ new Set();
function setState(updater) {
	state = updater(state);
	listeners.forEach((l) => l());
}
function useStore(selector) {
	const [value, setValue] = (0, import_react.useState)(() => selector(state));
	(0, import_react.useEffect)(() => {
		const l = () => setValue(() => selector(state));
		l();
		listeners.add(l);
		return () => {
			listeners.delete(l);
		};
	}, []);
	return value;
}
function updateTable(id, patch) {
	setState((s) => {
		if (patch.number !== void 0 && s.tables.some((t) => t.id !== id && t.number === patch.number)) throw new Error(`Table ${patch.number} already exists`);
		return {
			...s,
			tables: s.tables.map((t) => t.id === id ? {
				...t,
				...patch
			} : t).sort((a, b) => a.number - b.number)
		};
	});
}
function addTable(number) {
	let errorMsg = "";
	setState((s) => {
		if (s.tables.some((t) => t.number === number)) {
			errorMsg = `Table ${number} already exists`;
			return s;
		}
		const newTable = {
			id: `t${Date.now()}`,
			number,
			status: "Free",
			order: []
		};
		return {
			...s,
			tables: [...s.tables, newTable].sort((a, b) => a.number - b.number)
		};
	});
	if (errorMsg) throw new Error(errorMsg);
}
function deleteTable(id) {
	let errorMsg = "";
	setState((s) => {
		const table = s.tables.find((t) => t.id === id);
		if (!table) return s;
		if (table.status !== "Free") {
			errorMsg = `Table ${table.number} is occupied and cannot be deleted`;
			return s;
		}
		return {
			...s,
			tables: s.tables.filter((t) => t.id !== id)
		};
	});
	if (errorMsg) throw new Error(errorMsg);
}
function addOrderLine(tableId, line) {
	setState((s) => ({
		...s,
		tables: s.tables.map((t) => {
			if (t.id !== tableId) return t;
			const order = t.order.find((o) => o.itemId === line.itemId) ? t.order.map((o) => o.itemId === line.itemId ? {
				...o,
				qty: o.qty + line.qty
			} : o) : [...t.order, line];
			return {
				...t,
				order,
				status: "Occupied"
			};
		})
	}));
}
function setOrderQty(tableId, itemId, qty) {
	setState((s) => ({
		...s,
		tables: s.tables.map((t) => t.id !== tableId ? t : {
			...t,
			order: qty <= 0 ? t.order.filter((o) => o.itemId !== itemId) : t.order.map((o) => o.itemId === itemId ? {
				...o,
				qty
			} : o)
		})
	}));
}
function clearOrder(tableId) {
	setState((s) => ({
		...s,
		tables: s.tables.map((t) => t.id === tableId ? {
			...t,
			order: [],
			status: "Free"
		} : t)
	}));
}
function addBill(bill) {
	setState((s) => ({
		...s,
		bills: [bill, ...s.bills]
	}));
}
function addMenuItem(m) {
	setState((s) => ({
		...s,
		menu: [...s.menu, {
			...m,
			id: `m${Date.now()}`
		}]
	}));
}
function updateMenuItem(id, patch) {
	setState((s) => ({
		...s,
		menu: s.menu.map((m) => m.id === id ? {
			...m,
			...patch
		} : m)
	}));
}
function deleteMenuItem(id) {
	setState((s) => ({
		...s,
		menu: s.menu.filter((m) => m.id !== id)
	}));
}
function addInventoryItem(i) {
	setState((s) => ({
		...s,
		inventory: [...s.inventory, {
			...i,
			id: `i${Date.now()}`
		}]
	}));
}
function updateInventoryItem(id, patch) {
	setState((s) => ({
		...s,
		inventory: s.inventory.map((i) => i.id === id ? {
			...i,
			...patch
		} : i)
	}));
}
function deleteInventoryItem(id) {
	setState((s) => ({
		...s,
		inventory: s.inventory.filter((i) => i.id !== id)
	}));
}
function addPurchase(p) {
	setState((s) => {
		const updatedInventory = s.inventory.map((invItem) => {
			const line = p.lines.find((l) => l.itemId === invItem.id);
			if (line) return {
				...invItem,
				stock: invItem.stock + line.qty
			};
			return invItem;
		});
		const amountDue = p.amountDue ?? 0;
		const updatedVendors = s.vendors.map((v) => {
			if (v.name === p.supplier) return {
				...v,
				amountOutstanding: v.amountOutstanding + amountDue
			};
			return v;
		});
		return {
			...s,
			inventory: updatedInventory,
			vendors: updatedVendors,
			purchases: [{
				...p,
				id: `p${Date.now()}`
			}, ...s.purchases]
		};
	});
}
function logWastage(w) {
	setState((s) => {
		const item = s.inventory.find((i) => i.id === w.itemId);
		if (!item) return s;
		const updatedInventory = s.inventory.map((i) => i.id === w.itemId ? {
			...i,
			stock: Math.max(0, i.stock - w.qty)
		} : i);
		const newEntry = {
			...w,
			id: `w${Date.now()}`,
			itemName: item.name
		};
		return {
			...s,
			inventory: updatedInventory,
			wastage: [newEntry, ...s.wastage]
		};
	});
}
function addVendor(v) {
	setState((s) => {
		const newVendor = {
			...v,
			id: `v${Date.now()}`,
			amountOutstanding: 0
		};
		return {
			...s,
			vendors: [...s.vendors, newVendor]
		};
	});
}
function saveStockAudit(conductedBy, countedCounts) {
	setState((s) => {
		let totalItemsAudited = 0;
		let totalVarianceValue = 0;
		const updatedInventory = s.inventory.map((item) => {
			const counted = countedCounts[item.id];
			if (counted !== void 0) {
				totalItemsAudited++;
				const variance = counted - item.stock;
				totalVarianceValue += variance * (item.costPrice ?? 0);
				return {
					...item,
					stock: counted
				};
			}
			return item;
		});
		const newAudit = {
			id: `au${Date.now()}`,
			date: (/* @__PURE__ */ new Date()).toISOString(),
			conductedBy,
			totalItemsAudited,
			totalVarianceValue
		};
		return {
			...s,
			inventory: updatedInventory,
			auditHistory: [newAudit, ...s.auditHistory]
		};
	});
}
function addStaff(st) {
	setState((s) => ({
		...s,
		staff: [...s.staff, {
			...st,
			id: `s${Date.now()}`
		}]
	}));
}
function updateStaff(id, patch) {
	setState((s) => ({
		...s,
		staff: s.staff.map((st) => st.id === id ? {
			...st,
			...patch
		} : st)
	}));
}
function deleteStaff(id) {
	setState((s) => ({
		...s,
		staff: s.staff.filter((st) => st.id !== id)
	}));
}
function updateSettings(patch) {
	setState((s) => ({
		...s,
		settings: {
			...s.settings,
			...patch
		}
	}));
}
function fmtINR(n) {
	return "₹" + n.toLocaleString("en-IN");
}
function inventoryStatus(i) {
	if (i.stock <= 0) return "Out of Stock";
	if (i.stock < i.reorder) return "Low Stock";
	return "In Stock";
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/tables",
		label: "Tables / Orders",
		icon: Utensils
	},
	{
		to: "/billing",
		label: "Billing",
		icon: Receipt
	},
	{
		to: "/inventory",
		label: "Inventory",
		icon: Package
	},
	{
		to: "/purchase",
		label: "Purchase Entry",
		icon: Truck
	},
	{
		to: "/menu",
		label: "Menu Management",
		icon: BookOpen
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/staff",
		label: "Staff",
		icon: Users
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function crumbFor(pathname) {
	if (pathname === "/") return ["Home", "Dashboard"];
	const seg = pathname.split("/").filter(Boolean);
	const map = {
		tables: "Tables / Orders",
		billing: "Billing",
		inventory: "Inventory",
		purchase: "Purchase Entry",
		menu: "Menu Management",
		reports: "Reports",
		staff: "Staff",
		settings: "Settings",
		order: "Order Entry"
	};
	return ["Home", ...seg.map((s) => map[s] ?? s)];
}
function AdminShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(true);
	const inventory = useStore((s) => s.inventory);
	const settings = useStore((s) => s.settings);
	const lowStock = inventory.filter((i) => inventoryStatus(i) !== "In Stock");
	const crumbs = crumbFor(pathname);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `${open ? "w-60" : "w-16"} transition-all duration-200 shrink-0 bg-sidebar-bg text-sidebar-fg flex flex-col`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-14 flex items-center gap-2 px-4 border-b border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm",
						children: "CB"
					}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: "Copper Barrel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-white/50 uppercase tracking-wider",
							children: "Admin Panel"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 py-2 overflow-y-auto",
					children: NAV.map((n) => {
						const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
						const Icon = n.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: `flex items-center gap-3 px-4 py-2 text-sm border-l-[3px] ${active ? "bg-sidebar-hover border-primary text-white" : "border-transparent hover:bg-sidebar-hover hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									size: 16,
									className: "shrink-0"
								}),
								open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label }),
								n.label === "Inventory" && lowStock.length > 0 && open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full",
									children: lowStock.length
								})
							]
						}, n.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-t border-white/10 text-[11px] text-white/40",
					children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "v1.0.0 · Prototype" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "h-14 bg-navbar border-b border-border flex items-center px-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen((o) => !o),
							className: "p-2 hover:bg-muted rounded-sm text-navbar-fg",
							"aria-label": "Toggle sidebar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 18 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "text-xs text-muted-foreground flex items-center gap-1.5",
							children: crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: i === crumbs.length - 1 ? "text-foreground font-medium" : "",
									children: c
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative hidden md:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										size: 14,
										className: "absolute left-2.5 top-2.5 text-muted-foreground"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "Search...",
										className: "pl-8 pr-3 py-1.5 bg-muted border border-border rounded-sm text-sm w-56 focus:outline-none focus:ring-1 focus:ring-primary"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "relative p-2 hover:bg-muted rounded-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 16 }), lowStock.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-semibold",
											children: lowStock.length
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "w-72",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Low Stock Alerts" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										lowStock.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-2 py-4 text-sm text-muted-foreground text-center",
											children: "All stock healthy"
										}),
										lowStock.slice(0, 6).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive font-medium",
												children: i.stock
											})]
										}, i.id))
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-sm text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold",
												children: "RK"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: "Rajesh Kumar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "w-48",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm",
											children: "Rajesh Kumar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-normal",
											children: "Owner"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
											size: 14,
											className: "mr-2"
										}), " Profile"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/login",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
													size: 14,
													className: "mr-2"
												}), " Logout"]
											})
										})
									]
								})] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 pt-3 pb-1 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-semibold",
						children: crumbs[crumbs.length - 1]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: settings.venueName
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 min-w-0",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "border-t border-border py-2 px-4 text-xs text-muted-foreground bg-panel",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						settings.venueName,
						" · Classic Billing UI Prototype"
					]
				})
			]
		})]
	});
}
function Panel({ title, actions, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `admin-panel ${className}`,
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-panel-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title }), actions]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children
		})]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center px-2 py-0.5 rounded-sm border text-[11px] font-medium ${{
			Free: "bg-success/15 text-success border-success/30",
			Occupied: "bg-warning/20 text-warning-foreground border-warning/40",
			"Bill Printed": "bg-info/15 text-info border-info/30",
			Paid: "bg-success/15 text-success border-success/30",
			Pending: "bg-warning/20 text-warning-foreground border-warning/40",
			Active: "bg-success/15 text-success border-success/30",
			Inactive: "bg-muted text-muted-foreground border-border",
			"In Stock": "bg-success/15 text-success border-success/30",
			"Low Stock": "bg-warning/20 text-warning-foreground border-warning/40",
			"Out of Stock": "bg-destructive/15 text-destructive border-destructive/30"
		}[status] || "bg-muted text-muted-foreground border-border"}`,
		children: status
	});
}
//#endregion
export { setState as C, updateStaff as D, updateSettings as E, updateTable as O, setOrderQty as S, updateMenuItem as T, deleteTable as _, addInventoryItem as a, logWastage as b, addPurchase as c, addVendor as d, clearOrder as f, deleteStaff as g, deleteMenuItem as h, addBill as i, useStore as k, addStaff as l, deleteInventoryItem as m, Panel as n, addMenuItem as o, cn as p, StatusBadge as r, addOrderLine as s, AdminShell as t, addTable as u, fmtINR as v, updateInventoryItem as w, saveStockAudit as x, inventoryStatus as y };
