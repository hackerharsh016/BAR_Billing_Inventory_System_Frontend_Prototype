import { useEffect, useState } from "react";

export type TableStatus = "Free" | "Occupied" | "Bill Printed";
export type PaymentMode = "Cash" | "Card" | "UPI";
export type BillStatus = "Paid" | "Pending";
export type Role = "Owner" | "Manager" | "Captain" | "Bartender" | "Cashier";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
  description?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  stock: number;
  reorder: number;
  // Enhanced fields
  unitType?: "bottle" | "case" | "ml" | "kg" | "piece";
  conversion?: string;
  pegSizes?: string[];
  batchNumber?: string;
  expiryDate?: string;
  costPrice?: number;
  sellingPrice?: number;
}

export interface OrderLine {
  itemId: string;
  name: string;
  qty: number;
  rate: number;
}

export interface TableRec {
  id: string;
  number: number;
  status: TableStatus;
  order: OrderLine[];
}

export interface Bill {
  id: string;
  number: string;
  tableNo: number;
  items: OrderLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment: PaymentMode;
  status: BillStatus;
  time: string; // ISO
  cashReceived?: number;
  cashReturned?: number;
}

export interface Purchase {
  id: string;
  supplier: string;
  date: string;
  invoiceNo: string;
  lines: { itemId: string; qty: number; cost: number }[];
  total: number;
  // Enhanced fields
  paymentStatus?: "Paid" | "Partial" | "Unpaid";
  amountDue?: number;
}

export interface Staff {
  id: string;
  name: string;
  username: string;
  role: Role;
  active: boolean;
  lastLogin: string;
}

export interface Settings {
  venueName: string;
  address: string;
  phone: string;
  gstNumber: string;
  gstRate: number;
  taxInclusive: boolean;
  printer: string;
}

// Wastage / Breakage Log types
export type WastageReason = "Breakage" | "Spillage" | "Expired" | "Staff Consumption" | "Complimentary" | "Other";
export interface WastageEntry {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  qty: number;
  reason: WastageReason;
  recordedBy: string;
  notes?: string;
}

// Audit history types
export interface AuditHistoryEntry {
  id: string;
  date: string;
  conductedBy: string;
  totalItemsAudited: number;
  totalVarianceValue: number;
}

// Vendor types
export interface Vendor {
  id: string;
  name: string;
  contact: string;
  itemsSupplied: string[];
  amountOutstanding: number;
}

// Daily sales history for trends
export interface SalesHistoryRecord {
  date: string;
  itemId: string;
  qty: number;
  amount: number;
}

const CATEGORIES = ["Beer", "Whisky", "Wine", "Cocktails", "Food", "Mixers"];

const menuSeed: MenuItem[] = [
  ["Kingfisher Premium", "Beer", 220],
  ["Bira 91 White", "Beer", 260],
  ["Corona Extra", "Beer", 380],
  ["Heineken", "Beer", 340],
  ["Budweiser Magnum", "Beer", 300],
  ["Johnnie Walker Black 60ml", "Whisky", 650],
  ["Glenfiddich 12 60ml", "Whisky", 950],
  ["Jack Daniel's 60ml", "Whisky", 550],
  ["Chivas Regal 12 60ml", "Whisky", 600],
  ["Blenders Pride 60ml", "Whisky", 260],
  ["Sula Sauvignon Blanc", "Wine", 480],
  ["Jacob's Creek Shiraz", "Wine", 560],
  ["Fratelli Cabernet", "Wine", 520],
  ["Old Monk Mojito", "Cocktails", 320],
  ["Long Island Iced Tea", "Cocktails", 450],
  ["Margarita Classic", "Cocktails", 380],
  ["Whisky Sour", "Cocktails", 400],
  ["Mojito Virgin", "Cocktails", 220],
  ["Chicken Tikka", "Food", 380],
  ["Paneer 65", "Food", 320],
  ["Chilli Chicken Dry", "Food", 360],
  ["Veg Manchurian", "Food", 280],
  ["French Fries", "Food", 180],
  ["Peanut Masala", "Food", 140],
  ["Fish Fingers", "Food", 420],
  ["Chicken Wings", "Food", 400],
  ["Coke 330ml", "Mixers", 90],
  ["Sprite 330ml", "Mixers", 90],
  ["Soda", "Mixers", 60],
  ["Tonic Water", "Mixers", 120],
].map(([name, category, price], i) => ({
  id: `m${i + 1}`,
  name: name as string,
  category: category as string,
  price: price as number,
  active: true,
}));

