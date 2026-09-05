# Urban Furniture: Accounting System — Problem Statement

## 1. Overview
An accounting system for Urban Furniture that enables:
- Entry of core master data (Contacts, Products, Chart of Accounts, Budget, Journals)
- Smooth recording of sales, purchases, and payments using the master data.
- Automated generation of financial and stock reports like Balance Sheet, Profit & Loss (P&L), and Budget Report.

## 2. Primary Actors
- **Admin (Business Owner)** — Creates / Modifies / Archives Master Data, Records Transactions and Views Reports.
- **Invoicing User (Accountant)** — Creates Master Data, Records Transactions, Views Reports.
- **Contact** — Contact users can be created when creating Contact Master data. Only view their own invoice/bills and make payment.
- **System** — Automated system actor: validates data, computes taxes, updates ledgers, and generates reports.

## 3. Master Data Modules

### 1. Contact Master
- **Fields**: Name, Type (`Customer` / `Vendor` / `Both`), Email, Mobile, Address (City, State, Pincode), Profile Image.
- **Examples**:
  - Vendor: Rahul Sharma
  - Customer: Nimesh Pathak

### 2. Product Master
- **Fields**: Product Name, Type (`Goods` / `Service` / `Combo`), Sales Price, Cost (Purchase Price), Category.
- **Examples**: Office Chair, Wooden Table, Sofa, Dining Table.

### 3. Chart of Accounts Master
- **Concept**: Chart of Accounts (CoA) is essentially the master list of all ledger accounts used to classify every financial transaction in an organization. Each account in the CoA acts like a category or bucket where related transactions are grouped (e.g., Cash, Bank, Sales Income, Purchase Expense).
- **Fields**: Account Name, Type (`Asset`, `Liability`, `Expense`, `Income`, `Capital`).
- **Examples**:
  - Assets: Cash, Bank, Debtors
  - Liabilities: Creditors
  - Income: Sales Income
  - Expenses: Purchases Expense

### 4. Journal
- **Concept**: A Journal is a record or book used to group and organize similar accounting transactions. Each journal represents a specific type of financial activity, such as sales, purchases, bank transactions, or cash transactions.
- **Fields**: Journal Name, Type, Default Accounts.
- **Examples**:
  - Sales Journal: Customer invoices and sales transactions
  - Purchase Journal: Vendor bills and purchase transactions
  - Bank Journal: Bank-related transactions
  - Cash Journal: Cash receipts and payments

### 5. Journal Entries
- **Concept**: A Journal Entry is the actual accounting record created for a financial transaction. It records the debit and credit accounts along with the amount, ensuring that every transaction follows the double-entry accounting principle (`Total Debits = Total Credits`).
- **Fields**: Journal, Date, Reference, Journal Items (Account, Debit, Credit).
- **Accounting Examples**:
  - Cash received from customer → Debit: Cash, Credit: Debtor
  - Purchase made on credit → Debit: Purchase Expense, Credit: Creditor

## 4. Transaction Flow
Users can use master data to create and link transactions:
1. **Purchase Order**: Select Vendor, Product, Quantity, Unit Price.
2. **Vendor Bill**: Convert PO to Bill (after goods received), record invoice date, due date, and register payment (Cash / Bank).
3. **Sales Order**: Select Customer, Product, Quantity, Unit Price, Tax.
4. **Customer Invoice**: Generate Invoice from SO and receive payment via Cash / Bank.
5. **Payment**: Register against bill/invoice — select Bank or Cash.

## 5. Budget Flow
- **Analytic Account**: Serves as a financial marker to monitor and group expenses or income related to a particular project, department, or business unit. It provides the foundation for evaluating the fiscal success of that specific sector.
  - Fields: Analytic Account name, Type (`Income` / `Expenses`).
- **Budget**: Created by defining the budget period, planned amount, and the relevant analytic account.
  - Fields: Budget Name, Period, Responsible Person, Planned Amount, Relevant Analytic Account.

## 6. Reporting Requirements
After transactions are recorded, the system must generate:
1. **Balance Sheet** — Real-time snapshot of Assets, Liabilities, and Capital.
2. **Profit & Loss Account** — Income from product sales minus purchases/expenses to show net profit.
3. **Budget Report** — Provides an overview of the planned budget and variance.

## 7. Key Use-Case Steps
### 7.1 Create Master Data
1. User creates and maintains the required master data.
2. User adds Contacts, such as Azure Furniture and Nimesh Pathak.
3. User adds Products, such as Wooden Chair.
4. Sets up the Chart of Accounts.

### 7.2 Record a Purchase
1. User creates a Purchase Order for Azure Furniture.
2. Once the goods are received, the user converts the Purchase Order into a Vendor Bill.
3. User records the payment through Bank.

### 7.3 Record a Sale
1. User creates a Sales Order for Nimesh Pathak for 5 Office Chairs.
2. User generates a Customer Invoice.
3. User records the payment through Cash / Bank.

### 7.4 Generate Reports
1. User selects the reporting period.
2. The system generates financial reports:
   - Balance Sheet (Company's assets and liabilities)
   - Profit & Loss Report (Total sales, purchases, expenses, net profit)
   - Budget Report

---
*Mockup Reference: https://app.excalidraw.com/s/65VNwvy7c4X/6ofCsWuwhe*
