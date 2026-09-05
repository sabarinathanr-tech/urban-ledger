export interface SeedContact {
  id: string;
  name: string;
  type: 'CUSTOMER' | 'VENDOR' | 'BOTH';
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
}

export const seedContacts: SeedContact[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Nimesh Pathak',
    type: 'CUSTOMER',
    email: 'nimesh@pathak.com',
    mobile: '+91 9876543210',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Azure Furniture',
    type: 'VENDOR',
    email: 'orders@azurefurniture.com',
    mobile: '+91 9876543211',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Rahul Sharma',
    type: 'VENDOR',
    email: 'rahul@sharmawoods.com',
    mobile: '+91 9876543212',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444441',
    name: 'Nimesh Pathak',
    type: 'CUSTOMER',
    email: 'nimesh@gmail.com',
    mobile: '+91 9876543210',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444442',
    name: 'Azure Furniture',
    type: 'VENDOR',
    email: 'azure@furniture.com',
    mobile: '+91 9876543211',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];