const inventorySeed: InventoryItem[] = [
  // name, category, brand, unit, stock, reorder, unitType, conversion, pegSizes, costPrice, sellingPrice, batchNo, expiryDays
  ["Kingfisher Premium", "Beer", "Kingfisher", "Bottle", 48, 24, "bottle", "1 case = 24 bottles", undefined, 120, 220, "B-KF441", 45],
  ["Bira 91 White", "Beer", "Bira", "Bottle", 12, 24, "bottle", "1 case = 24 bottles", undefined, 140, 260, "B-BI982", -5],
  ["Corona Extra", "Beer", "Corona", "Bottle", 30, 12, "bottle", "1 case = 24 bottles", undefined, 200, 380, "B-CR221", 60],
  ["Heineken", "Beer", "Heineken", "Bottle", 8, 12, "bottle", "1 case = 24 bottles", undefined, 180, 340, "B-HK889", 15],
  ["Johnnie Walker Black", "Whisky", "JW", "Bottle 750ml", 6, 4, "bottle", "1 bottle = 750ml", ["30ml", "60ml", "90ml"], 3500, 6500, "B-JW901", undefined],
  ["Glenfiddich 12", "Whisky", "Glenfiddich", "Bottle 750ml", 2, 3, "bottle", "1 bottle = 750ml", ["30ml", "60ml", "90ml"], 5500, 9500, "B-GF102", undefined],
  ["Jack Daniel's", "Whisky", "JD", "Bottle 750ml", 5, 3, "bottle", "1 bottle = 750ml", ["30ml", "60ml", "90ml"], 3000, 5500, "B-JD332", undefined],
  ["Blenders Pride", "Whisky", "Pernod", "Bottle 750ml", 14, 6, "bottle", "1 bottle = 750ml", ["30ml", "60ml", "90ml"], 1200, 2600, "B-BP110", undefined],
  ["Sula Sauvignon Blanc", "Wine", "Sula", "Bottle 750ml", 9, 6, "bottle", "1 bottle = 750ml", undefined, 300, 480, "B-SL891", 20],
  ["Jacob's Creek Shiraz", "Wine", "Jacob's Creek", "Bottle 750ml", 4, 6, "bottle", "1 bottle = 750ml", undefined, 400, 560, "B-JC773", 90],
  ["Old Monk Rum", "Whisky", "Mohan Meakin", "Bottle 750ml", 20, 6, "bottle", "1 bottle = 750ml", ["30ml", "60ml", "90ml"], 150, 320, "B-OM551", undefined],
  ["Coke 330ml", "Mixers", "Coca-Cola", "Can", 120, 48, "piece", "1 case = 24 cans", undefined, 45, 90, "B-CK211", 8],
  ["Sprite 330ml", "Mixers", "Coca-Cola", "Can", 18, 48, "piece", "1 case = 24 cans", undefined, 45, 90, "B-SP552", 35],
  ["Tonic Water", "Mixers", "Schweppes", "Bottle", 40, 24, "bottle", "1 case = 24 bottles", undefined, 60, 120, "B-TW091", 45],
  ["Soda", "Mixers", "Kinley", "Bottle", 60, 24, "bottle", "1 case = 24 bottles", undefined, 30, 60, "B-SD001", 100],
].map(([name, cat, brand, unit, stock, reorder, unitType, conversion, pegSizes, costPrice, sellingPrice, batchNo, expiryDays], i) => {
  const expiryDate = expiryDays !== undefined
    ? new Date(new Date().getTime() + (expiryDays as number) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    : undefined;
  return {
    id: `i${i + 1}`,
    name: name as string,
    category: cat as string,
    brand: brand as string,
    unit: unit as string,
    stock: stock as number,
    reorder: reorder as number,
    unitType: unitType as any,
    conversion: conversion as string,
    pegSizes: pegSizes as string[],
    costPrice: costPrice as number,
    sellingPrice: sellingPrice as number,
    batchNumber: batchNo as string,
    expiryDate,
  };
});

const tablesSeed: TableRec[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  let status: TableStatus = "Free";
  let order: OrderLine[] = [];
  if ([2, 5, 7].includes(n)) {
    status = "Occupied";
    order = [
      { itemId: "m1", name: "Kingfisher Premium", qty: 2, rate: 220 },
      { itemId: "m19", name: "Chicken Tikka", qty: 1, rate: 380 },
    ];
  } else if (n === 4) {
    status = "Bill Printed";
    order = [
      { itemId: "m6", name: "Johnnie Walker Black 60ml", qty: 4, rate: 650 },
      { itemId: "m23", name: "French Fries", qty: 1, rate: 180 },
    ];
  }
  return { id: `t${n}`, number: n, status, order };
});

