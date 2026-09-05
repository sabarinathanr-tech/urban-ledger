import { useState } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, MapPin, CheckCircle2, X } from 'lucide-react';
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
import { INITIAL_CONTACTS, type ContactItem } from '@/data/erpData';

export function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>(INITIAL_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New Contact Form
  const [name, setName] = useState('');
  const [type, setType] = useState<'CUSTOMER' | 'VENDOR' | 'BOTH'>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeVariant = (contactType: ContactItem['type']) => {
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

    const newContact: ContactItem = {
      id: `cnt-${Date.now()}`,
      name: name.trim(),
      type,
      email: email.trim(),
      mobile: mobile.trim(),
      city: city.trim() || 'Mumbai',
      state: state.trim(),
      pincode: pincode.trim() || '400001',
      isActive: true,
      totalReceivable: 0,
      totalPayable: 0,
    };

    setContacts([newContact, ...contacts]);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setMobile('');
    setCity('');
    setPincode('');
    setNotice(`Master Contact "${newContact.name}" registered successfully.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Users size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">Master Data: Contacts</h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Customers, suppliers, raw material vendors, and partner address book with financial balances.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add Contact</span>
        </Button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-md border border-brand-200 bg-brand-50/80 p-3 text-xs text-brand-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-700" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-brand-600 hover:text-brand-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contact, email, city..."
            className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-navy-400" />
          <span className="text-xs text-navy-400">Type:</span>
          {['ALL', 'CUSTOMER', 'VENDOR', 'BOTH'].map((st) => (
            <button
              key={st}
              onClick={() => setTypeFilter(st)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                typeFilter === st
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact Name</TableHead>
              <TableHead>Relationship Type</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Mobile Phone</TableHead>
              <TableHead>City & State</TableHead>
              <TableHead className="text-right">Receivable</TableHead>
              <TableHead className="text-right">Payable</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-xs text-navy-400">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((c) => (
                <TableRow key={c.id} className="hover:bg-surface-secondary/60">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-800 font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-navy-900 text-xs">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(c.type)}>{c.type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-navy-400" />
                      <span>{c.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-navy-400" />
                      <span>{c.mobile}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-navy-400" />
                      <span>{c.city}, {c.state}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-semibold text-status-success">
                    {c.totalReceivable ? `₹${c.totalReceivable.toLocaleString('en-IN')}` : '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-semibold text-status-danger">
                    {c.totalPayable ? `₹${c.totalPayable.toLocaleString('en-IN')}` : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-navy-900">Add New Contact</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded p-1 text-navy-400 hover:bg-surface-secondary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Company / Individual Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nimesh Pathak or Azure Furniture"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Contact Role</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'CUSTOMER' | 'VENDOR' | 'BOTH')}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                >
                  <option value="CUSTOMER">Customer (Receivables)</option>
                  <option value="VENDOR">Vendor / Supplier (Payables)</option>
                  <option value="BOTH">Both (Partner)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@domain.com"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-700 hover:bg-brand-800">
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
