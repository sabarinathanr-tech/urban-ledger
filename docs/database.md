# Urban Ledger — Database Architecture & Documentation

> **Role**: Rohith (Database Engineer)  
> **Project**: Urban Furniture: Accounting System (Odoo Hackathon 2026)  
> **Stack**: PostgreSQL 18, Prisma ORM, TypeScript  
> **Schema Location**: `backend/prisma/schema.prisma`

---

## 1. Executive Summary & Technology Choices

### Why PostgreSQL?
Urban Ledger is an accounting-centric enterprise resource planning (ERP) system. Financial systems demand strict **ACID compliance** (Atomicity, Consistency, Isolation, Durability) to ensure ledger entries, transactions, and balances remain mathematically consistent at all times. PostgreSQL provides:
- Strong relational modeling with enforced primary and foreign key integrity.
- Immediate constraint validation (`UNIQUE`, check constraints, referential triggers).
- Native support for arbitrary-precision numeric types (`NUMERIC`/`DECIMAL`).
- Robust transactional consistency across multi-table journal postings.

### Why `Decimal` for Monetary Amounts?
In accounting systems, floating-point representations (`FLOAT`, `DOUBLE`, JavaScript `number`) use binary representations of fractional numbers, resulting in IEEE 754 precision artifacts (e.g. `0.1 + 0.2 = 0.30000000000000004`). In financial ledgers, rounding drifts cause trial balances and balance sheets to become unbalanced.
- All currency and financial amounts in Urban Ledger use PostgreSQL `DECIMAL(15, 2)` (supporting amounts up to 999 trillion with exact cents/paise precision).
- Tax rates use `DECIMAL(5, 2)` (e.g. `18.00` for 18% GST).
- Product quantities use `DECIMAL(12, 2)` to safely support both discrete units and fractional volume/weight allocations.

---

## 2. Text Entity-Relationship (ER) Diagram

```text
User [ADMIN | ACCOUNTANT | CONTACT]
 ├── (1:1 optional) ── Contact
 └── (1:N) ─────────── Budget (as responsible user)

Contact [CUSTOMER | VENDOR | BOTH]
 ├── (1:1 optional) ── User
 ├── (1:N) ─────────── SalesOrder
 ├── (1:N) ─────────── PurchaseOrder
 ├── (1:N) ─────────── Invoice
 └── (1:N) ─────────── Bill

Product [GOODS | SERVICE | COMBO]
 ├── (1:N) ─────────── SalesOrderLine
 ├── (1:N) ─────────── PurchaseOrderLine
 ├── (1:N) ─────────── InvoiceLine
 └── (1:N) ─────────── BillLine

SalesOrder
 ├── (1:N) ─────────── SalesOrderLine ──> Product
 └── (1:N) ─────────── Invoice

PurchaseOrder
 ├── (1:N) ─────────── PurchaseOrderLine ──> Product
 └── (1:N) ─────────── Bill

Invoice (Customer Invoice)
 ├── (1:N) ─────────── InvoiceLine ──> Product
 ├── (1:N) ─────────── Payment (Cash/Bank)
 └── (1:1 optional) ── JournalEntry (Sales Posting)

Bill (Vendor Bill)
 ├── (1:N) ─────────── BillLine ──> Product
 ├── (1:N) ─────────── Payment (Cash/Bank)
 └── (1:1 optional) ── JournalEntry (Purchase Posting)

Payment
 ├── (N:1) ─────────── Journal (Bank or Cash)
 ├── (N:1 optional) ── Invoice
 ├── (N:1 optional) ── Bill
 └── (1:1 optional) ── JournalEntry (Cash/Bank Posting)

Journal [SALES | PURCHASE | BANK | CASH | MISCELLANEOUS]
 ├── (N:1 optional) ── Default Debit Account
 ├── (N:1 optional) ── Default Credit Account
 ├── (1:N) ─────────── JournalEntry
 └── (1:N) ─────────── Payment

JournalEntry [DRAFT | POSTED | CANCELLED]
 └── (1:N) ─────────── JournalEntryLine
                         ├── (N:1) ── Account (Chart of Accounts)
                         └── (N:1 optional) ── AnalyticAccount

AnalyticAccount [INCOME | EXPENSES]
 ├── (1:N) ─────────── Budget
 └── (1:N) ─────────── JournalEntryLine (Actual Activity)
```

---

## 3. Core Models & Field Definitions

### 3.1 Authentication & Master Data

| Model | Key Fields | Description |
|---|---|---|
| **`User`** | `id`, `name`, `email` (@unique), `passwordHash`, `role` (enum), `isActive`, `contactId` | Internal users (Admin, Accountant) and external Contact logins. Supports soft-activation. |
| **`Contact`** | `id`, `name`, `type` (CUSTOMER/VENDOR/BOTH), `email`, `mobile`, `city`, `state`, `pincode`, `profileImage`, `isActive` | Master directory of business partners. Optional 1-to-1 link with login user. |
| **`Product`** | `id`, `name`, `type` (GOODS/SERVICE/COMBO), `salesPrice`, `purchasePrice`, `category`, `isActive` | Master catalog of goods sold and purchased. Uses `Decimal(15,2)`. |
| **`Account`** | `id`, `name`, `code` (@unique), `type` (ASSET/LIABILITY/EXPENSE/INCOME/CAPITAL), `isActive` | Chart of Accounts categorizing all ledger entries. |
| **`Journal`** | `id`, `name`, `type` (SALES/PURCHASE/BANK/CASH/MISCELLANEOUS), `defaultDebitAccountId`, `defaultCreditAccountId` | Accounting books grouping transaction types. |