function daysAgo(d: number, hours = 20) {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  return t.toISOString();
}

const billSeed: Bill[] = [
  { d: 0, table: 3, items: [["Kingfisher Premium", 4, 220], ["Peanut Masala", 1, 140]], pay: "UPI" as PaymentMode },
  { d: 0, table: 6, items: [["Blenders Pride 60ml", 6, 260], ["Chicken Tikka", 2, 380]], pay: "Card" as PaymentMode },
  { d: 0, table: 1, items: [["Bira 91 White", 3, 260], ["French Fries", 1, 180]], pay: "Cash" as PaymentMode },
  { d: 0, table: 8, items: [["Long Island Iced Tea", 2, 450], ["Fish Fingers", 1, 420]], pay: "UPI" as PaymentMode },
  { d: 0, table: 2, items: [["Corona Extra", 4, 380]], pay: "Card" as PaymentMode },
  { d: 1, table: 5, items: [["Johnnie Walker Black 60ml", 4, 650], ["Paneer 65", 1, 320]], pay: "Card" as PaymentMode },
  { d: 1, table: 9, items: [["Sula Sauvignon Blanc", 1, 480], ["Chilli Chicken Dry", 1, 360]], pay: "UPI" as PaymentMode },
  { d: 1, table: 4, items: [["Old Monk Rum 60ml", 3, 320]], pay: "Cash" as PaymentMode },
  { d: 2, table: 7, items: [["Heineken", 6, 340], ["Chicken Wings", 2, 400]], pay: "UPI" as PaymentMode },
  { d: 2, table: 3, items: [["Margarita Classic", 2, 380], ["Veg Manchurian", 1, 280]], pay: "Card" as PaymentMode },
  { d: 3, table: 10, items: [["Glenfiddich 12 60ml", 4, 950]], pay: "Card" as PaymentMode },
  { d: 3, table: 2, items: [["Whisky Sour", 2, 400], ["Fish Fingers", 1, 420]], pay: "Cash" as PaymentMode },
  { d: 3, table: 6, items: [["Kingfisher Premium", 5, 220]], pay: "UPI" as PaymentMode },
  { d: 4, table: 1, items: [["Jack Daniel's 60ml", 4, 550], ["Chicken Tikka", 1, 380]], pay: "Card" as PaymentMode },
  { d: 4, table: 8, items: [["Mojito Virgin", 3, 220]], pay: "UPI" as PaymentMode },
  { d: 5, table: 5, items: [["Chivas Regal 12 60ml", 6, 600], ["Paneer 65", 2, 320]], pay: "Card" as PaymentMode },
  { d: 5, table: 4, items: [["Bira 91 White", 4, 260]], pay: "Cash" as PaymentMode },
  { d: 6, table: 3, items: [["Fratelli Cabernet", 1, 520], ["Chilli Chicken Dry", 1, 360]], pay: "UPI" as PaymentMode },
  { d: 6, table: 7, items: [["Corona Extra", 3, 380], ["French Fries", 1, 180]], pay: "Card" as PaymentMode },
  { d: 6, table: 9, items: [["Long Island Iced Tea", 3, 450]], pay: "Card" as PaymentMode },
].map((b, i) => {
  const items: OrderLine[] = b.items.map(([n, q, r]) => ({
    itemId: "m0",
    name: n as string,
    qty: q as number,
    rate: r as number,
  }));
  const subtotal = items.reduce((s, l) => s + l.qty * l.rate, 0);
  const tax = Math.round(subtotal * 0.18);
  const discount = 0;
  return {
    id: `b${i + 1}`,
    number: `INV-${String(1000 + i + 1)}`,
    tableNo: b.table,
    items,
    subtotal,
    tax,
    discount,
    total: subtotal + tax,
    payment: b.pay,
    status: "Paid" as BillStatus,
    time: daysAgo(b.d, 12 + (i % 10)),
  };
});

