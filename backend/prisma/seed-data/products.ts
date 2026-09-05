export interface SeedProduct {
  id: string;
  name: string;
  type: 'GOODS' | 'SERVICE' | 'COMBO';
  salesPrice: string;
  purchasePrice: string;
  category: string;
}

export const seedProducts: SeedProduct[] = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    name: 'Office Chair',
    type: 'GOODS',
    salesPrice: '4500.00',
    purchasePrice: '2800.00',
    category: 'Chairs',
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    name: 'Wooden Table',
    type: 'GOODS',
    salesPrice: '12000.00',
    purchasePrice: '7500.00',
    category: 'Tables',
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    name: 'Sofa',
    type: 'GOODS',
    salesPrice: '25000.00',
    purchasePrice: '16000.00',
    category: 'Living Room',
  },
  {
    id: 'p4444444-4444-4444-4444-444444444444',
    name: 'Dining Table',
    type: 'GOODS',
    salesPrice: '18000.00',
    purchasePrice: '11000.00',
    category: 'Dining',
  },
];