### 3.2 Transaction Processing

| Model | Key Fields | Description |
|---|---|---|
| **`SalesOrder`** | `id`, `reference` (@unique), `customerId`, `orderDate`, `status`, `subtotal`, `taxAmount`, `totalAmount` | Commercial sales agreement. Transitions from DRAFT to CONFIRMED to INVOICED. |
| **`SalesOrderLine`** | `id`, `salesOrderId`, `productId`, `quantity`, `unitPrice`, `taxRate`, `lineSubtotal`, `lineTax`, `lineTotal` | Line items with automatic subtotal and tax calculation. |
| **`PurchaseOrder`** | `id`, `reference` (@unique), `vendorId`, `orderDate`, `status`, `subtotal`, `taxAmount`, `totalAmount` | Procurement order to vendors. Transitions to BILLED upon bill generation. |
| **`PurchaseOrderLine`**| `id`, `purchaseOrderId`, `productId`, `quantity`, `unitPrice`, `taxRate`, `lineSubtotal`, `lineTax`, `lineTotal` | Bill of materials/purchased items. |
| **`Invoice`** | `id`, `reference` (@unique), `customerId`, `salesOrderId`, `journalEntryId`, `dueDate`, `status`, `paymentStatus`, `totalAmount`, `paidAmount`, `outstandingAmount` | Official customer billing record. Linked to double-entry journal entry and customer payments. |
| **`InvoiceLine`** | `id`, `invoiceId`, `productId`, `description`, `quantity`, `unitPrice`, `taxRate`, `lineTotal` | Itemized invoice entries. |
| **`Bill`** | `id`, `reference` (@unique), `vendorId`, `purchaseOrderId`, `journalEntryId`, `dueDate`, `status`, `paymentStatus`, `totalAmount`, `paidAmount`, `outstandingAmount` | Vendor invoice payable. Traceable to purchase order and accounting entry. |
| **`BillLine`** | `id`, `billId`, `productId`, `description`, `quantity`, `unitPrice`, `taxRate`, `lineTotal` | Itemized vendor bill charges. |
| **`Payment`** | `id`, `reference` (@unique), `invoiceId?`, `billId?`, `paymentDate`, `amount`, `method` (CASH/BANK), `journalId`, `journalEntryId`, `status` | Liquidity movements settling receivables and payables. |

### 3.3 Accounting & Budgeting

| Model | Key Fields | Description |
|---|---|---|
| **`JournalEntry`** | `id`, `journalId`, `date`, `reference` (@unique), `sourceType`, `sourceId`, `status` (DRAFT/POSTED/CANCELLED) | Primary accounting transaction header. Must satisfy `SUM(debit) == SUM(credit)`. |
| **`JournalEntryLine`** | `id`, `journalEntryId`, `accountId`, `analyticAccountId?`, `description`, `debit`, `credit` | Individual debit or credit ledger booking. |
| **`AnalyticAccount`** | `id`, `name`, `type` (INCOME/EXPENSES) | Cost center / project classification for budget tracking. |
| **`Budget`** | `id`, `name`, `startDate`, `endDate`, `plannedAmount`, `responsibleUserId`, `analyticAccountId` | Target spending or revenue ceiling evaluated against actual journal entry lines. |

---

## 4. Double-Entry Accounting Architecture

### Core Ledger Integrity Rule
Every posted financial event creates an immutable `JournalEntry` with two or more `JournalEntryLine` records satisfying:
$$\sum \text{Debit} = \sum \text{Credit}$$

### 4.1 Customer Sales Flow
1. **Sales Order created**: Commercial agreement saved (`SO-2026-0001`).
2. **Invoice posted**:
   - `Invoice` created with `status: POSTED`, `paymentStatus: UNPAID`.
   - `JournalEntry` posted to **Sales Journal**:
     - **Debit**: `1100 Debtors` (Asset) — Receivables increase.
     - **Credit**: `4000 Sales Income` (Income) — Revenue earned.
3. **Customer Payment received**:
   - `Payment` created with `method: CASH` (or `BANK`).
   - `Invoice` updated: `paidAmount += payment.amount`, `paymentStatus: PAID`.
   - `JournalEntry` posted to **Cash Journal**:
     - **Debit**: `1000 Cash` (Asset) — Cash received.
     - **Credit**: `1100 Debtors` (Asset) — Debtors cleared.

### 4.2 Vendor Purchase Flow
1. **Purchase Order placed**: Procurement agreement with vendor (`PO-2026-0001`).
2. **Vendor Bill posted**:
   - `Bill` created with `status: POSTED`, `paymentStatus: UNPAID`.
   - `JournalEntry` posted to **Purchase Journal**:
     - **Debit**: `5000 Purchases Expense` (Expense, tagged to Analytic Account `Furniture Procurement`).
     - **Credit**: `2000 Creditors` (Liability) — Payables increase.