const staffSeed: Staff[] = [
  { id: "s1", name: "Rajesh Kumar", username: "rajesh", role: "Owner", active: true, lastLogin: daysAgo(0, 10) },
  { id: "s2", name: "Priya Sharma", username: "priya", role: "Manager", active: true, lastLogin: daysAgo(0, 14) },
  { id: "s3", name: "Amit Singh", username: "amit", role: "Captain", active: true, lastLogin: daysAgo(1, 20) },
  { id: "s4", name: "Vikram Rao", username: "vikram", role: "Bartender", active: true, lastLogin: daysAgo(0, 19) },
  { id: "s5", name: "Sneha Nair", username: "sneha", role: "Cashier", active: false, lastLogin: daysAgo(5, 15) },
];

const purchaseSeed: Purchase[] = [
  {
    id: "p1",
    supplier: "United Breweries Ltd",
    date: daysAgo(2, 11),
    invoiceNo: "UB-4521",
    lines: [{ itemId: "i1", qty: 48, cost: 120 }, { itemId: "i2", qty: 24, cost: 140 }],
    total: 48 * 120 + 24 * 140,
    paymentStatus: "Paid",
    amountDue: 0,
  },
  {
    id: "p2",
    supplier: "Pernod Ricard India",
    date: daysAgo(5, 11),
    invoiceNo: "PR-9812",
    lines: [{ itemId: "i6", qty: 6, cost: 5500 }],
    total: 6 * 5500,
    paymentStatus: "Unpaid",
    amountDue: 6 * 5500,
  },
];

const wastageSeed: WastageEntry[] = [
  {
    id: "w1",
    date: daysAgo(3, 15),
    itemId: "i1",
    itemName: "Kingfisher Premium",
    qty: 6,
    reason: "Breakage",
    recordedBy: "Amit Singh",
    notes: "Dropped case while loading bar fridge",
  },
  {
    id: "w2",
    date: daysAgo(8, 22),
    itemId: "i7",
    itemName: "Jack Daniel's",
    qty: 1,
    reason: "Spillage",
    recordedBy: "Vikram Rao",
    notes: "Accidentally spilled shot during high-volume hour",
  },
  {
    id: "w3",
    date: daysAgo(12, 10),
    itemId: "i12",
    itemName: "Coke 330ml",
    qty: 12,
    reason: "Expired",
    recordedBy: "Priya Sharma",
    notes: "Expired cans in back store",
  }
];

const vendorSeed: Vendor[] = [
  { id: "v1", name: "United Breweries Ltd", contact: "Rajesh (9845011223)", itemsSupplied: ["Kingfisher Premium", "Heineken"], amountOutstanding: 14500 },
  { id: "v2", name: "Pernod Ricard India", contact: "Sanjay (9886033445)", itemsSupplied: ["Glenfiddich 12", "Chivas Regal 12"], amountOutstanding: 0 },
  { id: "v3", name: "Sula Vineyards", contact: "Aditi (9731055667)", itemsSupplied: ["Sula Sauvignon Blanc", "Fratelli Cabernet"], amountOutstanding: 5400 },
  { id: "v4", name: "Coca-Cola Beverages", contact: "Naresh (9900011224)", itemsSupplied: ["Coke 330ml", "Sprite 330ml", "Soda"], amountOutstanding: 2100 },
  { id: "v5", name: "Karnataka State Beverages (KSBCL)", contact: "Depot Manager (080-2234000)", itemsSupplied: ["Johnnie Walker Black", "Jack Daniel's", "Blenders Pride"], amountOutstanding: 45000 },
];

const auditHistorySeed: AuditHistoryEntry[] = [
  { id: "au1", date: daysAgo(15, 9), conductedBy: "Priya Sharma", totalItemsAudited: 15, totalVarianceValue: -4200 },
  { id: "au2", date: daysAgo(30, 9), conductedBy: "Rajesh Kumar", totalItemsAudited: 15, totalVarianceValue: -1500 },
];

