import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  X,
  FileText,
  Receipt,
  Archive,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useERP } from '@/context/ERPContext';
import { ROUTES } from '@/app/config';
import type { ContactItem } from '@/data/erpData';
import { OdooControlPanel, type ViewMode } from '@/components/layout/OdooControlPanel';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
];

export function ContactsPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    contacts,
    addContact,
    toggleContactActive,
    grantPortalAccess,
    invoices,
    bills,
    payments,
    refreshERPData,
  } = useERP();

  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type')?.toUpperCase();
  const initialType = typeParam && ['CUSTOMER', 'VENDOR', 'BOTH'].includes(typeParam) ? typeParam : 'ALL';

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // New Contact Form
  const [name, setName] = useState('');
  const [type, setType] = useState<'CUSTOMER' | 'VENDOR' | 'BOTH'>(
    typeParam === 'VENDOR' ? 'VENDOR' : 'CUSTOMER'
  );
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [profileImage, setProfileImage] = useState(PRESET_AVATARS[0]);
  const [enablePortalLogin, setEnablePortalLogin] = useState(true);

  useEffect(() => {
    if (typeParam && ['CUSTOMER', 'VENDOR', 'BOTH'].includes(typeParam)) {
      setTypeFilter(typeParam);
      setType(typeParam as 'CUSTOMER' | 'VENDOR' | 'BOTH');
    }
  }, [typeParam]);

  useEffect(() => {
    if (location.pathname === ROUTES.CONTACTS_NEW) {
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = contacts.find((c) => c.id === id);
      if (found) {
        setSelectedContact(found);
      }
    }
  }, [id, contacts]);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeVariant = (contactType: ContactItem['type']): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (contactType) {
      case 'CUSTOMER':
        return 'success';
      case 'VENDOR':
        return 'info';
      case 'BOTH':
        return 'default';
    }
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContact = addContact({
      name: name.trim(),
      type,
      email: email.trim(),
      mobile: mobile.trim(),
      city: city.trim() || 'Mumbai',
      state: state.trim(),
      pincode: pincode.trim() || '400001',
      profileImage,
      portalUser: enablePortalLogin
        ? {
            email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@urbanledger.com`,
            active: true,
          }
        : undefined,
      totalReceivable: 0,
      totalPayable: 0,
    });

    setIsModalOpen(false);
    if (location.pathname === ROUTES.CONTACTS_NEW) {
      navigate(ROUTES.CONTACTS);
    }
    setName('');
    setEmail('');
    setMobile('');
    setCity('');
    setPincode('');
    setNotice(`Master Contact "${newContact.name}" registered successfully with ${enablePortalLogin ? 'Active Portal Login' : 'Standard Profile'}.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleToggleActive = (contactId: string) => {
    toggleContactActive(contactId);
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact({ ...selectedContact, isActive: !selectedContact.isActive });
    }
    setNotice(`Contact active status updated.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleGrantPortal = (contact: ContactItem) => {
    const loginEmail = contact.email || `${contact.name.toLowerCase().replace(/\s+/g, '')}@urbanledger.com`;
    grantPortalAccess(contact.id, loginEmail);
    setSelectedContact((prev) => (prev ? { ...prev, portalUser: { email: loginEmail, active: true } } : null));
    setNotice(`Portal user credentials activated for ${contact.name} (${loginEmail}).`);
    setTimeout(() => setNotice(null), 5000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (location.pathname === ROUTES.CONTACTS_NEW) {
      navigate(ROUTES.CONTACTS);
    }
  };

  const closeDetail = () => {
    setSelectedContact(null);
    if (id) {
      navigate(ROUTES.CONTACTS);
    }
  };

  // Matched records for selected contact
  const contactInvoices = selectedContact
    ? invoices.filter((i) => i.customerId === selectedContact.id)
    : [];
  const contactBills = selectedContact
    ? bills.filter((b) => b.vendorId === selectedContact.id)
    : [];
  const contactPayments = selectedContact
    ? payments.filter((p) => p.contactId === selectedContact.id)
    : [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary">
      {/* Odoo Control Panel (Header, Search, Filters & View Switcher) */}
      <OdooControlPanel
        title="Contacts"
        subtitle="Customers, vendors, suppliers, and partner address directory"
        itemCount={filteredContacts.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, email, city..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewClick={() => {
          navigate(ROUTES.CONTACTS_NEW);
          setIsModalOpen(true);
        }}
        newButtonLabel="New Contact"
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Customers', value: 'CUSTOMER' },
          { label: 'Vendors', value: 'VENDOR' },
          { label: 'Partners', value: 'BOTH' },
        ]}
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
        onRefresh={refreshERPData}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-w-7xl w-full mx-auto">
        {notice && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span className="font-medium">{notice}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* KANBAN VIEW (Odoo-Style Contact Cards)                       */}
        {/* ============================================================ */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-text-muted bg-white rounded-lg border border-surface-border">
                No contacts found matching filter criteria.
              </div>
            ) : (
              filteredContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="group bg-white rounded-lg border border-surface-border hover:border-navy-400 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Top Card Row: Avatar, Name & Type */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        {c.profileImage ? (
                          <img
                            src={c.profileImage}
                            alt={c.name}
                            className="w-12 h-12 rounded-full object-cover border border-surface-border shadow-2xs"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-navy-800 to-navy-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {c.portalUser?.active && (
                          <span
                            title="Portal Login Active"
                            className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-white rounded-full ring-2 ring-white"
                          >
                            <UserCheck size={11} />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-sm text-navy-900 truncate group-hover:text-brand-700 transition-colors">
                            {c.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant={getTypeBadgeVariant(c.type)} className="text-[10px] px-1.5 py-0 font-semibold">
                            {c.type}
                          </Badge>
                          <span className="text-[11px] text-text-muted truncate">
                            {c.city}, {c.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-1 text-xs text-navy-700 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={13} className="text-text-muted shrink-0" />
                        <span className="truncate">{c.email || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Phone size={13} className="text-text-muted shrink-0" />
                        <span>{c.mobile || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Balances Footer */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      {c.type !== 'VENDOR' && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-text-muted">Receivable:</span>
                          <span className="font-mono font-semibold text-emerald-700">
                            {c.totalReceivable ? `₹${c.totalReceivable.toLocaleString('en-IN')}` : '₹0'}
                          </span>
                        </div>
                      )}
                      {c.type !== 'CUSTOMER' && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-text-muted">Payable:</span>
                          <span className="font-mono font-semibold text-red-600">
                            {c.totalPayable ? `₹${c.totalPayable.toLocaleString('en-IN')}` : '₹0'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {c.portalUser?.active ? (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Portal User
                        </span>
                      ) : (
                        <span className="text-[10px] text-text-muted">Contact</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* LIST VIEW (Table)                                           */}
        {/* ============================================================ */}
        {viewMode === 'list' && (
          <div className="rounded-lg border border-surface-border bg-white shadow-2xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-12 text-center">Photo</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>City, State</TableHead>
                  <TableHead className="text-right">Receivable</TableHead>
                  <TableHead className="text-right">Payable</TableHead>
                  <TableHead className="text-center">Portal Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="py-8 text-center text-xs text-text-muted">
                      No contacts found matching filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((c) => (
                    <TableRow
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="text-center py-2">
                        {c.profileImage ? (
                          <img
                            src={c.profileImage}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover mx-auto border border-surface-border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-800 font-bold text-xs flex items-center justify-center mx-auto">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-navy-900 text-xs">{c.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(c.type)}>{c.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-navy-700">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-text-muted" />
                          <span>{c.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-navy-700">
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-text-muted" />
                          <span>{c.mobile}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-navy-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-text-muted" />
                          <span>{c.city}, {c.state}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-emerald-700">
                        {c.totalReceivable ? `₹${c.totalReceivable.toLocaleString('en-IN')}` : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-red-600">
                        {c.totalPayable ? `₹${c.totalPayable.toLocaleString('en-IN')}` : '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        {c.portalUser?.active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={11} /> Enabled
                          </span>
                        ) : (
                          <span className="text-[11px] text-text-muted">Standard</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContact(c)}
                          className="h-7 text-[11px] px-2.5 cursor-pointer"
                        >
                          Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ADD CONTACT MODAL (With Profile Image & Portal User Account)  */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h2 className="text-base font-bold text-navy-900">New Contact Master</h2>
                <p className="text-xs text-text-muted">Customer, vendor, or business partner record</p>
              </div>
              <button onClick={closeModal} className="rounded p-1 text-text-muted hover:bg-slate-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              {/* Profile Image Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">Profile Picture / Avatar</label>
                <div className="flex items-center gap-3">
                  <img
                    src={profileImage}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-navy-700 shadow-xs"
                  />
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileImage(url)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          profileImage === url ? 'border-navy-900 ring-2 ring-navy-400' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Company / Individual Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nimesh Pathak or Azure Furniture Ltd."
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Relationship Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'CUSTOMER' | 'VENDOR' | 'BOTH')}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="CUSTOMER">Customer (Receivables)</option>
                  <option value="VENDOR">Vendor / Supplier (Payables)</option>
                  <option value="BOTH">Partner (Both Customer & Vendor)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@business.com"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Portal User Account Provisioning (PS Page 1 Requirement) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enablePortalLogin}
                    onChange={(e) => setEnablePortalLogin(e.target.checked)}
                    className="rounded border-slate-300 text-navy-900 focus:ring-navy-600 h-4 w-4"
                  />
                  <span className="font-semibold text-navy-900 text-xs">
                    Provision Dedicated Portal Login Account
                  </span>
                </label>
                <p className="text-[11px] text-text-muted pl-6">
                  Creates a portal credential so this contact can sign in to view their own customer invoices, supplier bills, and make digital payments (PS Page 1).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Save Contact Master
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONTACT PROFILE & FINANCIAL LEDGER DETAIL MODAL              */}
      {/* ============================================================ */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div className="flex items-center gap-3.5">
                {selectedContact.profileImage ? (
                  <img
                    src={selectedContact.profileImage}
                    alt={selectedContact.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-surface-border shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-navy-900 to-navy-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-navy-900 text-base">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getTypeBadgeVariant(selectedContact.type)}>{selectedContact.type}</Badge>
                    <Badge variant={selectedContact.isActive ? 'success' : 'default'}>
                      {selectedContact.isActive ? 'Active' : 'Archived'}
                    </Badge>
                  </div>
                </div>
              </div>
              <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 rounded-md cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Portal Access Status & Credentials Box */}
            <div className="rounded-lg p-3.5 bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                  Portal Login Credentials (PS Page 1)
                </span>
                {selectedContact.portalUser?.active ? (
                  <div className="flex items-center gap-1.5 mt-0.5 font-medium text-emerald-700">
                    <ShieldCheck size={14} />
                    <span>Login ID: {selectedContact.portalUser.email} (Active)</span>
                  </div>
                ) : (
                  <div className="text-text-muted mt-0.5">
                    No portal login user account assigned.
                  </div>
                )}
              </div>

              {!selectedContact.portalUser?.active && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGrantPortal(selectedContact)}
                  className="h-7 text-xs border-navy-300 text-navy-900 hover:bg-navy-50 cursor-pointer"
                >
                  Grant Portal Login
                </Button>
              )}
            </div>

            {/* Financial Balances */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-surface-secondary/70 p-3 border border-surface-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">Total Receivable (Customer)</span>
                <p className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
                  ₹{(selectedContact.totalReceivable || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-lg bg-surface-secondary/70 p-3 border border-surface-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">Total Payable (Vendor)</span>
                <p className="text-lg font-bold font-mono text-red-600 mt-0.5">
                  ₹{(selectedContact.totalPayable || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Address & Communication */}
            <div className="space-y-1.5 text-xs text-navy-800 border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-text-muted" />
                <span>{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-text-muted" />
                <span>{selectedContact.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-text-muted" />
                <span>{selectedContact.city}, {selectedContact.state} — {selectedContact.pincode}</span>
              </div>
            </div>

            {/* Matched Documents History */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
                Transaction History
              </span>

              {contactInvoices.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-navy-800 flex items-center gap-1">
                    <FileText size={12} className="text-brand-700" /> Customer Invoices ({contactInvoices.length})
                  </span>
                  {contactInvoices.map((inv) => (
                    <div key={inv.id} className="flex justify-between items-center rounded-md bg-slate-50 border border-slate-200/70 p-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-navy-900 mr-2">{inv.invoiceNumber}</span>
                        <span className="text-text-muted">{inv.issueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-navy-900">₹{inv.grandTotal.toLocaleString('en-IN')}</span>
                        <Link to={`/invoices/${inv.id}`} className="text-brand-700 hover:underline text-[11px] flex items-center gap-0.5">
                          <span>View</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {contactBills.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-navy-800 flex items-center gap-1">
                    <Receipt size={12} className="text-brand-700" /> Vendor Bills ({contactBills.length})
                  </span>
                  {contactBills.map((b) => (
                    <div key={b.id} className="flex justify-between items-center rounded-md bg-slate-50 border border-slate-200/70 p-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-navy-900 mr-2">{b.billNumber}</span>
                        <span className="text-text-muted">{b.billDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-navy-900">₹{b.grandTotal.toLocaleString('en-IN')}</span>
                        <Link to={`/bills/${b.id}`} className="text-brand-700 hover:underline text-[11px] flex items-center gap-0.5">
                          <span>View</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {contactPayments.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-navy-800">
                    Payment Transactions ({contactPayments.length})
                  </span>
                  {contactPayments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center rounded-md bg-slate-50 border border-slate-200/70 p-2 text-xs">
                      <span className="font-mono text-navy-900">{p.paymentNumber}</span>
                      <span className="font-mono font-bold text-navy-900">₹{p.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions: Soft Archive / Restore */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleActive(selectedContact.id)}
                className="flex items-center gap-1.5 text-xs text-navy-700 cursor-pointer"
              >
                {selectedContact.isActive ? (
                  <>
                    <Archive size={13} className="text-amber-600" />
                    <span>Archive Contact</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={13} className="text-brand-700" />
                    <span>Restore Contact</span>
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={closeDetail} className="cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsPage;
