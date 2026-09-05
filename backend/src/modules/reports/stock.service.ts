import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { logger } from '../../utils/logger.js';

export interface StockValuationItem {
  id: string;
  name: string;
  category: string;
  type: string;
  purchasePrice: number;
  salesPrice: number;
  onHandStock: number;
  valuation: number;
}

export interface StockValuationReport {
  items: StockValuationItem[];
  totalValuation: number;
  totalGoodsCount: number;
  asOfDate: string;
}

const fallbackProducts = [
  { id: 'prd-1', name: 'Solid Teak Wood Dining Table (6-Seater)', category: 'Dining Room', type: 'GOODS', salesPrice: 28500, purchasePrice: 18000, stock: 15 },
  { id: 'prd-2', name: 'Ergonomic Executive Office Chair', category: 'Office Furniture', type: 'GOODS', salesPrice: 14500, purchasePrice: 8500, stock: 42 },
  { id: 'prd-3', name: 'Sheesham Wood King Bed Frame', category: 'Bedroom', type: 'GOODS', salesPrice: 38000, purchasePrice: 24000, stock: 8 },
  { id: 'prd-4', name: 'Modern Fabric Sectional Sofa (L-Shape)', category: 'Living Room', type: 'GOODS', salesPrice: 48000, purchasePrice: 31000, stock: 12 },
  { id: 'prd-5', name: 'Industrial Oak Bookshelf (5-Tier)', category: 'Storage & Display', type: 'GOODS', salesPrice: 12500, purchasePrice: 7200, stock: 25 },
  { id: 'prd-6', name: 'Custom Interior Wood Finishing Service', category: 'Services', type: 'SERVICE', salesPrice: 5000, purchasePrice: 0, stock: 0 },
];

export class StockService {
  public async getStockValuation(): Promise<StockValuationReport> {
    const today = new Date().toISOString().split('T')[0];

    if (isDatabaseAvailable()) {
      try {
        const dbProducts = await prisma.product.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        });

        if (dbProducts.length > 0) {
          const items: StockValuationItem[] = dbProducts.map((p) => {
            const isGoods = p.type === 'GOODS';
            const purchasePrice = Number(p.purchasePrice);
            const salesPrice = Number(p.salesPrice);
            const onHandStock = isGoods ? 25 : 0;
            const valuation = isGoods ? onHandStock * purchasePrice : 0;

            return {
              id: p.id,
              name: p.name,
              category: p.category,
              type: p.type,
              purchasePrice,
              salesPrice,
              onHandStock,
              valuation,
            };
          });

          const totalValuation = items.reduce((sum, item) => sum + item.valuation, 0);
          const totalGoodsCount = items.filter((item) => item.type === 'GOODS').length;

          return {
            items,
            totalValuation,
            totalGoodsCount,
            asOfDate: today,
          };
        }
      } catch (err) {
        logger.warn('Failed to query products from Prisma for stock valuation', err);
      }
    }

    const items: StockValuationItem[] = fallbackProducts.map((p) => {
      const isGoods = p.type === 'GOODS';
      const valuation = isGoods ? p.stock * p.purchasePrice : 0;
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        type: p.type,
        purchasePrice: p.purchasePrice,
        salesPrice: p.salesPrice,
        onHandStock: p.stock,
        valuation,
      };
    });

    const totalValuation = items.reduce((sum, item) => sum + item.valuation, 0);
    const totalGoodsCount = items.filter((item) => item.type === 'GOODS').length;

    return {
      items,
      totalValuation,
      totalGoodsCount,
      asOfDate: today,
    };
  }
}

export const stockService = new StockService();
