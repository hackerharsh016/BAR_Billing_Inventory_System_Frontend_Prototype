# PRD — Bar Billing & Inventory System (Classic Admin UI Prototype)
**For: Lovable.io — Frontend-only prototype**

---

## 1. Overview

**What we're building:** A frontend-only clickable prototype of a billing and inventory management system for a bar/restobar, styled like a classic PHP/Laravel admin panel (the AdminLTE / Laravel Voyager / Bootstrap-admin-template look) — sidebar navigation, top navbar, card-based dashboard widgets, boxed data tables, form panels. This is the familiar, no-frills enterprise admin look most Indian SMB software (Tally, Marg, classic ERP panels) already uses — not a custom-branded consumer product.

**Scope:** Frontend UI only. Use mock/local data (JSON or in-memory state) for everything — no real backend, no real auth, no real database. Every screen should be fully clickable and populated with realistic sample data so it reads as a real, working system.

**Out of scope:** Payment gateway integration, real printer/hardware integration, real authentication, multi-tenant/multi-branch logic.

---

## 2. Design direction — "Classic Admin Panel"

This is a deliberate style choice: **boring, familiar, enterprise-standard** — not a custom design language. The goal is that a bar owner who has used any Windows billing software or a Laravel-based admin panel before should feel instantly at home.

| Element | Direction |
|---|---|
| **Overall look** | Classic boxed admin dashboard — think AdminLTE, Laravel Voyager, CoreUI, Bootstrap admin templates |
| **Layout** | Fixed left sidebar (dark or light, collapsible) + top navbar (breadcrumb, search, user menu, notifications bell) + main content area with card panels |
| **Color palette** | Light background (`#F4F6F9`), white content cards, primary accent blue/indigo (`#3B7DDD` or similar Bootstrap-primary blue), sidebar in dark navy (`#1E2A3A`) or light gray — pick one and stay consistent. Status colors: green (success/paid), yellow (pending), red (danger/low stock) — standard Bootstrap semantic colors |
| **Typography** | System sans-serif stack (Roboto, Inter, or "Segoe UI"-style) — no display fonts, no custom typographic personality. This should look like default Bootstrap, not a branded product |
| **Components** | Standard Bootstrap-style components: bordered/striped data tables with pagination, card widgets with icon + number + label (classic dashboard stat cards), breadcrumbs, badge pills, modal dialogs for add/edit forms, standard form inputs with labels above |
| **Icons** | Simple line icons (Font Awesome / Bootstrap Icons style) |
| **Density** | Compact, information-dense — classic admin panels prioritize data visibility over whitespace |
| **Tone** | Functional and plain. No large hero sections, no marketing-style visuals, no illustrations. This is a back-office tool. |

**Explicitly avoid:** dark mode, custom illustrations, playful microcopy, large decorative typography, card-shadow-heavy "modern SaaS" look, gradients. If in doubt, default to what a stock Laravel admin template would generate.

---

## 3. Pages / Screens

### 3.1 Login
- Centered card on a plain light background, logo, email/username + password fields, "Remember me" checkbox, "Login" button.

### 3.2 Dashboard (Home)
- Row of 4 stat cards: Today's Sales, Open Tables, Low Stock Items, Total Bills Today — each with an icon, big number, and small label (classic AdminLTE "small-box" style).
- Sales trend chart (simple bar or line chart, last 7 days) in a card panel.
- Recent Bills table (last 10 bills: Bill No, Table, Amount, Payment Mode, Status, Time) with a "View" action per row.
- Low Stock Alert panel — list of items below threshold with quantity remaining.

### 3.3 Tables / Order Management
- Grid or list view of all tables — each shown as a simple card or table row with Table No., Status badge (Free / Occupied / Bill Printed), and a "View Order" / "New Order" button.
- Clicking a table opens the **Order Entry** screen.

### 3.4 Order Entry (POS screen)
- Left panel: item selection — category tabs/dropdown (Beer, Whisky, Wine, Cocktails, Food, Mixers) and a searchable item list/table, "Add" button per item.
- Right panel: current order — a simple table of line items (Item, Qty with +/- steppers, Rate, Amount), Subtotal, Tax (GST %), Discount field, Grand Total.
- Bottom action buttons: "Save Order" (KOT), "Print Bill", "Cancel Order".

### 3.5 Billing / Invoice
- Standard invoice-format layout: header with venue name/address/GST no., bill number & date, table number, itemized table (Item, Qty, Rate, Amount), Subtotal/Tax/Discount/Grand Total block, payment mode selector (Cash/Card/UPI, with split option), "Finalize & Print" button.
- After finalizing: a print-preview style invoice view with a "Print" button (browser print dialog is fine for the prototype).