const generateSalesHistory = (inventory: InventoryItem[]): SalesHistoryRecord[] => {
  const history: SalesHistoryRecord[] = [];
  const now = new Date();
  for (let d = 0; d < 30; d++) {
    const dateStr = new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    inventory.forEach((item) => {
      if (item.name === "Jacob's Creek Shiraz" || item.name === "Corona Extra") {
        return; // Dead stock (zero sales)
      }
      let baseQty = 0;
      if (item.category === "Beer") baseQty = Math.floor(Math.random() * 8) + 2;
      else if (item.category === "Whisky") baseQty = Math.floor(Math.random() * 3) + 1;
      else if (item.category === "Mixers") baseQty = Math.floor(Math.random() * 12) + 4;
      else baseQty = Math.floor(Math.random() * 3);

      const dayOfWeek = new Date(dateStr).getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        baseQty = Math.floor(baseQty * 1.5);
      }
      if (baseQty > 0) {
        history.push({
          date: dateStr,
          itemId: item.id,
          qty: baseQty,
          amount: baseQty * (item.sellingPrice ?? 200),
        });
      }
    });
  }
  return history;
};

interface State {
  menu: MenuItem[];
  inventory: InventoryItem[];
  tables: TableRec[];
  bills: Bill[];
  purchases: Purchase[];
  staff: Staff[];
  settings: Settings;
  categories: string[];
  vendors: Vendor[];
  wastage: WastageEntry[];
  auditHistory: AuditHistoryEntry[];
  salesHistory: SalesHistoryRecord[];
}

let state: State = {
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
    printer: "Epson TM-T82 (USB)",
  },
};

const listeners = new Set<() => void>();

export function getState() {
  return state;
}

export function setState(updater: (s: State) => State) {
  state = updater(state);
  listeners.forEach((l) => l());
}

export function useStore<T>(selector: (s: State) => T): T {
  const [value, setValue] = useState(() => selector(state));
  useEffect(() => {
    const l = () => setValue(() => selector(state));
    l();
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

// Mutations
export function updateTable(id: string, patch: Partial<TableRec>) {
  setState((s) => {
    // If number is changing, check for duplicates
    if (patch.number !== undefined && s.tables.some((t) => t.id !== id && t.number === patch.number)) {
      throw new Error(`Table ${patch.number} already exists`);
    }
    return {
      ...s,
      tables: s.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)).sort((a, b) => a.number - b.number)
    };
  });
}

export function addTable(number: number) {
  let errorMsg = "";
  setState((s) => {
    if (s.tables.some((t) => t.number === number)) {
      errorMsg = `Table ${number} already exists`;
      return s;
    }
    const newTable: TableRec = {
      id: `t${Date.now()}`,
      number,
      status: "Free",
      order: [],
    };
    return {
      ...s,
      tables: [...s.tables, newTable].sort((a, b) => a.number - b.number),
    };
  });
  if (errorMsg) {
    throw new Error(errorMsg);
  }
}

export function deleteTable(id: string) {
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
      tables: s.tables.filter((t) => t.id !== id),
    };
  });
  if (errorMsg) {
    throw new Error(errorMsg);
  }
}

export function addOrderLine(tableId: string, line: OrderLine) {
  setState((s) => ({
    ...s,
    tables: s.tables.map((t) => {
      if (t.id !== tableId) return t;
      const existing = t.order.find((o) => o.itemId === line.itemId);
      const order = existing
        ? t.order.map((o) => (o.itemId === line.itemId ? { ...o, qty: o.qty + line.qty } : o))
        : [...t.order, line];
      return { ...t, order, status: "Occupied" };
    }),
  }));
}

export function setOrderQty(tableId: string, itemId: string, qty: number) {
  setState((s) => ({
    ...s,
    tables: s.tables.map((t) =>
      t.id !== tableId
        ? t
        : {
            ...t,
            order: qty <= 0 ? t.order.filter((o) => o.itemId !== itemId) : t.order.map((o) => (o.itemId === itemId ? { ...o, qty } : o)),
          },
    ),
  }));
}

export function clearOrder(tableId: string) {
  setState((s) => ({
    ...s,
    tables: s.tables.map((t) => (t.id === tableId ? { ...t, order: [], status: "Free" } : t)),
  }));
}

export function addBill(bill: Bill) {
  setState((s) => ({ ...s, bills: [bill, ...s.bills] }));
}