3. **Vendor Payment made**:
   - `Payment` recorded with `method: BANK`.
   - `Bill` updated: `paidAmount += payment.amount`, `paymentStatus: PAID`.
   - `JournalEntry` posted to **Bank Journal**:
     - **Debit**: `2000 Creditors` (Liability) — Creditors liability cleared.
     - **Credit**: `1010 Bank` (Asset) — Bank account balance decreases.

---

## 5. Report Derivation Queries (No Fake Data Tables)

All reports are computed dynamically from real accounting entries:

### 5.1 Profit & Loss (P&L) Statement
Calculated over a reporting interval $[T_1, T_2]$:
$$\text{Revenue} = \sum_{\text{INCOME}} (\text{Credit} - \text{Debit})$$
$$\text{Operating Expenses} = \sum_{\text{EXPENSE}} (\text{Debit} - \text{Credit})$$
$$\text{Net Profit} = \text{Revenue} - \text{Operating Expenses}$$

### 5.2 Balance Sheet
Calculated as a real-time point-in-time snapshot:
- **Assets**: $\sum_{\text{ASSET}} (\text{Debit} - \text{Credit})$ (Cash, Bank, Debtors, Inventory).
- **Liabilities**: $\sum_{\text{LIABILITY}} (\text{Credit} - \text{Debit})$ (Creditors, Payables).
- **Equity / Capital**: $\sum_{\text{CAPITAL}} (\text{Credit} - \text{Debit}) + \text{Retained Earnings}$.

### 5.3 Budget Report
Evaluated for a specific `Budget` with `[startDate, endDate]`:
$$\text{Planned Amount} = \text{Budget.plannedAmount}$$
$$\text{Actual Spent} = \sum (\text{debit} - \text{credit}) \quad \forall \; \text{lines where } \text{analyticAccountId} = \text{Budget.analyticAccountId}$$
$$\text{Utilization \%} = \frac{\text{Actual Spent}}{\text{Planned Amount}} \times 100\%$$

---

## 6. Teammate Coordination Guides

### 6.1 For Mohith (Backend Developer — APIs & Services)
- **Prisma Client Import**:
  ```typescript
  import { PrismaClient } from '@prisma/client';
  export const prisma = new PrismaClient();
  ```
- **Monetary Types**: Always work with `Prisma.Decimal` or strings when validating through Zod (`z.string().regex(/^\d+(\.\d{1,2})?$/)` or `z.number()`). Never round prematurely.
- **Stable Model Names**: `User`, `Contact`, `Product`, `Account`, `Journal`, `JournalEntry`, `JournalEntryLine`, `SalesOrder`, `SalesOrderLine`, `PurchaseOrder`, `PurchaseOrderLine`, `Invoice`, `InvoiceLine`, `Bill`, `BillLine`, `Payment`, `AnalyticAccount`, `Budget`.
- **Atomic Operations**: Always wrap multi-line postings in a Prisma interactive transaction (`prisma.$transaction(async (tx) => { ... })`).

### 6.2 For Sabari (Frontend Lead — Authentication & Signup)
- **User Authentication**:
  - `POST /api/auth/login`: Accepts `email` and `password`. Returns JWT token with `{ id, email, role, name, contactId }`.
  - `POST /api/auth/signup`: Automatically defaults to `role: CONTACT`. Public signups can never escalate to `ADMIN` or `ACCOUNTANT`.
- **Contact Association**:
  - Creating a Contact in Contact Master can optionally create an associated `User` record by setting `contactId` on the User model.

### 6.3 For Rugenthra (Frontend Developer — Dashboard & Financial Control Center)
The dashboard metrics can be fetched with high performance through index-backed aggregation queries:
- **Revenue**: Sum of credits for `AccountType.INCOME`.
- **Expenses**: Sum of debits for `AccountType.EXPENSE`.
- **Cash & Bank**: Sum of balances for accounts `1000` and `1010`.
- **Receivables**: Sum of `outstandingAmount` on `Invoice` where `status = 'POSTED'` and `paymentStatus != 'PAID'`.
- **Payables**: Sum of `outstandingAmount` on `Bill` where `status = 'POSTED'` and `paymentStatus != 'PAID'`.
- **Recent Transactions**: Query latest `JournalEntry` records joined with lines and accounts.

---

## 7. Database Seeding & Demo Verification

To seed the initial development database and verify end-to-end integrity:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run Database Migration
npx prisma migrate dev --name init_urban_ledger

# 3. Seed Database
npx tsx prisma/seed.ts

# 4. Verify Integrity & Reports
npx tsx prisma/verify.ts
```

### Development Credentials in Seed
- **Admin User**: `admin@urbanfurniture.com` / `Admin@12345`
- **Accountant User**: `accountant@urbanfurniture.com` / `Accountant@12345`
- **Contact User**: `nimesh@pathak.com` / `Contact@12345`
