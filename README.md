# Urban Ledger — Intelligent Accounting-Centric ERP

Urban Ledger is a full-featured, double-entry accounting ERP built for modern businesses. It connects Sales Orders, Purchase Orders, Customer Invoices, Vendor Bills, Cash & Bank Payments, Analytic Budgeting, and Real-Time Financial Statements (P&L, Balance Sheet, General Ledger) with strict double-entry ledger equality.

---

## 🔑 Pre-Configured Demo Credentials

Urban Ledger comes out of the box with 4 designated role accounts (available in both online cloud database and instant offline fallback):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `admin@123` | Full ERP access, User management, System controls |
| **Accountant** | `accountant@gmail.com` | `accountant@123` | Chart of accounts, General Ledger, Journals, Invoices, Bills, Budgets |
| **Customer** | `rohith@gmail.com` | `rohith@123` | Customer portal, quotations, invoices & payment history |
| **Vendor** | `mohit@gmail.com` | `mohit@123` | Vendor portal, purchase orders, bills & settlement receipts |

---

## 🌐 Quickstart for Anyone Cloning the Repository

Anyone who clones this repository can run it immediately without complex environment setups:

### 1. Clone the repository
```bash
git clone https://github.com/sabarinathanr-tech/urban-ledger.git
cd urban-ledger
```

### 2. Install dependencies
```bash
# In frontend
cd frontend
npm install

# In backend
cd ../backend
npm install
```

### 3. Run the Development Servers
```bash
# Terminal 1: Frontend (http://localhost:5173)
cd frontend
npm run dev

# Terminal 2: Backend (http://localhost:5000)
cd backend
npm run dev
```

*Note: The frontend runs with complete mock and offline data out of the box. You can log in immediately using any of the credentials above.*

---

## ☁️ Connecting an Online Cloud Database (Neon / Supabase / Render / Aiven)

To connect Urban Ledger to an online PostgreSQL database accessible from anywhere:

### Step 1: Get a free PostgreSQL URL
Create a free PostgreSQL database on any cloud provider:
- **[Neon](https://neon.tech)** (Recommended — serverless, free, 1-click)
- **[Supabase](https://supabase.com)** (Free tier PostgreSQL)
- **[Aiven](https://aiven.io)** (Free tier PostgreSQL)
- **[Render](https://render.com)** (Free PostgreSQL instance)

Copy your connection string. It will look like:
```env
DATABASE_URL="postgresql://user:password@ep-project-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Step 2: Configure Environment Variable
In `backend/.env` (or copy from `.env.example`):
```env
DATABASE_URL="your-cloud-database-url-here?sslmode=require"
```

### Step 3: Run 1-Click Cloud Setup
In the `backend` folder, run:
```bash
npm run db:cloud:setup
```
This automatically:
1. Pushes the complete Prisma database schema to your online cloud database (`prisma db push`).
2. Seeds Chart of Accounts, Journals, Initial Products, Contacts, and Analytic Accounts.
3. Seeds 100+ realistic transaction records and all 4 demo role accounts (`admin@gmail.com`, `accountant@gmail.com`, `rohith@gmail.com`, `mohit@gmail.com`).

---

## 🛠️ Key Features

- **Double-Entry General Ledger:** Automatic balanced debits and credits on every invoice confirmation, vendor bill posting, and payment registration.
- **Dynamic Chart of Accounts:** Live account editing with custom account codes, categories, and balance adjustments via `PUT /api/accounting/chart-of-accounts/:id`.
- **"Other..." Custom Entries:** When creating Sales Orders, Purchase Orders, Customer Invoices, or Vendor Bills, you can select `➕ Other` from any dropdown to dynamically register custom customers, suppliers, materials, products, or analytic accounts on the fly.
- **Financial Statements:** Live Balance Sheet (Equity & Liabilities vs Assets) and Profit & Loss statement matching Indian accounting and GST compliance.
- **Multi-Role Portals:** Tailored UI dashboards for Admin, Accountant, Customer, and Vendor.
