# Urban Ledger - API Documentation & Frontend Contracts

> **Audience**: Sabari (Frontend Lead - Auth), Rugenthra (Frontend Developer - Dashboard), Rohith (Database / Prisma Owner)  
> **Author**: Mohith (Backend Developer)  
> **Milestone**: Backend Architecture & Foundation (Odoo Hackathon 2026)  
> **Base URL**: `http://localhost:5000/api`

---

## Global Standards

### Headers
- **Content-Type**: `application/json`
- **Authorization**: `Bearer <JWT_TOKEN>` (for protected endpoints)

### Standard Success Response
All successful responses return HTTP status code `200` (or `201` for creations) with:
```json
{
  "success": true,
  "message": "Human readable status description",
  "data": {}
}
```

### Standard Error Response
All error responses return HTTP status code `4xx` or `5xx` with:
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": []
  }
}
```

### Standard Error Codes
| Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `VALIDATION_ERROR` | 400 | Request body or query parameters failed Zod schema validation |
| `BAD_REQUEST` | 400 | Malformed request or missing parameters |
| `AUTHENTICATION_REQUIRED` | 401 | Missing Bearer token in `Authorization` header |
| `TOKEN_INVALID` | 401 | Invalid or corrupted JWT token |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INVALID_CREDENTIALS` | 401 | Incorrect email or password during login |
| `FORBIDDEN` | 403 | Authenticated user is forbidden from resource |
| `INSUFFICIENT_PERMISSIONS`| 403 | User role does not have permission for the endpoint |
| `ACCOUNT_INACTIVE` | 403 | User account is inactive |
| `NOT_FOUND` | 404 | Requested entity or route was not found |
| `USER_EXISTS` / `CONFLICT`| 409 | Duplicate unique key (e.g. email already exists) |
| `INTERNAL_ERROR` | 500 | Unexpected server error (safe error returned to client) |

---

## System Health

### 1. Health Check
Checks backend operational status.

- **Method**: `GET`
- **URL**: `/health`
- **Authentication**: None
- **Allowed Roles**: Public
- **Request Body**: None

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Urban Ledger API is running",
  "data": {
    "status": "healthy",
    "environment": "development",
    "timestamp": "2026-09-05T10:13:41.539Z"
  }
}
```

---

## Authentication Endpoints (For Sabari)

### 2. Public User Signup
Registers a public user into the system. Role is safely and strictly assigned to `CONTACT`. Self-assignment to `ADMIN` or `ACCOUNTANT` is strictly prevented by the backend.

- **Method**: `POST`
- **URL**: `/auth/signup`
- **Authentication**: None
- **Allowed Roles**: Public

#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "mobile": "+91 9876543210",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```
*Constraints*:
- `name`: min 2 characters, max 100
- `email`: valid email address format (automatically normalized to lowercase)
- `mobile`: optional valid phone number format
- `password`: min 8 characters, at least 1 letter and 1 number
- `confirmPassword`: must match `password`

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "usr_1725531000_abcde",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "mobile": "+91 9876543210",
      "role": "CONTACT",
      "status": "ACTIVE",
      "contact": {
        "id": "cnt_1725531000_fghij",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "mobile": "+91 9876543210",
        "type": "CUSTOMER",
        "status": "ACTIVE"
      },
      "createdAt": "2026-09-05T10:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Common Errors
- `400 Bad Request`: `VALIDATION_ERROR` (passwords do not match, weak password, invalid email)
- `409 Conflict`: `USER_EXISTS` ("An account with this email already exists.")

---

### 3. User Login
Authenticates an existing user and returns JWT token.

- **Method**: `POST`
- **URL**: `/auth/login`
- **Authentication**: None
- **Allowed Roles**: Public

