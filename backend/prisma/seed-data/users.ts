export interface SeedUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  plainPassword: string; // Development password to be hashed during seeding
  role: 'ADMIN' | 'ACCOUNTANT' | 'CONTACT';
  contactEmail?: string; // Link to contact by email if applicable
}

export const seedUsers: SeedUser[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Rohith Admin',
    email: 'admin@urbanfurniture.com',
    mobile: '+91 9876543200',
    plainPassword: 'Admin@12345',
    role: 'ADMIN',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Mohith Accountant',
    email: 'accountant@urbanfurniture.com',
    mobile: '+91 9876543201',
    plainPassword: 'Accountant@12345',
    role: 'ACCOUNTANT',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Nimesh Pathak',
    email: 'nimesh@pathak.com',
    mobile: '+91 9876543210',
    plainPassword: 'Contact@12345',
    role: 'CONTACT',
    contactEmail: 'nimesh@pathak.com',
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    name: 'Rohith Admin',
    email: 'admin@urbanledger.com',
    mobile: '+91 9876543200',
    plainPassword: 'Admin@12345',
    role: 'ADMIN',
  },
  {
    id: '22222222-2222-2222-2222-222222222221',
    name: 'Mohith Accountant',
    email: 'accountant@urbanledger.com',
    mobile: '+91 9876543201',
    plainPassword: 'Accountant@12345',
    role: 'ACCOUNTANT',
  },
  {
    id: '33333333-3333-3333-3333-333333333331',
    name: 'Nimesh Pathak',
    email: 'nimesh@gmail.com',
    mobile: '+91 9876543210',
    plainPassword: 'Contact@12345',
    role: 'CONTACT',
    contactEmail: 'nimesh@gmail.com',
  },
  {
    id: '44444444-4444-4444-4444-444444444441',
    name: 'Azure Furniture',
    email: 'azure@furniture.com',
    mobile: '+91 9876543211',
    plainPassword: 'Password@123',
    role: 'CONTACT',
    contactEmail: 'azure@furniture.com',
  },
];
