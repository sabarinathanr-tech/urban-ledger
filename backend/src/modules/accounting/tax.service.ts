export interface TaxCalculationResult {
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export class TaxService {
  /**
   * Computes applicable taxes for invoice/bill line items.
   */
  public computeTax(baseAmount: number, taxRate = 0.18): TaxCalculationResult {
    const taxAmount = Number((baseAmount * taxRate).toFixed(2));
    const totalAmount = Number((baseAmount + taxAmount).toFixed(2));

    return {
      baseAmount,
      taxRate,
      taxAmount,
      totalAmount,
    };
  }
}

export const taxService = new TaxService();
