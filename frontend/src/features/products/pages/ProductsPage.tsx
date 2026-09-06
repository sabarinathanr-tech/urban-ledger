import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  X,
  TrendingUp,
  Archive,
  RotateCcw,
  Boxes,
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
import type { ProductItem } from '@/data/erpData';
import { OdooControlPanel, type ViewMode } from '@/components/layout/OdooControlPanel';

const PRESET_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1580481077198-c80753ff6377?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80',
];

export function ProductsPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, addProduct, toggleProductActive, refreshERPData } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'GOODS' | 'SERVICE' | 'COMBO'>('GOODS');
  const [salesPrice, setSalesPrice] = useState<number>(5000);
  const [purchasePrice, setPurchasePrice] = useState<number>(3000);
  const [category, setCategory] = useState('Chairs & Seating');
  const [stock, setStock] = useState<number>(20);
  const [image, setImage] = useState(PRESET_PRODUCT_IMAGES[0]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (location.pathname === ROUTES.PRODUCTS_NEW) {
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [id, products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProduct = addProduct({
      name: name.trim(),
      type,
      salesPrice,
      purchasePrice,
      category,
      stock,
      image,
    });

    setIsModalOpen(false);
    if (location.pathname === ROUTES.PRODUCTS_NEW) {
      navigate(ROUTES.PRODUCTS);
    }
    setName('');
    setNotice(`Product "${newProduct.name}" added to master inventory catalogue.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleToggleActive = (prodId: string) => {
    toggleProductActive(prodId);
    if (selectedProduct && selectedProduct.id === prodId) {
      setSelectedProduct({ ...selectedProduct, isActive: !selectedProduct.isActive });
    }
    setNotice(`Product active status updated.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (location.pathname === ROUTES.PRODUCTS_NEW) {
      navigate(ROUTES.PRODUCTS);
    }
  };

  const closeDetail = () => {
    setSelectedProduct(null);
    if (id) {
      navigate(ROUTES.PRODUCTS);
    }
  };

  const calculateMargin = (sell: number, cost: number) => {
    if (!sell || sell === 0) return 0;
    return Math.round(((sell - cost) / sell) * 100);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title="Products"
        subtitle="Furniture goods, raw timber, upholstery, and finishing services"
        itemCount={filteredProducts.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search product by name or category..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewClick={() => {
          navigate(ROUTES.PRODUCTS_NEW);
          setIsModalOpen(true);
        }}
        newButtonLabel="New Product"
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Goods', value: 'GOODS' },
          { label: 'Services', value: 'SERVICE' },
          { label: 'Combos', value: 'COMBO' },
        ]}
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
        onRefresh={refreshERPData}
      />

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 pt-4 pb-8 space-y-4 w-full max-w-7xl mx-auto">
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
        {/* KANBAN VIEW (Odoo-Style Product Cards)                       */}
        {/* ============================================================ */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-text-muted bg-white rounded-lg border border-surface-border">
                No products found matching filter criteria.
              </div>
            ) : (
              filteredProducts.map((p) => {
                const margin = calculateMargin(p.salesPrice, p.purchasePrice);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="group bg-white rounded-lg border border-surface-border hover:border-navy-400 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
                  >
                    {/* Product Image Banner */}
                    <div className="relative h-36 bg-slate-100 overflow-hidden">
                      {p.image && !imageErrors[p.id] ? (
                        <img
                          src={p.image}
                          alt=""
                          onError={() => setImageErrors((prev) => ({ ...prev, [p.id]: true }))}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-slate-50">
                          <Package size={32} className="opacity-30 text-navy-400" />
                          <span className="text-[10px] text-text-muted mt-1 font-medium">{p.category}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-navy-950/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant={p.type === 'GOODS' ? 'default' : 'info'} className="text-[10px] shadow-xs">
                          {p.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-navy-900 line-clamp-1 group-hover:text-brand-700 transition-colors">
                          {p.name}
                        </h3>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <div>
                            <span className="text-[10px] text-text-muted block">Sales Price</span>
                            <span className="font-mono font-bold text-sm text-emerald-700">
                              ₹{p.salesPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-text-muted block">Cost</span>
                            <span className="font-mono text-xs text-text-muted">
                              ₹{p.purchasePrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Margin & Stock Units */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span
                          className={`inline-flex items-center gap-0.5 font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                            margin >= 30 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <TrendingUp size={11} /> {margin}% margin
                        </span>

                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <Boxes size={12} /> {p.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
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
                  <TableHead className="w-12 text-center">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Sales Price</TableHead>
                  <TableHead className="text-right">Purchase Cost</TableHead>
                  <TableHead className="text-right">Margin %</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="py-8 text-center text-xs text-text-muted">
                      No products found matching filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((p) => {
                    const margin = calculateMargin(p.salesPrice, p.purchasePrice);
                    return (
                      <TableRow
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="text-center py-2">
                          {p.image && !imageErrors[p.id] ? (
                            <img
                              src={p.image}
                              alt=""
                              onError={() => setImageErrors((prev) => ({ ...prev, [p.id]: true }))}
                              className="w-8 h-8 rounded object-cover mx-auto border border-surface-border"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                              <Package size={14} />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-navy-900 text-xs">{p.name}</span>
                        </TableCell>
                        <TableCell className="text-xs text-text-muted">{p.category}</TableCell>
                        <TableCell>
                          <Badge variant={p.type === 'GOODS' ? 'default' : 'info'}>{p.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold text-emerald-700">
                          ₹{p.salesPrice.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-text-muted">
                          ₹{p.purchasePrice.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold">
                          <span className={margin >= 30 ? 'text-emerald-700' : 'text-amber-700'}>
                            {margin}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-medium">
                          {p.stock} units
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={p.isActive ? 'success' : 'default'}>
                            {p.isActive ? 'Active' : 'Archived'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProduct(p)}
                            className="h-7 text-[11px] px-2.5 cursor-pointer"
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ADD PRODUCT MODAL                                            */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h2 className="text-base font-bold text-navy-900">New Product / Item</h2>
                <p className="text-xs text-text-muted">Finished goods, raw materials, or services</p>
              </div>
              <button onClick={closeModal} className="rounded p-1 text-text-muted hover:bg-slate-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* Product Image Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">Product Thumbnail</label>
                <div className="flex items-center gap-3">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border-2 border-navy-700 shadow-xs"
                  />
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {PRESET_PRODUCT_IMAGES.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(url)}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          image === url ? 'border-navy-900 ring-2 ring-navy-400' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Product / Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ergonomic Executive Desk"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Chairs & Seating">Chairs & Seating</option>
                    <option value="Tables & Desks">Tables & Desks</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Finishing Services">Finishing Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Item Classification</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'GOODS' | 'SERVICE' | 'COMBO')}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                  >
                    <option value="GOODS">Stockable Goods</option>
                    <option value="SERVICE">Service (Custom Work)</option>
                    <option value="COMBO">Combo Set</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Sales Price (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Purchase Cost (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white cursor-pointer">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRODUCT DETAIL DRAWER                                        */}
      {/* ============================================================ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                {selectedProduct.image && !imageErrors[selectedProduct.id] ? (
                  <img
                    src={selectedProduct.image}
                    alt=""
                    onError={() => setImageErrors((prev) => ({ ...prev, [selectedProduct.id]: true }))}
                    className="w-14 h-14 rounded-lg object-cover border border-surface-border shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Package size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-navy-900 text-base">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs font-medium">
                      {selectedProduct.category}
                    </Badge>
                    <Badge variant={selectedProduct.type === 'GOODS' ? 'default' : 'info'}>
                      {selectedProduct.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 rounded-md cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-surface-secondary/70 p-3 border border-surface-border">
                <span className="text-[10px] text-text-muted uppercase font-semibold">Sales Price</span>
                <p className="text-base font-bold font-mono text-emerald-700 mt-1">
                  ₹{selectedProduct.salesPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-lg bg-surface-secondary/70 p-3 border border-surface-border">
                <span className="text-[10px] text-text-muted uppercase font-semibold">Purchase Cost</span>
                <p className="text-base font-bold font-mono text-navy-800 mt-1">
                  ₹{selectedProduct.purchasePrice.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-lg bg-surface-secondary/70 p-3 border border-surface-border">
                <span className="text-[10px] text-text-muted uppercase font-semibold">Gross Margin</span>
                <p className="text-base font-bold font-mono text-brand-700 mt-1">
                  {calculateMargin(selectedProduct.salesPrice, selectedProduct.purchasePrice)}%
                </p>
              </div>
            </div>

            {/* Inventory Status */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-text-muted text-[11px]">Warehouse Stock</span>
                <p className="font-bold text-navy-900 text-sm">{selectedProduct.stock} Available Units</p>
              </div>
              <div>
                <span className="text-text-muted text-[11px]">Inventory Asset Value</span>
                <p className="font-bold font-mono text-navy-900 text-sm">
                  ₹{(selectedProduct.stock * selectedProduct.purchasePrice).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Actions: Soft Archive / Restore */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleActive(selectedProduct.id)}
                className="flex items-center gap-1.5 text-xs text-navy-700 cursor-pointer"
              >
                {selectedProduct.isActive ? (
                  <>
                    <Archive size={13} className="text-amber-600" />
                    <span>Archive Product</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={13} className="text-brand-700" />
                    <span>Restore Product</span>
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

export default ProductsPage;