#### Request Body
```json
{
  "email": "jane.doe@example.com",
  "password": "Password123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User authenticated successfully",
  "data": {
    "user": {
      "id": "usr_1725531000_abcde",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "mobile": "+91 9876543210",
      "role": "CONTACT",
      "status": "ACTIVE",
      "contact": {
        "id": "cnt_1725531000_fghij",
        "name": "Jane Doe",
        "type": "CUSTOMER",
        "status": "ACTIVE"
      },
      "createdAt": "2026-09-05T10:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Common Errors
- `400 Bad Request`: `VALIDATION_ERROR` (missing email or password)
- `401 Unauthorized`: `INVALID_CREDENTIALS` ("Invalid email or password.")
- `403 Forbidden`: `ACCOUNT_INACTIVE` ("Account is inactive. Please contact your system administrator.")

---

### 4. User Logout
Invalidates user session on client side.

- **Method**: `POST`
- **URL**: `/auth/logout`
- **Authentication**: Optional
- **Allowed Roles**: Any

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

### 5. Current User Profile
Fetches currently logged-in user profile from session.

- **Method**: `GET`
- **URL**: `/auth/me`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`, `CONTACT`
- **Request Body**: None

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Current user profile retrieved successfully",
  "data": {
    "user": {
      "id": "usr_1725531000_abcde",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "mobile": "+91 9876543210",
      "role": "CONTACT",
      "status": "ACTIVE",
      "contact": {
        "id": "cnt_1725531000_fghij",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "mobile": "+91 9876543210",
        "type": "CUSTOMER",
        "status": "ACTIVE"
      },
      "createdAt": "2026-09-05T10:15:00.000Z"
    }
  }
}
```

#### Common Errors
- `401 Unauthorized`: `AUTHENTICATION_REQUIRED`, `TOKEN_INVALID`, `TOKEN_EXPIRED`
- `404 Not Found`: `NOT_FOUND` ("User not found.")

---

## User Management Endpoints (Internal / Admin)

### 6. Create Internal User
Enables `ADMIN` users to provision staff or contact accounts with role enforcement.

- **Method**: `POST`
- **URL**: `/users`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN` only

#### Request Body
```json
{
  "name": "Priya Sharma",
  "email": "priya.accountant@urbanledger.com",
  "mobile": "+91 9123456780",
  "password": "Password123",
  "role": "ACCOUNTANT",
  "contactType": "CUSTOMER"
}
```
*Field Options*:
- `role`: `"ADMIN"` | `"ACCOUNTANT"` | `"CONTACT"`
- `contactType`: `"CUSTOMER"` | `"VENDOR"` | `"BOTH"` (optional, applicable if `role` is `"CONTACT"`)

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "usr_1725532000_xyz12",
      "name": "Priya Sharma",
      "email": "priya.accountant@urbanledger.com",
      "mobile": "+91 9123456780",
      "role": "ACCOUNTANT",
      "status": "ACTIVE",
      "contact": null,
      "createdAt": "2026-09-05T10:20:00.000Z",
      "updatedAt": "2026-09-05T10:20:00.000Z"
    }
  }
}
```

#### Common Errors
- `400 Bad Request`: `VALIDATION_ERROR` (invalid role or input constraints)
- `401 Unauthorized`: `AUTHENTICATION_REQUIRED`
- `403 Forbidden`: `INSUFFICIENT_PERMISSIONS` (caller is not `ADMIN`)
- `409 Conflict`: `USER_EXISTS` ("An account with this email already exists.")

---

### 7. List Users
Retrieves paginated user accounts with role filtering.

- **Method**: `GET`
- **URL**: `/users?page=1&limit=10&role=ACCOUNTANT&search=priya`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN` only

#### Query Parameters
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 100)
- `role`: `"ADMIN"` | `"ACCOUNTANT"` | `"CONTACT"` (optional)
- `search`: string (matches name or email, optional)

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": "usr_1725532000_xyz12",
        "name": "Priya Sharma",
        "email": "priya.accountant@urbanledger.com",
        "mobile": "+91 9123456780",
        "role": "ACCOUNTANT",
        "status": "ACTIVE",
        "contact": null,
        "createdAt": "2026-09-05T10:20:00.000Z",
        "updatedAt": "2026-09-05T10:20:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

## Dashboard Endpoints (For Rugenthra)

> [!IMPORTANT]
> **Dashboard Access Control**: All `/dashboard/*` endpoints are strictly reserved for **`ADMIN`** and **`ACCOUNTANT`** roles. Any request by a `CONTACT` user returns **`403 Forbidden`**.

---

### 8. Financial Summary
Returns high-level KPI cards for the Financial Control Center.

- **Method**: `GET`
- **URL**: `/dashboard/summary`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`
- **Request Body**: None

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "revenue": 1425000,
    "expenses": 890000,
    "netProfit": 535000,
    "cashAndBank": 620000,
    "receivables": 340000,
    "payables": 185000
  }
}
```

---

### 9. Revenue & Expense Trend
Returns monthly/quarterly time-series financial comparison data for bar/area charts.

- **Method**: `GET`
- **URL**: `/dashboard/revenue-expense?period=month&limit=6`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`

#### Query Parameters
- `period`: `"month"` | `"quarter"` | `"year"` (default: `"month"`)
- `limit`: number (default: 6)

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Revenue and expense trend retrieved successfully",
  "data": [
    { "period": "2026-04", "revenue": 620000, "expenses": 410000 },
    { "period": "2026-05", "revenue": 710000, "expenses": 460000 },
    { "period": "2026-06", "revenue": 790000, "expenses": 510000 },
    { "period": "2026-07", "revenue": 830000, "expenses": 540000 },
    { "period": "2026-08", "revenue": 910000, "expenses": 580000 },
    { "period": "2026-09", "revenue": 840000, "expenses": 520000 }
  ]
}
```

