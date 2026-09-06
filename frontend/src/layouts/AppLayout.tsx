import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  FileText,
  Receipt,
  CreditCard,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  ShieldCheck,
  User,
  PieChart,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Search,
  CheckCircle2,
  Armchair,
  SlidersHorizontal,
  Boxes,
  Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { APP_CONFIG, ROUTES } from '@/app/config';
import { useAuth } from '@/context/AuthContext';
import { useERP } from '@/context/ERPContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfileDialog } from '@/components/profile/UserProfileDialog';

interface SubMenuItem {
  label: string;
  path: string;
  description?: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
}

interface TopMenuSection {
  label: string;
  activePaths: string[];
  items: SubMenuItem[];
}

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'profile' | 'permissions'>('profile');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isContact, isAdmin } = useAuth();
  const { ledgerEquality } = useERP();

  const isCustomerContact = isContact && (user?.contactType === 'CUSTOMER' || user?.contactType === 'BOTH' || !user?.contactType);
  const isVendorContact = isContact && (user?.contactType === 'VENDOR' || user?.contactType === 'BOTH');

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ERP Top Menu Definitions
  const TOP_MENUS: TopMenuSection[] = isContact
    ? []
    : [
        {
          label: 'Sales',
          activePaths: ['/sales', '/invoices', '/contacts', '/products'],
          items: [
            {
              label: 'Customers',
              path: `${ROUTES.CONTACTS}?type=CUSTOMER`,
              icon: <Users size={15} />,
              description: 'Client directory & accounts',
            },
            {
              label: 'Products',
              path: ROUTES.PRODUCTS,
              icon: <Armchair size={15} />,
              description: 'Furniture goods & catalog',
            },
            {
              label: 'Sales Orders',
              path: ROUTES.SALES,
              icon: <ShoppingCart size={15} />,
              description: 'Order quotations & confirmations',
            },
            {
              label: 'Customer Invoices',
              path: ROUTES.INVOICES,
              icon: <FileText size={15} />,
              description: 'Tax invoices & billing',
            },
          ],
        },
        {
          label: 'Purchases',
          activePaths: ['/purchases', '/bills', '/contacts', '/products'],
          items: [
            {
              label: 'Vendors',
              path: `${ROUTES.CONTACTS}?type=VENDOR`,
              icon: <Users size={15} />,
              description: 'Raw material suppliers',
            },
            {
              label: 'Products',
              path: ROUTES.PRODUCTS,
              icon: <Package size={15} />,
              description: 'Procurement items & materials',
            },
            {
              label: 'Purchase Orders',
              path: ROUTES.PURCHASES,
              icon: <Package size={15} />,
              description: 'Material orders & reception',
            },
            {
              label: 'Vendor Bills',
              path: ROUTES.BILLS,
              icon: <Receipt size={15} />,
              description: 'Supplier bills & payables',
            },
          ],
        },
        {
          label: 'Accounting',
          activePaths: ['/accounting', '/payments'],
          items: [
            {
              label: 'Payments',
              path: ROUTES.PAYMENTS,
              icon: <CreditCard size={15} />,
              description: 'Receipts & disbursements',
            },
            {
              label: 'Journal Entries',
              path: `${ROUTES.ACCOUNTING}/journal-entries`,
              icon: <BookOpen size={15} />,
              description: 'Double-entry vouchers',
            },
            {
              label: 'General Ledger',
              path: `${ROUTES.ACCOUNTING}/ledger`,
              icon: <BookOpen size={15} />,
              description: 'Chronological account ledger',
            },
            {
              label: 'Chart of Accounts',
              path: `${ROUTES.ACCOUNTING}/chart-of-accounts`,
              icon: <SlidersHorizontal size={15} />,
              description: 'Account classification',
            },
            {
              label: 'Journals',
              path: `${ROUTES.ACCOUNTING}/journals`,
              icon: <BookOpen size={15} />,
              description: 'Sales, Purchase, Bank & Cash',
            },
            {
              label: 'Double-Entry Monitor',
              path: `${ROUTES.ACCOUNTING}/one-truth`,
              icon: <CheckCircle2 size={15} />,
              description: 'Real-time equality verification',
            },
          ],
        },
        {
          label: 'Reporting',
          activePaths: ['/reports'],
          items: [
            {
              label: 'Balance Sheet',
              path: `${ROUTES.REPORTS}/balance-sheet`,
              icon: <BarChart3 size={15} />,
              description: 'Assets, Liabilities & Equity',
            },
            {
              label: 'Profit & Loss',
              path: `${ROUTES.REPORTS}/profit-loss`,
              icon: <BarChart3 size={15} />,
              description: 'Operating income & expenses',
            },
            {
              label: 'Budget Report',
              path: `${ROUTES.REPORTS}/budget`,
              icon: <PieChart size={15} />,
              description: 'Analytic cost center variance',
            },
            {
              label: 'Stock Valuation',
              path: `${ROUTES.REPORTS}/stock`,
              icon: <Boxes size={15} />,
              description: 'Inventory valuation report',
            },
          ],
        },
        {
          label: 'Configuration',
          activePaths: ['/budgets', '/users', '/create-user', '/settings'],
          items: [
            {
              label: 'Budgets',
              path: ROUTES.BUDGETS,
              icon: <PieChart size={15} />,
              description: 'Financial budgets & variance',
            },
            {
              label: 'Analytic Accounts',
              path: ROUTES.BUDGETS_ANALYTIC,
              icon: <SlidersHorizontal size={15} />,
              description: 'Cost centers & analytic distribution',
            },
            ...(isAdmin
              ? [
                  {
                    label: 'Users',
                    path: ROUTES.USERS,
                    icon: <ShieldCheck size={15} />,
                    description: 'User management & permissions',
                    adminOnly: true,
                  },
                ]
              : []),
            {
              label: 'Settings',
              path: ROUTES.SETTINGS,
              icon: <Settings size={15} />,
              description: 'Company profile & ERP parameters',
            },
          ],
        },
      ];

  const searchableLinks = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, group: 'Overview' },
    ...TOP_MENUS.flatMap((m) =>
      m.items.map((i) => ({ label: i.label, path: i.path, group: m.label }))
    ),
  ];

  const filteredLinks = globalSearch.trim()
    ? searchableLinks.filter(
        (item) =>
          item.label.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.group.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const getRoleBadgeVariant = (): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (user?.role) {
      case 'ADMIN':
        return 'danger';
      case 'ACCOUNTANT':
        return 'info';
      case 'CONTACT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-secondary text-navy-900 font-sans antialiased">
      {/* ============================================================ */}
      {/* HORIZONTAL TOP ERP NAVIGATION BAR                            */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-[#714B67] text-white shadow-md border-b border-[#5E3B55]">
        <div className="flex items-center justify-between px-3 sm:px-5 h-12">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-purple-100 hover:text-white hover:bg-white/15 lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Logo & Name */}
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-95 transition-opacity"
            >
              <div className="w-7 h-7 rounded-md bg-white p-0.5 flex items-center justify-center shadow-xs border border-white/20 overflow-hidden">
                <img src="/logo-light.png" alt="Urban Ledger" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                {APP_CONFIG.name}
              </span>
            </Link>
          </div>

          {/* Center: Main Navigation Menu (Desktop) */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1 mx-4">
            {/* Dashboard Direct Tab (Internal Admin/Accountant Only) */}
            {!isContact && (
              <NavLink
                to={ROUTES.DASHBOARD}
                end
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-black/20 text-white font-semibold shadow-xs'
                      : 'text-purple-100 hover:text-white hover:bg-white/15'
                  )
                }
              >
                Dashboard
              </NavLink>
            )}

            {/* Contact Portal Direct Tabs (Strictly Role & Type Scoped) */}
            {isContact && (
              <>
                <NavLink
                  to={ROUTES.DASHBOARD}
                  end
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-black/20 text-white font-semibold shadow-xs'
                        : 'text-purple-100 hover:text-white hover:bg-white/15'
                    )
                  }
                >
                  Dashboard
                </NavLink>
                {isCustomerContact && (
                  <NavLink
                    to={ROUTES.INVOICES}
                    className={({ isActive }) =>
                      cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-black/20 text-white font-semibold shadow-xs'
                          : 'text-purple-100 hover:text-white hover:bg-white/15'
                      )
                    }
                  >
                    My Invoices
                  </NavLink>
                )}
                {isVendorContact && (
                  <NavLink
                    to={ROUTES.BILLS}
                    className={({ isActive }) =>
                      cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-black/20 text-white font-semibold shadow-xs'
                          : 'text-purple-100 hover:text-white hover:bg-white/15'
                      )
                    }
                  >
                    My Bills
                  </NavLink>
                )}
                <NavLink
                  to={ROUTES.PAYMENTS}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-black/20 text-white font-semibold shadow-xs'
                        : 'text-purple-100 hover:text-white hover:bg-white/15'
                    )
                  }
                >
                  My Payments
                </NavLink>
              </>
            )}

            {/* ERP Dropdowns (Admin & Accountant) */}
            {!isContact &&
              TOP_MENUS.map((menu) => {
                const isMenuCurrent = menu.activePaths.some((p) =>
                  location.pathname.startsWith(p)
                );
                const isOpen = activeDropdown === menu.label;

                return (
                  <div key={menu.label} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(menu.label)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                        isMenuCurrent || isOpen
                          ? 'bg-black/20 text-white font-semibold shadow-xs'
                          : 'text-purple-100 hover:text-white hover:bg-white/15'
                      )}
                      aria-expanded={isOpen}
                    >
                      <span>{menu.label}</span>
                      <ChevronDown
                        size={13}
                        className={cn('transition-transform duration-150', isOpen && 'rotate-180')}
                      />
                    </button>

                    {/* Dropdown Popup */}
                    {isOpen && (
                      <div className="absolute left-0 mt-1.5 w-64 bg-white text-navy-900 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        {menu.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              'flex items-start gap-2.5 px-3.5 py-2 text-xs hover:bg-slate-50 transition-colors group',
                              location.pathname === item.path && 'bg-slate-50 font-semibold text-brand-700'
                            )}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="p-1 rounded bg-slate-100 text-slate-600 group-hover:bg-brand-700 group-hover:text-white transition-colors mt-0.5">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-navy-900 leading-snug">{item.label}</div>
                              {item.description && (
                                <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>

          {/* Right: Search, Books Balanced Status, User Profile Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Search Input (Global search) */}
            <div className="relative hidden xl:block w-48">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-200 pointer-events-none"
              />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-black/20 border border-white/20 rounded-md text-white placeholder:text-purple-200/70 focus:bg-black/30 focus:outline-none focus:border-white/50 transition-all"
              />
              {globalSearch.trim().length > 0 && (
                <div className="absolute left-0 mt-1 w-56 bg-white text-navy-900 rounded-lg shadow-xl border border-slate-200 py-1 z-50 max-h-60 overflow-y-auto">
                  {filteredLinks.length > 0 ? (
                    filteredLinks.slice(0, 6).map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setGlobalSearch('')}
                        className="flex flex-col px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-navy-900">{link.label}</span>
                        <span className="text-[10px] text-text-muted">{link.group}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-text-muted">No matching menu item</div>
                  )}
                </div>
              )}
            </div>

            {/* Double-Entry Equality Status Pill */}
            {!isContact && (
              <Link
                to={`${ROUTES.ACCOUNTING}/one-truth`}
                title={`Double-Entry Status: ${ledgerEquality.status}. Total Debits match Total Credits.`}
                className={cn(
                  'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                  ledgerEquality.isBalanced
                    ? 'bg-emerald-950/80 text-emerald-200 border-emerald-400/40 hover:bg-emerald-900'
                    : 'bg-red-950/80 text-red-200 border-red-400/40 hover:bg-red-900 animate-pulse'
                )}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    ledgerEquality.isBalanced ? 'bg-emerald-400' : 'bg-red-400'
                  )}
                />
                <span className="text-[11px]">
                  {ledgerEquality.isBalanced ? 'Books Balanced' : 'Unbalanced!'}
                </span>
              </Link>
            )}



            {/* User Avatar with Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-white/40">
                  {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">
                    {user?.fullName || user?.name || 'User'}
                  </span>
                  <span className="text-[10px] text-purple-200 leading-tight truncate max-w-[120px]">
                    {user?.role}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  className={cn(
                    'hidden sm:inline text-purple-200 transition-transform duration-150',
                    profileDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Profile Dropdown Popup */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white text-navy-900 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {user?.fullName || user?.name || 'User'}
                    </p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant={getRoleBadgeVariant()} className="text-[10px] px-1.5 py-0 font-semibold">
                        {user?.role}
                      </Badge>
                      <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setProfileTab('profile');
                        setProfileOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-navy-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <User size={14} className="text-slate-500" />
                      <span>My Profile</span>
                    </button>

                    {!isContact && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setProfileTab('permissions');
                          setProfileOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-navy-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                      >
                        <ShieldCheck size={14} className="text-slate-500" />
                        <span>Permissions</span>
                      </button>
                    )}

                    {isAdmin && (
                      <Link
                        to={ROUTES.USERS}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-navy-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                      >
                        <ShieldCheck size={14} className="text-slate-500" />
                        <span>Admin: Users</span>
                      </Link>
                    )}


                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Collapsible Accordion) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#5E3B55] border-t border-[#4E3047] px-4 py-3 space-y-3 animate-in slide-in-from-top duration-150 max-h-[80vh] overflow-y-auto">
            {!isContact && (
              <NavLink
                to={ROUTES.DASHBOARD}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/15"
              >
                Dashboard
              </NavLink>
            )}

            {isContact ? (
              <>
                <NavLink
                  to={ROUTES.DASHBOARD}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-purple-100 hover:text-white hover:bg-white/10"
                >
                  Dashboard
                </NavLink>
                {isCustomerContact && (
                  <NavLink
                    to={ROUTES.INVOICES}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm text-purple-100 hover:text-white hover:bg-white/10"
                  >
                    My Invoices
                  </NavLink>
                )}
                {isVendorContact && (
                  <NavLink
                    to={ROUTES.BILLS}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm text-purple-100 hover:text-white hover:bg-white/10"
                  >
                    My Bills
                  </NavLink>
                )}
                <NavLink
                  to={ROUTES.PAYMENTS}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-purple-100 hover:text-white hover:bg-white/10"
                >
                  My Payments
                </NavLink>
              </>
            ) : (
              TOP_MENUS.map((menu) => (
                <div key={menu.label} className="space-y-1">
                  <div className="text-xs font-bold text-purple-200 uppercase tracking-wider px-3 py-1">
                    {menu.label}
                  </div>
                  {menu.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-purple-100 hover:text-white hover:bg-white/15"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))
            )}

            <div className="pt-2 border-t border-[#4E3047] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileTab('profile');
                    setProfileOpen(true);
                  }}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <User size={14} /> Profile
                </button>
                {!isContact && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileTab('permissions');
                      setProfileOpen(true);
                    }}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck size={14} /> Permissions
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </header>



      {/* Contact Portal Restricted Notice */}
      {isContact &&
        (location.pathname.startsWith(ROUTES.SALES) ||
          location.pathname.startsWith(ROUTES.PURCHASES) ||
          location.pathname.startsWith(ROUTES.ACCOUNTING) ||
          location.pathname.startsWith(ROUTES.REPORTS) ||
          location.pathname.startsWith(ROUTES.BUDGETS) ||
          location.pathname.startsWith(ROUTES.PRODUCTS)) && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-amber-900">
                <span className="font-semibold">Contact Portal:</span> Internal accounting ledgers and operational modules are restricted. You can access your invoices, bills, and payments.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.INVOICES)}
              className="text-xs h-7 border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              Go to My Invoices
            </Button>
          </div>
        )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface-secondary">
        <Outlet />
      </main>

      {/* User Profile Dialog */}
      <UserProfileDialog
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        initialTab={profileTab}
      />
    </div>
  );
}
