import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { seedProducts } from '../../../prisma/seed-data/products.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateProductInput, UpdateProductInput, ListProductsQuery } from './product.schema.js';

export interface ProductRecord {
  id: string;
  name: string;
  type: 'GOODS' | 'SERVICE' | 'COMBO';
  salesPrice: number;
  purchasePrice: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const memoryProducts = new Map<string, ProductRecord>();

seedProducts.forEach((p) => {
  memoryProducts.set(p.id, {
    id: p.id,
    name: p.name,
    type: p.type,
    salesPrice: parseFloat(p.salesPrice),
    purchasePrice: parseFloat(p.purchasePrice),
    category: p.category,
    isActive: true,
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  });
});

export class ProductService {
  public async listProducts(query: ListProductsQuery): Promise<{ items: ProductRecord[]; total: number }> {
    const { page, limit, search, category, type, isActive } = query;

    if (isDatabaseAvailable()) {
      try {
        const where: any = {};
        if (category) where.category = category;
        if (type) where.type = type;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' },
          }),
          prisma.product.count({ where }),
        ]);

        const mapped = items.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          salesPrice: Number(p.salesPrice),
          purchasePrice: Number(p.purchasePrice),
          category: p.category,
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));

        return { items: mapped, total };
      } catch {
        // fall through to memory
      }
    }

    let all = Array.from(memoryProducts.values());
    if (category) all = all.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (type) all = all.filter((p) => p.type === type);
    if (isActive !== undefined) {
      const activeBool = isActive === 'true';
      all = all.filter((p) => p.isActive === activeBool);
    }
    if (search) {
      const s = search.toLowerCase();
      all = all.filter((p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    return { items, total };
  }

  public async getProductById(id: string): Promise<ProductRecord> {
    if (isDatabaseAvailable()) {
      try {
        const product = await prisma.product.findFirst({
          where: {
            OR: [
              { id },
              { name: { equals: id, mode: 'insensitive' } },
            ],
          },
        });
        if (product) {
          return {
            id: product.id,
            name: product.name,
            type: product.type,
            salesPrice: Number(product.salesPrice),
            purchasePrice: Number(product.purchasePrice),
            category: product.category,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          };
        }
      } catch {
        // fall through to memory
      }
    }

    const product =
      memoryProducts.get(id) ||
      Array.from(memoryProducts.values()).find(
        (p) => p.id === id || p.name.toLowerCase() === id.toLowerCase()
      );
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  public async createProduct(input: CreateProductInput): Promise<ProductRecord> {
    const id = `prd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newProduct: ProductRecord = {
      id,
      name: input.name.trim(),
      type: input.type,
      salesPrice: input.salesPrice,
      purchasePrice: input.purchasePrice,
      category: input.category.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDatabaseAvailable()) {
      try {
        const created = await prisma.product.create({
          data: {
            name: newProduct.name,
            type: newProduct.type,
            salesPrice: newProduct.salesPrice,
            purchasePrice: newProduct.purchasePrice,
            category: newProduct.category,
            isActive: true,
          },
        });
        const mapped = {
          id: created.id,
          name: created.name,
          type: created.type,
          salesPrice: Number(created.salesPrice),
          purchasePrice: Number(created.purchasePrice),
          category: created.category,
          isActive: created.isActive,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        };
        memoryProducts.set(created.id, mapped);
        return mapped;
      } catch {
        // fall through to memory
      }
    }

    memoryProducts.set(id, newProduct);
    return newProduct;
  }

  public async updateProduct(id: string, input: UpdateProductInput): Promise<ProductRecord> {
    const existing = await this.getProductById(id);

    if (isDatabaseAvailable()) {
      try {
        const updated = await prisma.product.update({
          where: { id },
          data: {
            ...(input.name !== undefined && { name: input.name.trim() }),
            ...(input.type !== undefined && { type: input.type }),
            ...(input.salesPrice !== undefined && { salesPrice: input.salesPrice }),
            ...(input.purchasePrice !== undefined && { purchasePrice: input.purchasePrice }),
            ...(input.category !== undefined && { category: input.category.trim() }),
            ...(input.isActive !== undefined && { isActive: input.isActive }),
          },
        });
        const mapped = {
          id: updated.id,
          name: updated.name,
          type: updated.type,
          salesPrice: Number(updated.salesPrice),
          purchasePrice: Number(updated.purchasePrice),
          category: updated.category,
          isActive: updated.isActive,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };
        memoryProducts.set(id, mapped);
        return mapped;
      } catch {
        // fall through to memory
      }
    }

    const updated: ProductRecord = {
      ...existing,
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.salesPrice !== undefined && { salesPrice: input.salesPrice }),
      ...(input.purchasePrice !== undefined && { purchasePrice: input.purchasePrice }),
      ...(input.category !== undefined && { category: input.category.trim() }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      updatedAt: new Date(),
    };
    memoryProducts.set(id, updated);
    return updated;
  }

  public async deleteProduct(id: string): Promise<ProductRecord> {
    return this.updateProduct(id, { isActive: false });
  }
}

export const productService = new ProductService();
export { memoryProducts };
