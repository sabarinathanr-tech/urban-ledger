import type { Request, Response, NextFunction } from 'express';
import { productService } from './product.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { CreateProductInput, UpdateProductInput, ListProductsQuery } from './product.schema.js';

export class ProductController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.listProducts(req.query as unknown as ListProductsQuery);
      sendSuccess(res, 'Products retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getProductById(req.params.id as string);
      sendSuccess(res, 'Product retrieved successfully', product);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.createProduct(req.body as CreateProductInput);
      sendSuccess(res, 'Product created successfully', product, 201);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.updateProduct(req.params.id as string, req.body as UpdateProductInput);
      sendSuccess(res, 'Product updated successfully', product);
    } catch (err) {
      next(err);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.deleteProduct(req.params.id as string);
      sendSuccess(res, 'Product deactivated successfully', product);
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