---

### 10. Budget Health
Returns current budget utilization progress and health threshold status.

- **Method**: `GET`
- **URL**: `/dashboard/budget-health`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Budget health metrics retrieved successfully",
  "data": {
    "budgetName": "Q3 2026 Operations & Showroom Budget",
    "plannedAmount": 1500000,
    "actualAmount": 1120000,
    "remainingAmount": 380000,
    "utilizationPercent": 74.67,
    "status": "HEALTHY"
  }
}
```
*Status Values*:
- `"HEALTHY"` (< 85% utilization)
- `"WARNING"` (85% - 100% utilization)
- `"EXCEEDED"` (> 100% utilization)

---

### 11. Accounts Receivable Summary
Returns receivables breakdown and overdue tracking.

- **Method**: `GET`
- **URL**: `/dashboard/receivables`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Receivables summary retrieved successfully",
  "data": {
    "outstanding": 340000,
    "overdue": 85000,
    "openInvoices": 12
  }
}
```

---

### 12. Accounts Payable Summary
Returns payables breakdown and vendor bill obligations.

- **Method**: `GET`
- **URL**: `/dashboard/payables`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Payables summary retrieved successfully",
  "data": {
    "outstanding": 185000,
    "overdue": 32000,
    "openBills": 7
  }
}
```

---

### 13. Accounting Health Indicators
Returns system balance validation and operational flags.

- **Method**: `GET`
- **URL**: `/dashboard/accounting-health`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Accounting health indicators retrieved successfully",
  "data": {
    "booksBalanced": true,
    "confirmedInvoicesAccounted": true,
    "postedEntriesValid": true,
    "overdueReceivables": 3,
    "budgetWarning": false,
    "unreconciledPayments": 2
  }
}
```

---

### 14. Recent Normalized Transactions
Returns latest transactions across sales orders, invoices, bills, and payments.

- **Method**: `GET`
- **URL**: `/dashboard/recent-transactions?limit=5&type=CUSTOMER_INVOICE`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Allowed Roles**: `ADMIN`, `ACCOUNTANT`

#### Query Parameters
- `limit`: number (default: 10)
- `type`: `"CUSTOMER_INVOICE"` | `"VENDOR_BILL"` | `"PAYMENT"` | `"SALES_ORDER"` | `"PURCHASE_ORDER"` (optional)

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Recent transactions retrieved successfully",
  "data": [
    {
      "id": "tx-1001",
      "reference": "INV-2026-0042",
      "type": "CUSTOMER_INVOICE",
      "party": "Prestige Living Interiors",
      "date": "2026-09-04",
      "amount": 125000,
      "status": "POSTED"
    },
    {
      "id": "tx-1002",
      "reference": "BILL-2026-0019",
      "type": "VENDOR_BILL",
      "party": "Teak Wood Suppliers Ltd",
      "date": "2026-09-03",
      "amount": 64000,
      "status": "CONFIRMED"
    },
    {
      "id": "tx-1003",
      "reference": "PAY-2026-0031",
      "type": "PAYMENT",
      "party": "Modern Living Spaces",
      "date": "2026-09-02",
      "amount": 45000,
      "status": "RECONCILED"
    }
  ]
}
```

---

## Database Dependencies Expected from Rohith

Rohith will maintain PostgreSQL and run Prisma migrations. The initial coordinated schema agreed upon and generated is:

```prisma
enum Role {
  ADMIN
  ACCOUNTANT
  CONTACT
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

enum ContactType {
  CUSTOMER
  VENDOR
  BOTH
}

model User {
  id           String      @id @default(cuid())
  name         String
  email        String      @unique
  mobile       String?
  passwordHash String
  role         Role        @default(CONTACT)
  status       UserStatus  @default(ACTIVE)
  contactId    String?     @unique
  contact      Contact?    @relation(fields: [contactId], references: [id], onDelete: SetNull)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("users")
}

model Contact {
  id        String      @id @default(cuid())
  name      String
  email     String?
  mobile    String?
  type      ContactType @default(CUSTOMER)
  status    String      @default("ACTIVE")
  user      User?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@map("contacts")
}
```

When Rohith introduces the accounting entities (`Product`, `Account`, `Journal`, `SalesOrder`, `PurchaseOrder`, `Invoice`, `Bill`, `Payment`, `JournalEntry`, `JournalEntryLine`, `Budget`), the backend service layer in `backend/src/modules/accounting/` and `backend/src/modules/dashboard/dashboard.service.ts` will connect directly without requiring changes to controllers, routes, or frontend contracts.
