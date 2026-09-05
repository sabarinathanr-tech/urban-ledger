import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { seedAccounts } from './seed-data/accounts.js';
import { seedJournals } from './seed-data/journals.js';
import { seedUsers } from './seed-data/users.js';
import { seedAnalyticAccounts, seedBudgets } from './seed-data/budgets.js';

const prisma = new PrismaClient();

async function hashPassword(plainText: string): Promise<string> {
  try {
    return await bcrypt.hash(plainText, 10);
  } catch {
    return '$2b$10$wT0o3q6.kP/d/gUo3wQ06.zO2LqGZ7B4fD.9j3F3wR2K4zE1t7wGe';
  }
}

async function cleanDatabase() {
  console.log('🧹 Cleaning existing database records for fresh 500-record scale...');
  await prisma.journalEntryLine.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.billLine.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.salesOrderLine.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.purchaseOrderLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.analyticAccount.deleteMany();
  await prisma.journal.deleteMany();
  await prisma.account.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contact.deleteMany();
}

// 50+ Realistic Furniture Catalog Products
const BULK_PRODUCTS = [
  // Office
  { name: 'Ergonomic High-Back Mesh Chair', type: 'GOODS', salesPrice: 5500, purchasePrice: 3200, category: 'Office' },
  { name: 'Solid Teak Executive Desk', type: 'GOODS', salesPrice: 28000, purchasePrice: 16500, category: 'Office' },
  { name: 'Motorized Dual-Lift Standing Desk', type: 'GOODS', salesPrice: 34000, purchasePrice: 21000, category: 'Office' },
  { name: 'Under-Desk 3-Drawer Mobile Pedestal', type: 'GOODS', salesPrice: 4800, purchasePrice: 2900, category: 'Office' },
  { name: 'Conference Boardroom Table (12-Seater)', type: 'GOODS', salesPrice: 65000, purchasePrice: 42000, category: 'Office' },
  { name: 'Executive Bonded Leather Armchair', type: 'GOODS', salesPrice: 14500, purchasePrice: 8800, category: 'Office' },
  { name: 'Acoustic Sound-Dampening Office Divider', type: 'GOODS', salesPrice: 8200, purchasePrice: 4900, category: 'Office' },
  { name: 'Heavy-Duty Steel Lateral Filing Cabinet', type: 'GOODS', salesPrice: 12000, purchasePrice: 7500, category: 'Office' },
  { name: 'Reception Lounge Curved 3-Piece Sofa', type: 'GOODS', salesPrice: 48000, purchasePrice: 31000, category: 'Office' },
  { name: 'Ergonomic Active Wobble Stool', type: 'GOODS', salesPrice: 3800, purchasePrice: 2200, category: 'Office' },

  // Living Room
  { name: 'Chesterfield Top-Grain Leather Sofa', type: 'GOODS', salesPrice: 72000, purchasePrice: 45000, category: 'Living Room' },
  { name: 'Velvet Midnight Blue 3-Seater Couch', type: 'GOODS', salesPrice: 38000, purchasePrice: 24000, category: 'Living Room' },
  { name: 'Power Recliner Lounge Armchair with USB', type: 'GOODS', salesPrice: 29500, purchasePrice: 18000, category: 'Living Room' },
  { name: 'Solid Oak Rectangular Coffee Table', type: 'GOODS', salesPrice: 14000, purchasePrice: 8500, category: 'Living Room' },
  { name: 'Floating Oak TV Console Entertainment Unit', type: 'GOODS', salesPrice: 22500, purchasePrice: 13500, category: 'Living Room' },
  { name: '5-Tier Open Industrial Metal & Wood Bookshelf', type: 'GOODS', salesPrice: 16500, purchasePrice: 9800, category: 'Living Room' },
  { name: 'Scandinavian Fabric Accent Armchair', type: 'GOODS', salesPrice: 12500, purchasePrice: 7600, category: 'Living Room' },
  { name: 'Italian White Carrara Marble Side Table', type: 'GOODS', salesPrice: 9800, purchasePrice: 5800, category: 'Living Room' },
  { name: 'Tufted Fabric Storage Ottoman Footstool', type: 'GOODS', salesPrice: 6200, purchasePrice: 3600, category: 'Living Room' },
  { name: 'Circular Nested Brass & Wood Coffee Tables', type: 'GOODS', salesPrice: 18500, purchasePrice: 11000, category: 'Living Room' },

  // Dining
  { name: 'Solid Sheesham 8-Seater Dining Table', type: 'GOODS', salesPrice: 46000, purchasePrice: 28000, category: 'Dining' },
  { name: 'Solid Wood Dining Chair with Cushion (Pair)', type: 'GOODS', salesPrice: 8500, purchasePrice: 5100, category: 'Dining' },
  { name: 'White Marble Top 6-Seater Dining Table', type: 'GOODS', salesPrice: 58000, purchasePrice: 36000, category: 'Dining' },
  { name: 'Rustic Wooden Dining Bench (3-Seater)', type: 'GOODS', salesPrice: 11000, purchasePrice: 6500, category: 'Dining' },
  { name: 'Contemporary Sheesham Crockery Sideboard', type: 'GOODS', salesPrice: 34000, purchasePrice: 21000, category: 'Dining' },
  { name: 'Swivel Leather Bar Stool (Counter Height)', type: 'GOODS', salesPrice: 6800, purchasePrice: 4100, category: 'Dining' },
  { name: 'Tempered Glass Tall Display Cabinet', type: 'GOODS', salesPrice: 27000, purchasePrice: 16500, category: 'Dining' },
  { name: 'Extendable Butterfly Leaf Dining Table', type: 'GOODS', salesPrice: 39000, purchasePrice: 24000, category: 'Dining' },
  { name: 'Built-in 24-Bottle Solid Wood Wine Rack', type: 'GOODS', salesPrice: 15500, purchasePrice: 9200, category: 'Dining' },
  { name: 'Compact Breakfast Nook 3-Piece Bistro Set', type: 'GOODS', salesPrice: 19500, purchasePrice: 11800, category: 'Dining' },

  // Bedroom
  { name: 'King Size Teak Bed Frame with Storage', type: 'GOODS', salesPrice: 52000, purchasePrice: 32000, category: 'Bedroom' },
  { name: 'Queen Size Upholstered Platform Bed', type: 'GOODS', salesPrice: 36000, purchasePrice: 22000, category: 'Bedroom' },
  { name: 'Orthopedic Multi-Layer Memory Foam Mattress (King)', type: 'GOODS', salesPrice: 28000, purchasePrice: 16800, category: 'Bedroom' },
  { name: 'Solid Sheesham 2-Drawer Bedside Nightstand', type: 'GOODS', salesPrice: 7500, purchasePrice: 4400, category: 'Bedroom' },
  { name: '4-Door Sliding Mirror Wardrobe with Soft-Close', type: 'GOODS', salesPrice: 68000, purchasePrice: 41000, category: 'Bedroom' },
  { name: 'Solid Walnut Dressing Table with LED Mirror', type: 'GOODS', salesPrice: 24000, purchasePrice: 14500, category: 'Bedroom' },
  { name: 'Upholstered End-of-Bed Storage Bench', type: 'GOODS', salesPrice: 10500, purchasePrice: 6200, category: 'Bedroom' },
  { name: 'Full-Length Floor Standing Walnut Cheval Mirror', type: 'GOODS', salesPrice: 8500, purchasePrice: 5000, category: 'Bedroom' },
  { name: 'Tall Chest of 6 Drawers (Oak Finish)', type: 'GOODS', salesPrice: 21000, purchasePrice: 12500, category: 'Bedroom' },
  { name: 'Vintage Wooden Blanket Storage Trunk', type: 'GOODS', salesPrice: 13000, purchasePrice: 7800, category: 'Bedroom' },

  // Services & Custom
  { name: 'Custom Furniture Architectural Consultation', type: 'SERVICE', salesPrice: 5000, purchasePrice: 1500, category: 'Services' },
  { name: 'Corporate Office Space Plan & Layout Design', type: 'SERVICE', salesPrice: 25000, purchasePrice: 8000, category: 'Services' },
  { name: 'On-Site Furniture Assembly & Installation', type: 'SERVICE', salesPrice: 3500, purchasePrice: 1200, category: 'Services' },
  { name: 'Annual Furniture Care & Polish Maintenance', type: 'SERVICE', salesPrice: 8000, purchasePrice: 2500, category: 'Services' },
  { name: 'Custom Fabric Upholstery Work (Per Meter)', type: 'SERVICE', salesPrice: 1800, purchasePrice: 700, category: 'Services' },

  // Combos
  { name: 'Executive Suite Office Bundle (Desk+Chair+Credenza)', type: 'COMBO', salesPrice: 44000, purchasePrice: 26000, category: 'Combos' },
  { name: 'Master Bedroom Luxury Pack (Bed+Mattress+2 Nightstands)', type: 'COMBO', salesPrice: 91000, purchasePrice: 54000, category: 'Combos' },
  { name: 'Modern Living Room Starter Set (Sofa+Coffee Table+TV Unit)', type: 'COMBO', salesPrice: 69000, purchasePrice: 41000, category: 'Combos' },
  { name: 'Fine Dining 7-Piece Collection (Table+6 Chairs)', type: 'COMBO', salesPrice: 59000, purchasePrice: 35000, category: 'Combos' },
  { name: 'Work-From-Home Pro Setup (Desk+Chair+Monitor Stand)', type: 'COMBO', salesPrice: 24000, purchasePrice: 14000, category: 'Combos' },
];

