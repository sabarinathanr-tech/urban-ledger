import { useState } from 'react';
import { Package, Plus, Search, Filter, CheckCircle2, X } from 'lucide-react';
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
import { INITIAL_PRODUCTS, type ProductItem } from '@/data/erpData';

export function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'GOODS' | 'SERVICE' | 'COMBO'>('GOODS');
  const [salesPrice, setSalesPrice] = useState<number>(5000);
  const [purchasePrice, setPurchasePrice] = useState<number>(3000);
  const [category, setCategory] = useState('Chairs & Seating');
  const [stock, setStock] = useState<number>(20);

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

    const newProduct: ProductItem = {
      id: `prd-${Date.now()}`,
      name: name.trim(),
      type,
      salesPrice,
      purchasePrice,
      category,
      stock,
      isActive: true,
    };

    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
    setName('');
    setNotice(`Product "${newProduct.name}" added to master inventory catalogue.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Package size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">Master Data: Products & Inventory</h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Furniture catalogue, component purchase costs, sales pricing, and gross margin analytics.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>New Product</span>
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
            placeholder="Search product, category..."
            className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-navy-400" />
          <span className="text-xs text-navy-400">Type:</span>
          {['ALL', 'GOODS', 'SERVICE', 'COMBO'].map((st) => (
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

      {/* Table */}
      <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Sales Price</TableHead>
              <TableHead className="text-right">Cost Price</TableHead>
              <TableHead className="text-right">Gross Margin</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-xs text-navy-400">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => {
                const margin = p.salesPrice - p.purchasePrice;
                const marginPercent = Math.round((margin / p.salesPrice) * 100);
                return (
                  <TableRow key={p.id} className="hover:bg-surface-secondary/60">
                    <TableCell className="font-semibold text-navy-900 text-xs">
                      {p.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.type === 'GOODS' ? 'default' : 'info'}>
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-navy-600">{p.category}</TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                      ₹{p.salesPrice.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-navy-500">
                      ₹{p.purchasePrice.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-semibold text-status-success">
                      ₹{margin.toLocaleString('en-IN')} ({marginPercent}%)
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-navy-700">
                      {p.type === 'SERVICE' ? 'N/A' : `${p.stock} pcs`}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">In Stock</Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-navy-900">Add Furniture Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded p-1 text-navy-400 hover:bg-surface-secondary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ergonomic Office Chair"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'GOODS' | 'SERVICE' | 'COMBO')}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="GOODS">Physical Goods</option>
                    <option value="SERVICE">Service (Assembly/Finishing)</option>
                    <option value="COMBO">Combo Set</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Chairs & Seating">Chairs & Seating</option>
                    <option value="Tables & Desks">Tables & Desks</option>
                    <option value="Living & Lounge">Living & Lounge</option>
                    <option value="Storage & Cabinets">Storage & Cabinets</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Sales Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-700 hover:bg-brand-800">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