export function addMenuItem(m: Omit<MenuItem, "id">) {
  setState((s) => ({ ...s, menu: [...s.menu, { ...m, id: `m${Date.now()}` }] }));
}
export function updateMenuItem(id: string, patch: Partial<MenuItem>) {
  setState((s) => ({ ...s, menu: s.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
}
export function deleteMenuItem(id: string) {
  setState((s) => ({ ...s, menu: s.menu.filter((m) => m.id !== id) }));
}

export function addInventoryItem(i: Omit<InventoryItem, "id">) {
  setState((s) => ({ ...s, inventory: [...s.inventory, { ...i, id: `i${Date.now()}` }] }));
}
export function updateInventoryItem(id: string, patch: Partial<InventoryItem>) {
  setState((s) => ({ ...s, inventory: s.inventory.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
}
export function deleteInventoryItem(id: string) {
  setState((s) => ({ ...s, inventory: s.inventory.filter((i) => i.id !== id) }));
}

export function addPurchase(p: Omit<Purchase, "id">) {
  setState((s) => {
    // 1. Increment stocks
    const updatedInventory = s.inventory.map((invItem) => {
      const line = p.lines.find((l) => l.itemId === invItem.id);
      if (line) {
        return { ...invItem, stock: invItem.stock + line.qty };
      }
      return invItem;
    });

    // 2. Update vendor amountOutstanding
    const amountDue = p.amountDue ?? 0;
    const updatedVendors = s.vendors.map((v) => {
      if (v.name === p.supplier) {
        return { ...v, amountOutstanding: v.amountOutstanding + amountDue };
      }
      return v;
    });

    return {
      ...s,
      inventory: updatedInventory,
      vendors: updatedVendors,
      purchases: [{ ...p, id: `p${Date.now()}` }, ...s.purchases],
    };
  });
}

export function logWastage(w: Omit<WastageEntry, "id" | "itemName">) {
  setState((s) => {
    const item = s.inventory.find((i) => i.id === w.itemId);
    if (!item) return s;

    // Deduct quantity from stock
    const updatedInventory = s.inventory.map((i) =>
      i.id === w.itemId ? { ...i, stock: Math.max(0, i.stock - w.qty) } : i
    );

    const newEntry: WastageEntry = {
      ...w,
      id: `w${Date.now()}`,
      itemName: item.name,
    };

    return {
      ...s,
      inventory: updatedInventory,
      wastage: [newEntry, ...s.wastage],
    };
  });
}

export function addVendor(v: Omit<Vendor, "id" | "amountOutstanding">) {
  setState((s) => {
    const newVendor: Vendor = {
      ...v,
      id: `v${Date.now()}`,
      amountOutstanding: 0,
    };
    return {
      ...s,
      vendors: [...s.vendors, newVendor],
    };
  });
}

export function saveStockAudit(conductedBy: string, countedCounts: Record<string, number>) {
  setState((s) => {
    let totalItemsAudited = 0;
    let totalVarianceValue = 0;

    const updatedInventory = s.inventory.map((item) => {
      const counted = countedCounts[item.id];
      if (counted !== undefined) {
        totalItemsAudited++;
        const variance = counted - item.stock;
        totalVarianceValue += variance * (item.costPrice ?? 0);
        return { ...item, stock: counted };
      }
      return item;
    });

    const newAudit: AuditHistoryEntry = {
      id: `au${Date.now()}`,
      date: new Date().toISOString(),
      conductedBy,
      totalItemsAudited,
      totalVarianceValue,
    };

    return {
      ...s,
      inventory: updatedInventory,
      auditHistory: [newAudit, ...s.auditHistory],
    };
  });
}

export function addStaff(st: Omit<Staff, "id">) {
  setState((s) => ({ ...s, staff: [...s.staff, { ...st, id: `s${Date.now()}` }] }));
}
export function updateStaff(id: string, patch: Partial<Staff>) {
  setState((s) => ({ ...s, staff: s.staff.map((st) => (st.id === id ? { ...st, ...patch } : st)) }));
}
export function deleteStaff(id: string) {
  setState((s) => ({ ...s, staff: s.staff.filter((st) => st.id !== id) }));
}

export function updateSettings(patch: Partial<Settings>) {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

export function fmtINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function inventoryStatus(i: InventoryItem): "In Stock" | "Low Stock" | "Out of Stock" {
  if (i.stock <= 0) return "Out of Stock";
  if (i.stock < i.reorder) return "Low Stock";
  return "In Stock";
}
