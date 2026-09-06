import React, { useState } from 'react';
import { X, ShoppingCart, Package, FileText, CreditCard, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useERP } from '@/context/ERPContext';

interface QuickActionModalProps {
  actionId: string | null;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ actionId, onClose }) => {
  const {
    contacts,
    products,
    createSalesOrder,
    createPurchaseOrder,
    createInvoice,
    createDirectPayment,
    addContact,
    addProduct,
  } = useERP();

  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states for different actions
  // Sale Order
  const [saleCustomer, setSaleCustomer] = useState(
    contacts.find((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')?.id || ''
  );
  const [saleProduct, setSaleProduct] = useState(products[0]?.id || '');
  const [saleQty, setSaleQty] = useState(1);
  const [salePrice, setSalePrice] = useState(products[0]?.salesPrice || 4500);

  // Custom sale states
  const [customSaleCustomerName, setCustomSaleCustomerName] = useState('');
  const [customSaleCustomerCity, setCustomSaleCustomerCity] = useState('');
  const [customSaleProductName, setCustomSaleProductName] = useState('');

  // Purchase Order
  const [purchVendor, setPurchVendor] = useState(
    contacts.find((c) => c.type === 'VENDOR' || c.type === 'BOTH')?.id || ''
  );
  const [purchProduct, setPurchProduct] = useState(products[0]?.id || '');
  const [purchQty, setPurchQty] = useState(1);
  const [purchPrice, setPurchPrice] = useState(products[0]?.purchasePrice || 2800);

  // Custom purchase states
  const [customPurchVendorName, setCustomPurchVendorName] = useState('');
  const [customPurchVendorCity, setCustomPurchVendorCity] = useState('');
  const [customPurchProductName, setCustomPurchProductName] = useState('');

  // Invoice
  const [invCustomer, setInvCustomer] = useState(
    contacts.find((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')?.id || ''
  );
  const [invAmount, setInvAmount] = useState(15000);
  const [invDueDate, setInvDueDate] = useState('2026-09-30');

  // Payment
  const [payContact, setPayContact] = useState(contacts[0]?.id || '');
  const [payAmount, setPayAmount] = useState(10000);
  const [payType, setPayType] = useState<'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT'>('CUSTOMER_PAYMENT');
  const [payMethod, setPayMethod] = useState<'HDFC Bank Transfer' | 'Cash Register' | 'UPI'>('HDFC Bank Transfer');

  // Contact
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactType, setContactType] = useState<'CUSTOMER' | 'VENDOR' | 'BOTH'>('CUSTOMER');

  // Product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Chairs & Seating');
  const [prodSalesPrice, setProdSalesPrice] = useState(5000);
  const [prodCostPrice, setProdCostPrice] = useState(3000);
  const [prodStock, setProdStock] = useState(10);

  if (!actionId) return null;

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let selContact = contacts.find((c) => c.id === saleCustomer);
    if (saleCustomer === '__OTHER__') {
      if (!customSaleCustomerName.trim()) return;
      selContact = addContact({
        name: customSaleCustomerName.trim(),
        type: 'CUSTOMER',
        email: `${customSaleCustomerName.trim().toLowerCase().replace(/\s+/g, '')}@client.com`,
        mobile: '+91 98765 43210',
        city: customSaleCustomerCity.trim() || 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641001',
      });
    } else if (!selContact) {
      selContact = contacts[0];
    }

    let selProd = products.find((p) => p.id === saleProduct);
    if (saleProduct === '__OTHER__') {
      if (!customSaleProductName.trim()) return;
      selProd = addProduct({
        name: customSaleProductName.trim(),
        salesPrice: salePrice,
        purchasePrice: Math.round(salePrice * 0.65),
        category: 'Custom Orders',
        type: 'GOODS',
        stock: 25,
      });
    } else if (!selProd) {
      selProd = products[0];
    }

    const subtotal = saleQty * salePrice;
    const taxTotal = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxTotal;

    createSalesOrder({
      orderDate: new Date().toISOString().split('T')[0],
      customerId: selContact.id,
      customerName: selContact.name,
      customerEmail: selContact.email,
      customerPhone: selContact.mobile,
      lines: [
        {
          id: `sol-${Date.now()}`,
          productId: selProd.id,
          productName: selProd.name,
          quantity: saleQty,
          unitPrice: salePrice,
          taxRate: 18,
          subtotal,
          taxAmount: taxTotal,
          total: subtotal,
          analyticAccountId: 'ana-rev-1',
          analyticAccountName: 'Commercial Furniture Sales (Income)',
          chartOfAccount: 'Sales Account (Revenue)',
        },
      ],
      subtotal,
      taxTotal,
      grandTotal,
      notes: 'Created via Dashboard Quick Action',
      status: 'CONFIRMED',
    });

    setSuccessMessage(`Sale order created for ${selContact.name} (₹${grandTotal.toLocaleString('en-IN')})`);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let selVendor = contacts.find((c) => c.id === purchVendor);
    if (purchVendor === '__OTHER__') {
      if (!customPurchVendorName.trim()) return;
      selVendor = addContact({
        name: customPurchVendorName.trim(),
        type: 'VENDOR',
        email: `${customPurchVendorName.trim().toLowerCase().replace(/\s+/g, '')}@supplier.com`,
        mobile: '+91 98765 12345',
        city: customPurchVendorCity.trim() || 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
      });
    } else if (!selVendor) {
      selVendor = contacts[0];
    }

    let selProd = products.find((p) => p.id === purchProduct);
    if (purchProduct === '__OTHER__') {
      if (!customPurchProductName.trim()) return;
      selProd = addProduct({
        name: customPurchProductName.trim(),
        salesPrice: Math.round(purchPrice * 1.5),
        purchasePrice: purchPrice,
        category: 'Raw Materials',
        type: 'GOODS',
        stock: 50,
      });
    } else if (!selProd) {
      selProd = products[0];
    }

    const subtotal = purchQty * purchPrice;
    const taxTotal = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxTotal;

    createPurchaseOrder({
      orderDate: new Date().toISOString().split('T')[0],
      vendorId: selVendor.id,
      vendorName: selVendor.name,
      vendorEmail: selVendor.email,
      vendorPhone: selVendor.mobile,
      lines: [
        {
          id: `pol-${Date.now()}`,
          productId: selProd.id,
          productName: selProd.name,
          quantity: purchQty,
          unitPrice: purchPrice,
          taxRate: 18,
          subtotal,
          taxAmount: taxTotal,
          total: subtotal,
          analyticAccountId: 'ana-0',
          analyticAccountName: 'Furniture Procurement (Expenses)',
          chartOfAccount: 'Purchase Expense A/c',
        },
      ],
      subtotal,
      taxTotal,
      grandTotal,
      notes: 'Created via Dashboard Quick Action',
      status: 'CONFIRMED',
    });

    setSuccessMessage(`Purchase order created for ${selVendor.name} (₹${grandTotal.toLocaleString('en-IN')})`);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selContact = contacts.find((c) => c.id === invCustomer) || contacts[0];
    const subtotal = Math.round(invAmount / 1.18);
    const taxTotal = invAmount - subtotal;

    createInvoice({
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invDueDate,
      customerId: selContact.id,
      customerName: selContact.name,
      customerEmail: selContact.email,
      customerAddress: `${selContact.city || 'Mumbai'}, ${selContact.state || 'Maharashtra'}`,
      status: 'POSTED',
      lines: [
        {
          id: `invl-${Date.now()}`,
          productId: 'prd-custom',
          productName: 'Commercial Furnishing & Delivery',
          quantity: 1,
          unitPrice: subtotal,
          taxRate: 18,
          subtotal,
          taxAmount: taxTotal,
          total: invAmount,
        },
      ],
      subtotal,
      taxTotal,
      grandTotal: invAmount,
      amountPaid: 0,
      balanceDue: invAmount,
      notes: 'Direct invoice generated from Dashboard Quick Actions',
    });

    setSuccessMessage(`Invoice generated for ${selContact.name} (₹${invAmount.toLocaleString('en-IN')})`);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selContact = contacts.find((c) => c.id === payContact) || contacts[0];

    createDirectPayment(
      payType,
      selContact.id,
      payAmount,
      'DIRECT-DASHBOARD',
      payMethod === 'Cash Register' ? 'CASH' : 'BANK',
      payMethod
    );

    setSuccessMessage(`Payment of ₹${payAmount.toLocaleString('en-IN')} recorded for ${selContact.name}`);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;

    addContact({
      name: contactName.trim(),
      email: contactEmail.trim() || `${contactName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      mobile: contactMobile.trim() || '+91 98765 00000',
      type: contactType,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      totalReceivable: 0,
    });

    setSuccessMessage(`Contact "${contactName}" added successfully.`);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    addProduct({
      name: prodName.trim(),
      category: prodCategory,
      type: 'GOODS',
      salesPrice: prodSalesPrice,
      purchasePrice: prodCostPrice,
      stock: prodStock,
    });

    setSuccessMessage(`Product "${prodName}" added to catalog.`);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Determine modal title & icon
  const getModalMeta = () => {
    switch (actionId) {
      case 'qa-1':
      case 'sale':
        return { title: 'New Sales Order', icon: <ShoppingCart size={20} className="text-brand-600" /> };
      case 'qa-2':
      case 'purchase':
        return { title: 'New Purchase Order', icon: <Package size={20} className="text-brand-600" /> };
      case 'qa-3':
      case 'invoice':
        return { title: 'New Customer Invoice', icon: <FileText size={20} className="text-brand-600" /> };
      case 'qa-4':
      case 'payment':
        return { title: 'Record Payment', icon: <CreditCard size={20} className="text-brand-600" /> };
      case 'qa-5':
      case 'contact':
        return { title: 'Add New Contact', icon: <Users size={20} className="text-brand-600" /> };
      case 'qa-6':
      case 'product':
        return { title: 'Add New Product', icon: <Package size={20} className="text-brand-600" /> };
      default:
        return { title: 'Quick Action', icon: <Package size={20} className="text-brand-600" /> };
    }
  };

  const meta = getModalMeta();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
              {meta.icon}
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-900">{meta.title}</h2>
              <p className="text-xs text-text-muted">Create transaction directly on the dashboard</p>
            </div>
          </div>

          {/* Prominent Cross [X] Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-sm font-bold text-navy-900">Success!</h3>
              <p className="text-xs text-text-muted">{successMessage}</p>
            </div>
          ) : (
            <>
              {/* SALE FORM */}
              {(actionId === 'qa-1' || actionId === 'sale') && (
                <form onSubmit={handleSaleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Customer</label>
                    <select
                      value={saleCustomer}
                      onChange={(e) => setSaleCustomer(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="__OTHER__">➕ Other (Enter New Customer Details...)</option>
                      {contacts
                        .filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.city || 'India'})
                          </option>
                        ))}
                    </select>
                    {saleCustomer === '__OTHER__' && (
                      <div className="mt-2 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                        <div className="col-span-2">
                          <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Customer Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Apex Corporation Pvt Ltd"
                            value={customSaleCustomerName}
                            onChange={(e) => setCustomSaleCustomerName(e.target.value)}
                            className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">City</label>
                          <input
                            type="text"
                            placeholder="e.g. Coimbatore"
                            value={customSaleCustomerCity}
                            onChange={(e) => setCustomSaleCustomerCity(e.target.value)}
                            className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Product</label>
                      <select
                        value={saleProduct}
                        onChange={(e) => {
                          setSaleProduct(e.target.value);
                          if (e.target.value !== '__OTHER__') {
                            const p = products.find((pr) => pr.id === e.target.value);
                            if (p) setSalePrice(p.salesPrice);
                          }
                        }}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="__OTHER__">➕ Other (Custom Item...)</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {saleProduct === '__OTHER__' && (
                        <div className="mt-2">
                          <input
                            type="text"
                            required
                            placeholder="Custom Product Name"
                            value={customSaleProductName}
                            onChange={(e) => setCustomSaleProductName(e.target.value)}
                            className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={saleQty}
                        onChange={(e) => setSaleQty(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Unit Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={salePrice}
                        onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Total (Incl. 18% GST)</label>
                      <div className="w-full rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-navy-900">
                        ₹{Math.round(saleQty * salePrice * 1.18).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Create Sale Order
                    </Button>
                  </div>
                </form>
              )}

              {/* PURCHASE FORM */}
              {(actionId === 'qa-2' || actionId === 'purchase') && (
                <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Vendor</label>
                    <select
                      value={purchVendor}
                      onChange={(e) => setPurchVendor(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="__OTHER__">➕ Other (Enter New Vendor Details...)</option>
                      {contacts
                        .filter((c) => c.type === 'VENDOR' || c.type === 'BOTH')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.city || 'India'})
                          </option>
                        ))}
                    </select>
                    {purchVendor === '__OTHER__' && (
                      <div className="mt-2 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                        <div className="col-span-2">
                          <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Supplier Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Apex Wood & Timbers Ltd"
                            value={customPurchVendorName}
                            onChange={(e) => setCustomPurchVendorName(e.target.value)}
                            className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">City</label>
                          <input
                            type="text"
                            placeholder="e.g. Chennai"
                            value={customPurchVendorCity}
                            onChange={(e) => setCustomPurchVendorCity(e.target.value)}
                            className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Item / Raw Material</label>
                      <select
                        value={purchProduct}
                        onChange={(e) => {
                          setPurchProduct(e.target.value);
                          if (e.target.value !== '__OTHER__') {
                            const p = products.find((pr) => pr.id === e.target.value);
                            if (p) setPurchPrice(p.purchasePrice);
                          }
                        }}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="__OTHER__">➕ Other (Custom Supply Item...)</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {purchProduct === '__OTHER__' && (
                        <div className="mt-2">
                          <input
                            type="text"
                            required
                            placeholder="Custom Material Name"
                            value={customPurchProductName}
                            onChange={(e) => setCustomPurchProductName(e.target.value)}
                            className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={purchQty}
                        onChange={(e) => setPurchQty(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Unit Cost (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={purchPrice}
                        onChange={(e) => setPurchPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Total (Incl. 18% GST)</label>
                      <div className="w-full rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-navy-900">
                        ₹{Math.round(purchQty * purchPrice * 1.18).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Create Purchase Order
                    </Button>
                  </div>
                </form>
              )}

              {/* INVOICE FORM */}
              {(actionId === 'qa-3' || actionId === 'invoice') && (
                <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Customer</label>
                    <select
                      value={invCustomer}
                      onChange={(e) => setInvCustomer(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {contacts
                        .filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Invoice Amount (₹)</label>
                      <input
                        type="number"
                        min={100}
                        value={invAmount}
                        onChange={(e) => setInvAmount(Number(e.target.value))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={invDueDate}
                        onChange={(e) => setInvDueDate(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Generate Invoice
                    </Button>
                  </div>
                </form>
              )}

              {/* PAYMENT FORM */}
              {(actionId === 'qa-4' || actionId === 'payment') && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Type</label>
                      <select
                        value={payType}
                        onChange={(e) => setPayType(e.target.value as 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT')}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="CUSTOMER_PAYMENT">Customer Receipt</option>
                        <option value="VENDOR_PAYMENT">Vendor Disbursement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Method</label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value as 'HDFC Bank Transfer' | 'Cash Register' | 'UPI')}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="HDFC Bank Transfer">HDFC Bank Transfer</option>
                        <option value="Cash Register">Cash Register</option>
                        <option value="UPI">UPI Payment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Contact Party</label>
                    <select
                      value={payContact}
                      onChange={(e) => setPayContact(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Amount (₹)</label>
                    <input
                      type="number"
                      min={100}
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Record Payment
                    </Button>
                  </div>
                </form>
              )}

              {/* CONTACT FORM */}
              {(actionId === 'qa-5' || actionId === 'contact') && (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Contact / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Timber Works"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="contact@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Contact Type</label>
                    <select
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value as 'CUSTOMER' | 'VENDOR' | 'BOTH')}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="CUSTOMER">Customer (Client)</option>
                      <option value="VENDOR">Vendor (Supplier)</option>
                      <option value="BOTH">Both Customer & Vendor</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Add Contact
                    </Button>
                  </div>
                </form>
              )}

              {/* PRODUCT FORM */}
              {(actionId === 'qa-6' || actionId === 'product') && (
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Scandinavian Solid Oak Armchair"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Category</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="Chairs & Seating">Chairs & Seating</option>
                        <option value="Tables & Desks">Tables & Desks</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Finishing Services">Finishing Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Stock Count</label>
                      <input
                        type="number"
                        min={0}
                        value={prodStock}
                        onChange={(e) => setProdStock(Number(e.target.value))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Sales Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={prodSalesPrice}
                        onChange={(e) => setProdSalesPrice(Number(e.target.value))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">Cost Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={prodCostPrice}
                        onChange={(e) => setProdCostPrice(Number(e.target.value))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Add Product
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