### 3.6 Inventory / Stock
- Standard data table: Item Name, Category, Brand, Unit, Current Stock, Reorder Level, Status badge (In Stock / Low Stock / Out of Stock).
- Search bar + category filter dropdown above the table, pagination below.
- "+ Add Stock Item" button opens a modal form (Name, Category, Brand, Unit, Opening Qty, Reorder Level).
- Row-level "Edit" and "Delete" action icons.

### 3.7 Stock In / Purchase Entry
- Form: Supplier Name, Purchase Date, Invoice No.
- Repeatable line-item table: Item (dropdown), Quantity, Cost per Unit, Amount — with an "Add Row" button.
- Running Total at the bottom, "Save Purchase" button.
- Below the form: a table listing recent purchase entries.

### 3.8 Menu / Item Master
- Data table of sellable items: Name, Category, Price, Status (Active/Inactive toggle switch).
- "+ Add Item" modal form (Name, Category dropdown, Price, Description).
- Standard search + filter + pagination.

### 3.9 Reports
- Tab or dropdown to switch between: Daily Sales Report, Monthly Sales Report, Stock Report.
- Date range picker at top.
- Data table showing the report rows.
- "Export PDF" and "Export Excel" buttons (UI only — button present, click can show a toast/alert for the prototype, no real file generation required).
- Simple summary chart above the table (bar chart for daily/monthly sales).

### 3.10 Staff / Users
- Data table: Name, Role (Owner/Manager/Captain/Bartender/Cashier — shown as badge), Status (Active/Inactive), last login.
- "+ Add Staff" modal form (Name, Username, Role dropdown, Password).
- Edit/Delete row actions.

### 3.11 Settings
- Tabbed or sectioned form panel: 
  - **General**: Venue Name, Address, Phone, GST Number, Logo upload.
  - **Tax Settings**: GST rate(s), tax-inclusive/exclusive toggle.
  - **Printer Settings**: Printer name/device (dropdown — mock list), connection status indicator.
- "Save Changes" button per section.

---

## 4. Navigation structure

Left sidebar menu items, in this order:
1. Dashboard
2. Tables / Orders
3. Billing (recent invoices list)
4. Inventory
5. Purchase Entry
6. Menu Management
7. Reports
8. Staff
9. Settings

Top navbar: breadcrumb (current page path), search icon, notification bell (mock — low stock alerts), user avatar dropdown (Profile / Logout).

---

## 5. Mock data requirements

Seed the prototype with realistic sample data so every screen looks populated on first load:
- ~10 tables (mix of Free / Occupied / Bill Printed statuses)
- ~30 menu items across 5–6 categories with realistic bar pricing (in ₹)
- ~15 inventory items, a few deliberately below reorder level to populate the low-stock states
- ~20 sample past bills/invoices with varying payment modes and amounts, spread across the last 7 days (to populate dashboard charts and reports)
- 5 sample staff members across different roles

---

## 6. Interaction & state notes (frontend-only, no backend)

- All "Save" / "Add" / "Finalize" actions should update local/mock state so the UI reflects the change immediately (e.g., adding a stock item shows up in the inventory table right away; finalizing an order changes the table status from Occupied to Bill Printed).
- Form validation should be basic client-side (required fields, numeric fields) — no server validation needed.
- "Export" and "Print" actions can be stubbed (show a confirmation toast/alert) — no real PDF/Excel generation required for this prototype.
- No real authentication — Login screen can accept any input and redirect to Dashboard, or Lovable can skip auth gating entirely and land directly on Dashboard.

---

## 7. Responsiveness

Primary target: **desktop/laptop browser** (this is a back-office admin tool, used at a billing counter on a PC, tablet, or laptop — not a mobile app). Sidebar should collapse to icons or an off-canvas drawer on smaller/tablet widths. Mobile phone support is not a priority for this prototype.

---

## 8. Acceptance criteria (what "done" looks like for this prototype)

- [ ] All 11 screens listed in Section 3 exist and are reachable via the sidebar
- [ ] Visual style matches the "classic admin panel" direction in Section 2 — light theme, sidebar + navbar layout, standard Bootstrap-style components
- [ ] Every table/list screen loads with realistic mock data, not empty or Lorem Ipsum
- [ ] Order Entry → Billing flow is clickable end-to-end: select table → add items → finalize bill → table status updates
- [ ] Inventory and Menu screens support add via modal form, with the new row appearing in the table immediately
- [ ] Dashboard stat cards and chart reflect the mock data (not hardcoded static numbers unrelated to the mock dataset)
- [ ] Layout is usable at standard laptop width (1366px+) and reasonably functional down to tablet width (~1024px)
