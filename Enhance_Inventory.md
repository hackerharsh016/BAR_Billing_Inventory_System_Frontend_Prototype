# Prompt — Enhance Inventory Section (Bar Billing System)

Paste this into your existing Lovable.io project (the same one built from `PRD_Classic_Billing_UI.md`). It extends the current Inventory screen — keep the same classic admin panel style (light theme, sidebar/navbar, Bootstrap-style tables and cards, standard form modals) already used across the app. Frontend-only — use mock/local state, no real backend.

---

## Context

The current Inventory section has a basic stock list (Item Name, Category, Brand, Unit, Current Stock, Reorder Level, Status badge) with Add/Edit/Delete. Enhance it into a full inventory module by adding the sub-sections below as new tabs or sidebar sub-menu items under "Inventory" (use a tabbed layout within the Inventory page, or a sub-menu — whichever fits the existing nav pattern better).

---

## 1. Stock Master (enhance existing list)

Add these fields to the existing item form and table:
- Unit type (bottle / case / ml / kg / piece) with a conversion field — e.g. "1 case = 12 bottles", "1 bottle = 750ml"
- Peg size options per item (30ml / 60ml / 90ml) for liquor items only — used to auto-deduct stock when a peg is sold in the POS/Order screen
- Batch number and expiry date fields (optional, relevant for wine/mixers/perishables — leave blank for spirits that don't expire)
- Cost price and selling price (for valuation reporting later)

Table should now support: search, category filter, brand filter, and a status filter (In Stock / Low Stock / Out of Stock / Near Expiry).

---

## 2. Wastage / Breakage Log

New sub-tab: "Wastage Log"
- Table: Date, Item, Quantity, Reason (dropdown: Breakage / Spillage / Expired / Staff Consumption / Complimentary / Other), Recorded By, Notes.
- "+ Log Wastage" button opens a modal form with those fields.
- Logging a wastage entry should deduct the quantity from that item's current stock in mock state, same as a sale would.
- Small summary card at top: "Total wastage this month" (value in ₹, calculated from cost price × wasted qty).

---

## 3. Stock Audit / Reconciliation

New sub-tab: "Stock Audit"
- "+ Start New Audit" button generates a table pre-filled with every inventory item and its current *system* stock quantity.
- Each row has an editable "Counted Quantity" field (what staff physically counted).
- A "Variance" column auto-calculates (Counted − System), color-coded: green if 0, amber if small variance, red if large variance.
- "Save Audit" button locks the audit, updates system stock to match counted stock, and adds an entry to an "Audit History" table below (Date, Conducted By, Total Items Audited, Total Variance Value).

---

## 4. Vendor / Purchase Enhancements

Enhance the existing Purchase Entry screen:
- Add a "Vendors" sub-tab: table of vendors (Name, Contact, Items Supplied, Total Purchases This Month, Amount Outstanding), with "+ Add Vendor" modal.
- On the Purchase Entry form, the Supplier field should be a dropdown pulling from the Vendor list (not free text).
- Add a "Payment Status" field to each purchase entry (Paid / Partial / Unpaid) and an "Amount Due" column in the purchase history table.

---

## 5. Alerts & Reorder Suggestions

New sub-tab: "Reorder Suggestions"
- Auto-generated table (from mock data) listing every item currently below its reorder threshold: Item, Current Stock, Reorder Level, Suggested Reorder Qty (simple mock logic: reorder level × 2, minus current stock), Last Vendor.
- "Create Purchase Order" button next to each row (or a "Select All → Create PO" bulk action) that pre-fills a new Purchase Entry form with that item.
- Also show a small badge/counter on the main Inventory nav item indicating how many items need reordering (e.g. a red "5" badge), consistent with the notification-bell pattern already used in the top navbar.

---

## 6. Expiry Tracking

Within the Stock Master table, add a filter/tab view: "Near Expiry" — shows items with an expiry date within the next 30 days, sorted soonest-first, with a garnet/red badge for items already expired and amber for items expiring within 7 days.

---

## 7. Reports (extend the existing Reports section, or add here)

Add these as new report types (reuse the existing Reports page's tab/dropdown pattern):
- **Stock Valuation Report** — table of all items with Current Stock × Cost Price = Value, plus a grand total at the bottom ("Total stock value: ₹X").
- **Consumption Trend Report** — for a selected item, show a simple bar chart of daily/weekly quantity sold over the last 30 days (use mock historical data).
- **Dead Stock Report** — table of items with zero sales in the last 30 days (from mock sales history), sorted by how long they've been sitting.
- **Excise-Style Stock Register** — a formal table format: Item, Opening Stock, Purchased (Stock In), Sold, Wastage, Closing Stock — for a selected date range. This should visually resemble a compliance register (bordered table, print-friendly layout) since it may need to be shown to excise inspectors.

---

## 8. Mock data notes

Extend the existing mock dataset so these new features have realistic data to display on first load:
- A few wastage log entries across the last 2 weeks
- At least one completed stock audit in history, with a couple of items showing non-zero variance (to demonstrate the color coding)
- 4–5 vendors, with a couple of purchase entries marked "Unpaid" or "Partial" so the outstanding-amount column isn't empty
- 3–4 items deliberately below reorder level (for the Reorder Suggestions tab)
- 2–3 items with an expiry date within the next 30 days, and one already expired
- 30 days of mock daily sales quantities per item (needed for Consumption Trend and Dead Stock reports)

---

## 9. Interaction rules (keep consistent with rest of app)

- All new "Save"/"Log"/"Add" actions update local mock state immediately, same pattern as the rest of the app.
- Variance, valuation, and reorder-suggestion numbers should be *calculated from* the mock data (not hardcoded), so changing an item's stock or cost elsewhere in the app updates these views too.
- Keep every new table/list following the same design system already established: bordered/striped tables, badge pills for status, modal forms for add/edit, standard pagination.
- Every new sub-section needs a proper empty state if its mock data were ever removed (e.g. "No wastage logged yet").

---

## 10. Acceptance criteria

- [ ] Inventory section now has sub-tabs/sub-menu for: Stock Master, Wastage Log, Stock Audit, Vendors, Reorder Suggestions, Near Expiry
- [ ] Wastage entries deduct from stock and show up in the monthly wastage total
- [ ] Stock Audit flow works end-to-end: start audit → enter counts → see variance → save → stock updates → audit appears in history
- [ ] Reorder Suggestions table correctly reflects items below threshold from mock data
- [ ] Stock Valuation, Consumption Trend, Dead Stock, and Excise Register reports are accessible from Reports and populated with mock data
- [ ] Visual style matches the rest of the app — no new colors/fonts/components introduced outside the established design system