// 60+ Realistic Indian B2B & Retail Contacts
const BULK_CONTACTS = [
  // Primary Customers
  { name: 'Nimesh Pathak', type: 'CUSTOMER', email: 'nimesh@pathak.com', mobile: '+91 98201 12345', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { name: 'Prestige Living Designs Ltd', type: 'CUSTOMER', email: 'procure@prestigeliving.in', mobile: '+91 98450 88231', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
  { name: 'Urban Spaces Architecture LLP', type: 'CUSTOMER', email: 'admin@urbanspaces.co', mobile: '+91 98111 44556', city: 'Gurugram', state: 'Haryana', pincode: '122002' },
  { name: 'Vertex Corporate Tech Parks', type: 'CUSTOMER', email: 'facilities@vertexparks.in', mobile: '+91 98765 43210', city: 'Hyderabad', state: 'Telangana', pincode: '500081' },
  { name: 'Studio Matrix Interior Concepts', type: 'CUSTOMER', email: 'projects@studiomatrix.in', mobile: '+91 97900 11223', city: 'Chennai', state: 'Tamil Nadu', pincode: '600018' },
  { name: 'Oberoi Realty Group Facilities', type: 'CUSTOMER', email: 'commercial@oberoirealty.com', mobile: '+91 98200 99887', city: 'Mumbai', state: 'Maharashtra', pincode: '400063' },
  { name: 'Titan Innovations Headquarters', type: 'CUSTOMER', email: 'infra@titaninnovations.in', mobile: '+91 94440 22334', city: 'Bengaluru', state: 'Karnataka', pincode: '560100' },
  { name: 'Tata Capital Regional Hub', type: 'CUSTOMER', email: 'admin.support@tatacapital.com', mobile: '+91 99201 55667', city: 'Pune', state: 'Maharashtra', pincode: '411006' },
  { name: 'Infosys Facility Works', type: 'CUSTOMER', email: 'vendor.connect@infosys.com', mobile: '+91 98860 33445', city: 'Mysuru', state: 'Karnataka', pincode: '570027' },
  { name: 'Flipkart Campus Infra Team', type: 'CUSTOMER', email: 'workspace@flipkart.com', mobile: '+91 99000 66778', city: 'Bengaluru', state: 'Karnataka', pincode: '560103' },
  { name: 'Larsen & Toubro Projects Hub', type: 'CUSTOMER', email: 'projects.furnishing@lntecc.com', mobile: '+91 98202 33441', city: 'Chennai', state: 'Tamil Nadu', pincode: '600089' },
  { name: 'Godrej Properties Living Dept', type: 'CUSTOMER', email: 'interiors@godrejproperties.com', mobile: '+91 98210 55443', city: 'Mumbai', state: 'Maharashtra', pincode: '400079' },
  { name: 'Wipro Technologies Bangalore SEZ', type: 'CUSTOMER', email: 'sez.infra@wipro.com', mobile: '+91 98450 11990', city: 'Bengaluru', state: 'Karnataka', pincode: '560035' },
  { name: 'Mahindra Lifespaces Commercial', type: 'CUSTOMER', email: 'commercial@mahindralifespaces.com', mobile: '+91 98209 88771', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
  { name: 'HDFC Securities HQ Facilities', type: 'CUSTOMER', email: 'workplace@hdfcsec.com', mobile: '+91 98204 44552', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400705' },
  { name: 'Reliance Retail Workspace Mgmt', type: 'CUSTOMER', email: 'storeinfra@ril.com', mobile: '+91 99870 12349', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
  { name: 'Zomato HQ Workspaces', type: 'CUSTOMER', email: 'facilities@zomato.com', mobile: '+91 98180 44332', city: 'Gurugram', state: 'Haryana', pincode: '122001' },
  { name: 'Swiggy Bundl Technologies Infra', type: 'CUSTOMER', email: 'workspace.care@swiggy.in', mobile: '+91 99001 77889', city: 'Bengaluru', state: 'Karnataka', pincode: '560029' },
  { name: 'CRED Financial Tech Offices', type: 'CUSTOMER', email: 'facilities@cred.club', mobile: '+91 98451 99002', city: 'Bengaluru', state: 'Karnataka', pincode: '560076' },
  { name: 'Zerodha Broking Operations', type: 'CUSTOMER', email: 'admin@zerodha.com', mobile: '+91 98800 22119', city: 'Bengaluru', state: 'Karnataka', pincode: '560078' },
  { name: 'Kavitha Ramachandran (Architect)', type: 'CUSTOMER', email: 'kavitha.designs@gmail.com', mobile: '+91 98401 55667', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028' },
  { name: 'Vikramaditya Rao (Villa Project)', type: 'CUSTOMER', email: 'vikram.rao@outlook.com', mobile: '+91 98860 77112', city: 'Bengaluru', state: 'Karnataka', pincode: '560042' },
  { name: 'Ananya Deshmukh (Penthouse)', type: 'CUSTOMER', email: 'ananya.d@yahoo.com', mobile: '+91 98203 99881', city: 'Pune', state: 'Maharashtra', pincode: '411014' },
  { name: 'Rajesh & Sangeeta Agarwal', type: 'CUSTOMER', email: 'rajesh.agarwal@gmail.com', mobile: '+91 98110 33221', city: 'New Delhi', state: 'Delhi', pincode: '110048' },
  { name: 'Dr. Srinivas Murthy Clinic', type: 'CUSTOMER', email: 'murthy.care@murthyclinic.in', mobile: '+91 94480 55110', city: 'Mysuru', state: 'Karnataka', pincode: '570004' },
  { name: 'Horizon Luxury Suites & Resorts', type: 'CUSTOMER', email: 'procurement@horizonsuites.com', mobile: '+91 98300 44556', city: 'Kolkata', state: 'West Bengal', pincode: '700016' },
  { name: 'Emerald Coast Boutique Hotel', type: 'CUSTOMER', email: 'resort.admin@emeraldcoast.in', mobile: '+91 98221 44558', city: 'Goa', state: 'Goa', pincode: '403001' },
  { name: 'Jaipur Palace Heritage Homestay', type: 'CUSTOMER', email: 'heritage@jaipurpalace.in', mobile: '+91 94140 33221', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
  { name: 'Kochi Waterfront Co-working', type: 'CUSTOMER', email: 'admin@kochiwaterfront.com', mobile: '+91 98460 77665', city: 'Kochi', state: 'Kerala', pincode: '682001' },
  { name: 'Chandigarh Design Collective', type: 'CUSTOMER', email: 'design@chdcollective.org', mobile: '+91 98140 22331', city: 'Chandigarh', state: 'Chandigarh', pincode: '160017' },

  // Vendors & Suppliers
  { name: 'Azure Furniture Components', type: 'VENDOR', email: 'orders@azurefurniture.com', mobile: '+91 98202 55667', city: 'Pune', state: 'Maharashtra', pincode: '411018' },
  { name: 'Royal Teak & Timber Mills', type: 'VENDOR', email: 'sales@royalteakimports.com', mobile: '+91 98470 12345', city: 'Kochi', state: 'Kerala', pincode: '682003' },
  { name: 'Supreme Hardware & Hinges Co', type: 'VENDOR', email: 'sales@supremehardware.in', mobile: '+91 98250 99881', city: 'Rajkot', state: 'Gujarat', pincode: '360002' },
  { name: 'Deccan Foam & PU Upholstery', type: 'VENDOR', email: 'orders@deccanfoam.com', mobile: '+91 98490 66554', city: 'Hyderabad', state: 'Telangana', pincode: '500037' },
  { name: 'Green Wood Seasoning Plant', type: 'VENDOR', email: 'timber@greenwoodseasoning.in', mobile: '+91 94430 88771', city: 'Pollachi', state: 'Tamil Nadu', pincode: '642001' },
  { name: 'Precision Metal Works & Frames', type: 'VENDOR', email: 'info@precisionmetalworks.in', mobile: '+91 98210 11447', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400710' },
  { name: 'Silk & Velvet Fabrics India', type: 'VENDOR', email: 'textiles@silkvelvet.in', mobile: '+91 98240 77661', city: 'Surat', state: 'Gujarat', pincode: '395002' },
  { name: 'Saint Gobain Glass Distributors', type: 'VENDOR', email: 'glass.south@distributor-sg.in', mobile: '+91 98400 33229', city: 'Chennai', state: 'Tamil Nadu', pincode: '600032' },
  { name: 'Hettich India Hardware Partners', type: 'VENDOR', email: 'dealer@hettichpartners.in', mobile: '+91 98100 44558', city: 'New Delhi', state: 'Delhi', pincode: '110020' },
  { name: 'Asian Paints Industrial Finishes', type: 'VENDOR', email: 'woodtech@asianpaintsdealer.in', mobile: '+91 98201 99003', city: 'Mumbai', state: 'Maharashtra', pincode: '400055' },
  { name: 'Evergreen Particle Board Mills', type: 'VENDOR', email: 'sales@evergreenboards.in', mobile: '+91 94470 55441', city: 'Perumbavoor', state: 'Kerala', pincode: '683542' },
  { name: 'Corrugated Carton Packaging Ltd', type: 'VENDOR', email: 'boxes@cartonpack.co.in', mobile: '+91 98452 77884', city: 'Bengaluru', state: 'Karnataka', pincode: '560058' },
  { name: 'Godrej Locking Solutions B2B', type: 'VENDOR', email: 'locks.supply@godrejb2b.in', mobile: '+91 98205 66772', city: 'Mumbai', state: 'Maharashtra', pincode: '400079' },
  { name: 'Jaipur Brass & Bronze Handles', type: 'VENDOR', email: 'brassware@jaipurartisan.in', mobile: '+91 94141 55662', city: 'Jaipur', state: 'Rajasthan', pincode: '302002' },
  { name: 'EcoPlywood Industries Kerala', type: 'VENDOR', email: 'ply@ecoply.co.in', mobile: '+91 94460 33221', city: 'Kozhikode', state: 'Kerala', pincode: '673001' },

  // Both Customer & Vendor (Partners)
  { name: 'Livspace Commercial Fitouts', type: 'BOTH', email: 'partner@livspace.com', mobile: '+91 98861 22334', city: 'Bengaluru', state: 'Karnataka', pincode: '560008' },
  { name: 'Homelane Interior Solutions', type: 'BOTH', email: 'supply@homelane.com', mobile: '+91 98453 44556', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' },
  { name: 'Pepperfry Merchant Fulfilment', type: 'BOTH', email: 'merchant@pepperfry.com', mobile: '+91 98206 77881', city: 'Mumbai', state: 'Maharashtra', pincode: '400083' },
  { name: 'WoodenStreet Regional Partner', type: 'BOTH', email: 'partner@woodenstreet.com', mobile: '+91 94142 88991', city: 'Udaipur', state: 'Rajasthan', pincode: '313001' },
  { name: 'FabIndia Home Furnishings', type: 'BOTH', email: 'homecraft@fabindia.net', mobile: '+91 98112 55663', city: 'New Delhi', state: 'Delhi', pincode: '110065' },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startMonth = 1, endMonth = 9): Date {
  const month = randomBetween(startMonth, endMonth);
  const day = randomBetween(1, 28);
  const hour = randomBetween(9, 18);
  const minute = randomBetween(0, 59);
  return new Date(`2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
}

async function main() {
  console.log('🚀 Starting Urban Ledger Comprehensive Bulk Seeder (Target: 500+ records)...');
  await cleanDatabase();

  // 1. Chart of Accounts
  console.log('📊 Seeding Chart of Accounts (20 core accounts)...');
  const accountMap = new Map<string, string>();
  for (const acc of seedAccounts) {
    const created = await prisma.account.create({
      data: {
        id: acc.id,
        name: acc.name,
        code: acc.code,
        type: acc.type,
      },
    });
    accountMap.set(acc.code, created.id);
  }

  if (!accountMap.has('2002')) {
    const gst = await prisma.account.create({
      data: {
        id: 'a2002000-0000-0000-0000-000000002002',
        name: 'GST Tax Payable / Input Tax',
        code: '2002',
        type: 'LIABILITY',
      },
    });
    accountMap.set('2002', gst.id);
  }

  // 2. Journals
  console.log('📓 Seeding Journals...');
  const journalMap = new Map<string, string>();
  for (const j of seedJournals) {
    const created = await prisma.journal.create({
      data: {
        id: j.id,
        name: j.name,
        type: j.type,
        defaultDebitAccountId: j.defaultDebitAccountCode ? accountMap.get(j.defaultDebitAccountCode) : undefined,
        defaultCreditAccountId: j.defaultCreditAccountCode ? accountMap.get(j.defaultCreditAccountCode) : undefined,
      },
    });
    journalMap.set(j.type, created.id);
  }

  // 3. Products
  console.log(`🛋️ Seeding ${BULK_PRODUCTS.length} Furniture Products...`);
  const productList: Array<{ id: string; name: string; salesPrice: number; purchasePrice: number }> = [];
  for (const p of BULK_PRODUCTS) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        type: p.type as any,
        salesPrice: new Prisma.Decimal(p.salesPrice),
        purchasePrice: new Prisma.Decimal(p.purchasePrice),
        category: p.category,
      },
    });
    productList.push({ id: created.id, name: created.name, salesPrice: p.salesPrice, purchasePrice: p.purchasePrice });
  }

  // 4. Contacts
  console.log(`👥 Seeding ${BULK_CONTACTS.length} Business Contacts across India...`);
  const customers: Array<{ id: string; name: string; email: string | null }> = [];
  const vendors: Array<{ id: string; name: string; email: string | null }> = [];

  for (const c of BULK_CONTACTS) {
    const created = await prisma.contact.create({
      data: {
        name: c.name,
        type: c.type as any,
        email: c.email,
        mobile: c.mobile,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
      },
    });

    if (c.type === 'CUSTOMER' || c.type === 'BOTH') {
      customers.push({ id: created.id, name: created.name, email: created.email });
    }
    if (c.type === 'VENDOR' || c.type === 'BOTH') {
      vendors.push({ id: created.id, name: created.name, email: created.email });
    }
  }

  // 5. Users
  console.log('🔐 Seeding ERP Users (Mohith, Rohith, Rugenthra, Sabari, Admin)...');
  const userMap = new Map<string, string>();
  for (const u of seedUsers) {
    const passwordHash = await hashPassword(u.plainPassword);
    const contact = customers.find(c => c.email === u.contactEmail);
    const created = await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        passwordHash,
        role: u.role,
        contactId: contact?.id,
      },
    });
    userMap.set(u.email, created.id);
  }

  // 6. Analytic Accounts & Budgets
  console.log('📈 Seeding Analytic Accounts & Budgets...');
  const analyticMap = new Map<string, string>();
  for (const aa of seedAnalyticAccounts) {
    const created = await prisma.analyticAccount.create({
      data: { id: aa.id, name: aa.name, type: aa.type },
    });
    analyticMap.set(aa.name, created.id);
  }

  for (const b of seedBudgets) {
    const userEmail = (u: string) => userMap.get(u) || Array.from(userMap.values())[0];
    await prisma.budget.create({
      data: {
        id: b.id,
        name: b.name,
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        plannedAmount: new Prisma.Decimal(b.plannedAmount),
        responsibleUserId: userEmail(b.responsibleUserEmail),
        analyticAccountId: analyticMap.get(b.analyticAccountName)!,
      },
    });
  }

  // Accounting Reference IDs
  const salesJournalId = journalMap.get('SALES')!;
  const purchaseJournalId = journalMap.get('PURCHASE')!;
  const bankJournalId = journalMap.get('BANK')!;
  const cashJournalId = journalMap.get('CASH')!;

  const debtorsAccountId = accountMap.get('1100')!;
  const creditorsAccountId = accountMap.get('2000') || accountMap.get('2100')!;
  const salesIncomeAccountId = accountMap.get('4000')!;
  const costOfGoodsAccountId = accountMap.get('5000')!;
  const gstAccountId = accountMap.get('2002')!;
  const bankAccountId = accountMap.get('1010')!;
  const cashAccountId = accountMap.get('1000')!;

  // 7. Generate 120 Sales Orders + Invoices + Payments + Double-Entry Journal Entries
  console.log('💼 Seeding 120 Sales Orders, Invoices, and Balanced Journal Entries...');

  for (let i = 1; i <= 120; i++) {
    const customer = customers[(i - 1) % customers.length];
    const orderDate = randomDate(1, 8);
    const invoiceDate = new Date(orderDate.getTime() + randomBetween(1, 4) * 86400000);
    const dueDate = new Date(invoiceDate.getTime() + 14 * 86400000);

    const numLines = randomBetween(1, 3);
    const orderLinesData: Array<{ product: typeof productList[0]; qty: number; unitPrice: number }> = [];
    for (let l = 0; l < numLines; l++) {
      const prod = pickRandom(productList);
      orderLinesData.push({ product: prod, qty: randomBetween(1, 6), unitPrice: prod.salesPrice });
    }

    const subtotalNum = orderLinesData.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    const taxNum = Number((subtotalNum * 0.18).toFixed(2));
    const totalNum = Number((subtotalNum + taxNum).toFixed(2));

    const subtotal = new Prisma.Decimal(subtotalNum);
    const taxAmount = new Prisma.Decimal(taxNum);
    const totalAmount = new Prisma.Decimal(totalNum);

    const isPaid = i % 3 !== 0;
    const isDraft = i > 115;

    const soRef = `SO-2026-${String(i).padStart(4, '0')}`;
    const invRef = `INV-2026-${String(i).padStart(4, '0')}`;
    const jeRef = `JE-INV-2026-${String(i).padStart(4, '0')}`;

    const so = await prisma.salesOrder.create({
      data: {
        reference: soRef,
        customerId: customer.id,
        orderDate,
        status: isDraft ? 'DRAFT' : 'INVOICED',
        subtotal,
        taxAmount,
        totalAmount,
        lines: {
          create: orderLinesData.map(l => {
            const lineSub = l.qty * l.unitPrice;
            const lineTax = Number((lineSub * 0.18).toFixed(2));
            return {
              productId: l.product.id,
              quantity: new Prisma.Decimal(l.qty),
              unitPrice: new Prisma.Decimal(l.unitPrice),
              taxRate: new Prisma.Decimal(18),
              lineSubtotal: new Prisma.Decimal(lineSub),
              lineTax: new Prisma.Decimal(lineTax),
              lineTotal: new Prisma.Decimal(lineSub + lineTax),
            };
          }),
        },
      },
    });

    if (!isDraft) {
      const je = await prisma.journalEntry.create({
        data: {
          journalId: salesJournalId,
          date: invoiceDate,
          reference: jeRef,
          sourceType: 'INVOICE',
          status: 'POSTED',
          lines: {
            create: [
              {
                accountId: debtorsAccountId,
                description: `Receivable: ${customer.name} (${invRef})`,
                debit: totalAmount,
                credit: new Prisma.Decimal(0),
              },
              {
                accountId: salesIncomeAccountId,
                description: `Sales Revenue (${soRef})`,
                debit: new Prisma.Decimal(0),
                credit: subtotal,
              },
              {
                accountId: gstAccountId,
                description: `18% GST Output Tax (${invRef})`,
                debit: new Prisma.Decimal(0),
                credit: taxAmount,
              },
            ],
          },
        },
      });

      const inv = await prisma.invoice.create({
        data: {
          reference: invRef,
          customerId: customer.id,
          salesOrderId: so.id,
          journalEntryId: je.id,
          invoiceDate,
          dueDate,
          status: 'POSTED',
          paymentStatus: isPaid ? 'PAID' : (i % 2 === 0 ? 'PARTIALLY_PAID' : 'UNPAID'),
          subtotal,
          taxAmount,
          totalAmount,
          paidAmount: isPaid ? totalAmount : (i % 2 === 0 ? new Prisma.Decimal(Number((totalNum / 2).toFixed(2))) : new Prisma.Decimal(0)),
          outstandingAmount: isPaid ? new Prisma.Decimal(0) : (i % 2 === 0 ? new Prisma.Decimal(Number((totalNum / 2).toFixed(2))) : totalAmount),
          lines: {
            create: orderLinesData.map(l => {
              const lineSub = l.qty * l.unitPrice;
              const lineTax = Number((lineSub * 0.18).toFixed(2));
              return {
                productId: l.product.id,
                description: l.product.name,
                quantity: new Prisma.Decimal(l.qty),
                unitPrice: new Prisma.Decimal(l.unitPrice),
                taxRate: new Prisma.Decimal(18),
                lineSubtotal: new Prisma.Decimal(lineSub),
                lineTax: new Prisma.Decimal(lineTax),
                lineTotal: new Prisma.Decimal(lineSub + lineTax),
              };
            }),
          },
        },
      });

      await prisma.journalEntry.update({
        where: { id: je.id },
        data: { sourceId: inv.id },
      });

      if (isPaid) {
        const payDate = new Date(invoiceDate.getTime() + randomBetween(1, 10) * 86400000);
        const isBank = i % 4 !== 0;
        const payMethod = isBank ? 'BANK' : 'CASH';
        const payJournalId = isBank ? bankJournalId : cashJournalId;
        const depositAccId = isBank ? bankAccountId : cashAccountId;
        const payRef = `PAY-2026-${String(i).padStart(4, '0')}`;
        const payJeRef = `JE-PAY-2026-${String(i).padStart(4, '0')}`;

        const payJe = await prisma.journalEntry.create({
          data: {
            journalId: payJournalId,
            date: payDate,
            reference: payJeRef,
            sourceType: 'PAYMENT',
            status: 'POSTED',
            lines: {
              create: [
                {
                  accountId: depositAccId,
                  description: `Payment Receipt: ${customer.name} (${invRef})`,
                  debit: totalAmount,
                  credit: new Prisma.Decimal(0),
                },
                {
                  accountId: debtorsAccountId,
                  description: `Clear Receivable: ${invRef}`,
                  debit: new Prisma.Decimal(0),
                  credit: totalAmount,
                },
              ],
            },
          },
        });

        await prisma.payment.create({
          data: {
            reference: payRef,
            invoiceId: inv.id,
            paymentDate: payDate,
            amount: totalAmount,
            method: payMethod as any,
            journalId: payJournalId,
            journalEntryId: payJe.id,
            status: 'POSTED',
          },
        });
      }
    }
  }

  // 8. Generate 80 Purchase Orders + Vendor Bills + Payments + Double-Entry Entries
  console.log('📦 Seeding 80 Purchase Orders, Vendor Bills, and Balanced Journal Entries...');

  for (let j = 1; j <= 80; j++) {
    const vendor = vendors[(j - 1) % vendors.length];
    const orderDate = randomDate(1, 8);
    const billDate = new Date(orderDate.getTime() + randomBetween(1, 5) * 86400000);
    const dueDate = new Date(billDate.getTime() + 30 * 86400000);

    const numLines = randomBetween(1, 3);
    const purchaseLinesData: Array<{ product: typeof productList[0]; qty: number; unitPrice: number }> = [];
    for (let l = 0; l < numLines; l++) {
      const prod = pickRandom(productList);
      purchaseLinesData.push({ product: prod, qty: randomBetween(3, 15), unitPrice: prod.purchasePrice });
    }

    const subtotalNum = purchaseLinesData.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    const taxNum = Number((subtotalNum * 0.18).toFixed(2));
    const totalNum = Number((subtotalNum + taxNum).toFixed(2));

    const subtotal = new Prisma.Decimal(subtotalNum);
    const taxAmount = new Prisma.Decimal(taxNum);
    const totalAmount = new Prisma.Decimal(totalNum);

    const isPaid = j % 3 !== 0;
    const isDraft = j > 76;

    const poRef = `PO-2026-${String(j).padStart(4, '0')}`;
    const billRef = `BILL-2026-${String(j).padStart(4, '0')}`;
    const jeRef = `JE-BILL-2026-${String(j).padStart(4, '0')}`;

    const po = await prisma.purchaseOrder.create({
      data: {
        reference: poRef,
        vendorId: vendor.id,
        orderDate,
        status: isDraft ? 'DRAFT' : 'BILLED',
        subtotal,
        taxAmount,
        totalAmount,
        lines: {
          create: purchaseLinesData.map(l => {
            const lineSub = l.qty * l.unitPrice;
            const lineTax = Number((lineSub * 0.18).toFixed(2));
            return {
              productId: l.product.id,
              quantity: new Prisma.Decimal(l.qty),
              unitPrice: new Prisma.Decimal(l.unitPrice),
              taxRate: new Prisma.Decimal(18),
              lineSubtotal: new Prisma.Decimal(lineSub),
              lineTax: new Prisma.Decimal(lineTax),
              lineTotal: new Prisma.Decimal(lineSub + lineTax),
            };
          }),
        },
      },
    });

    if (!isDraft) {
      const je = await prisma.journalEntry.create({
        data: {
          journalId: purchaseJournalId,
          date: billDate,
          reference: jeRef,
          sourceType: 'BILL',
          status: 'POSTED',
          lines: {
            create: [
              {
                accountId: costOfGoodsAccountId,
                description: `Inventory / Procurement (${poRef})`,
                debit: subtotal,
                credit: new Prisma.Decimal(0),
              },
              {
                accountId: gstAccountId,
                description: `18% GST Input Tax Credit (${billRef})`,
                debit: taxAmount,
                credit: new Prisma.Decimal(0),
              },
              {
                accountId: creditorsAccountId,
                description: `Payable: ${vendor.name} (${billRef})`,
                debit: new Prisma.Decimal(0),
                credit: totalAmount,
              },
            ],
          },
        },
      });

      const bill = await prisma.bill.create({
        data: {
          reference: billRef,
          vendorId: vendor.id,
          purchaseOrderId: po.id,
          journalEntryId: je.id,
          billDate,
          dueDate,
          status: 'POSTED',
          paymentStatus: isPaid ? 'PAID' : 'UNPAID',
          subtotal,
          taxAmount,
          totalAmount,
          paidAmount: isPaid ? totalAmount : new Prisma.Decimal(0),
          outstandingAmount: isPaid ? new Prisma.Decimal(0) : totalAmount,
          lines: {
            create: purchaseLinesData.map(l => {
              const lineSub = l.qty * l.unitPrice;
              const lineTax = Number((lineSub * 0.18).toFixed(2));
              return {
                productId: l.product.id,
                description: l.product.name,
                quantity: new Prisma.Decimal(l.qty),
                unitPrice: new Prisma.Decimal(l.unitPrice),
                taxRate: new Prisma.Decimal(18),
                lineSubtotal: new Prisma.Decimal(lineSub),
                lineTax: new Prisma.Decimal(lineTax),
                lineTotal: new Prisma.Decimal(lineSub + lineTax),
              };
            }),
          },
        },
      });

      await prisma.journalEntry.update({
        where: { id: je.id },
        data: { sourceId: bill.id },
      });

      if (isPaid) {
        const payDate = new Date(billDate.getTime() + randomBetween(5, 25) * 86400000);
        const payMethod = 'BANK';
        const payRef = `PAY-VND-2026-${String(j).padStart(4, '0')}`;
        const payJeRef = `JE-PAY-VND-2026-${String(j).padStart(4, '0')}`;

        const payJe = await prisma.journalEntry.create({
          data: {
            journalId: bankJournalId,
            date: payDate,
            reference: payJeRef,
            sourceType: 'PAYMENT',
            status: 'POSTED',
            lines: {
              create: [
                {
                  accountId: creditorsAccountId,
                  description: `Settle Payable: ${vendor.name} (${billRef})`,
                  debit: totalAmount,
                  credit: new Prisma.Decimal(0),
                },
                {
                  accountId: bankAccountId,
                  description: `Bank Transfer Settlement: ${billRef}`,
                  debit: new Prisma.Decimal(0),
                  credit: totalAmount,
                },
              ],
            },
          },
        });

        await prisma.payment.create({
          data: {
            reference: payRef,
            billId: bill.id,
            paymentDate: payDate,
            amount: totalAmount,
            method: payMethod as any,
            journalId: bankJournalId,
            journalEntryId: payJe.id,
            status: 'POSTED',
          },
        });
      }
    }
  }

  const totalProducts = await prisma.product.count();
  const totalContacts = await prisma.contact.count();
  const totalSOs = await prisma.salesOrder.count();
  const totalPOs = await prisma.purchaseOrder.count();
  const totalInvoices = await prisma.invoice.count();
  const totalBills = await prisma.bill.count();
  const totalPayments = await prisma.payment.count();
  const totalJEs = await prisma.journalEntry.count();
  const totalJELines = await prisma.journalEntryLine.count();

  console.log('\n========================================================');
  console.log('🎉 URBAN LEDGER BULK SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================================');
  console.log(`• Products:                ${totalProducts}`);
  console.log(`• Contacts:                ${totalContacts}`);
  console.log(`• Sales Orders:            ${totalSOs}`);
  console.log(`• Purchase Orders:         ${totalPOs}`);
  console.log(`• Invoices:                ${totalInvoices}`);
  console.log(`• Vendor Bills:            ${totalBills}`);
  console.log(`• Payments:                ${totalPayments}`);
  console.log(`• Journal Entries:         ${totalJEs}`);
  console.log(`• Double-Entry Lines:      ${totalJELines}`);
  console.log(`• TOTAL DATABASE RECORDS:  ${totalProducts + totalContacts + totalSOs + totalPOs + totalInvoices + totalBills + totalPayments + totalJEs + totalJELines}`);
  console.log('========================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Bulk seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
