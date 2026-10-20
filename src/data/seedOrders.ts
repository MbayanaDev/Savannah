import { Order } from '../types';
import { NAIROBI_NEIGHBORHOODS } from './neighborhoods';
import { INITIAL_PRODUCTS } from './products';

export const SEED_ORDERS: Order[] = [
  {
    id: 'SF-89210',
    customerName: 'Amina Wanjiku',
    customerPhone: '+254 722 891 034',
    customerEmail: 'amina.w@gmail.com',
    neighborhood: NAIROBI_NEIGHBORHOODS[0], // Kilimani
    deliveryAddress: 'Apt 4B, Silver Oak Residences, Dennis Pritt Rd',
    deliverySlot: 'Today, 10:00 AM - 12:00 PM (Express)',
    dropoffNote: 'Gate code #402. Leave with security desk if not picking call.',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 }, // Avocados
      { product: INITIAL_PRODUCTS[1], quantity: 1 }, // Greens
      { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Sourdough
      { product: INITIAL_PRODUCTS[7], quantity: 1 }  // Eggs
    ],
    subtotal: 1760,
    deliveryFee: 150,
    discount: 0,
    total: 1910,
    paymentMethod: 'mpesa',
    mpesaCode: 'RJK94209WA',
    paymentStatus: 'paid',
    status: 'out_for_delivery',
    createdAt: '2026-10-17T07:15:00Z',
    dispatchedAt: '2026-10-17T08:30:00Z',
    riderName: 'Juma Otieno',
    riderPhone: '+254 711 409 882',
    riderVehicle: 'Honda ACE 125 (KMDF 849K)'
  },
  {
    id: 'SF-89209',
    customerName: 'Marcus Van Der Meer',
    customerPhone: '+254 733 910 249',
    customerEmail: 'marcus.vdm@outlook.com',
    neighborhood: NAIROBI_NEIGHBORHOODS[3], // Karen
    deliveryAddress: 'House 12, Hardy Forest Mews, Bogani East Rd',
    deliverySlot: 'Today, 2:00 PM - 5:00 PM (Afternoon)',
    dropoffNote: 'Ring the brass bell at the main white gate.',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 3 },
      { product: INITIAL_PRODUCTS[5], quantity: 2 },
      { product: INITIAL_PRODUCTS[9], quantity: 1 },
      { product: INITIAL_PRODUCTS[8], quantity: 1 }
    ],
    subtotal: 2810,
    deliveryFee: 300,
    discount: 0,
    total: 3110,
    paymentMethod: 'mpesa',
    mpesaCode: 'QLE83910KP',
    paymentStatus: 'paid',
    status: 'packing',
    createdAt: '2026-10-17T07:45:00Z'
  },
  {
    id: 'SF-89208',
    customerName: 'Dr. Sharon Mutua',
    customerPhone: '+254 712 550 193',
    customerEmail: 'sharon.mutua@knh.or.ke',
    neighborhood: NAIROBI_NEIGHBORHOODS[1], // Westlands
    deliveryAddress: 'Brookside Court, Block C 2nd Floor, Brookside Dr',
    deliverySlot: 'Today, 8:00 AM - 10:00 AM (Early Harvest)',
    dropoffNote: 'Delivered to reception.',
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 2 },
      { product: INITIAL_PRODUCTS[3], quantity: 2 },
      { product: INITIAL_PRODUCTS[4], quantity: 1 },
      { product: INITIAL_PRODUCTS[10], quantity: 2 }
    ],
    subtotal: 1700,
    deliveryFee: 150,
    discount: 0,
    total: 1850,
    paymentMethod: 'mpesa',
    mpesaCode: 'PLM10934NZ',
    paymentStatus: 'paid',
    status: 'delivered',
    createdAt: '2026-10-17T06:20:00Z',
    dispatchedAt: '2026-10-17T07:00:00Z',
    deliveredAt: '2026-10-17T07:48:00Z',
    riderName: 'Kevin Ndung\'u',
    riderPhone: '+254 720 994 102',
    riderVehicle: 'Savannah Eco-Van (KDJ 319X)'
  },
  {
    id: 'SF-89211',
    customerName: 'Fatuma Hassan',
    customerPhone: '+254 798 123 456',
    customerEmail: 'fatuma.h@fastmail.com',
    neighborhood: NAIROBI_NEIGHBORHOODS[4], // Runda
    deliveryAddress: '48 Whispers Avenue, Runda',
    deliverySlot: 'Today, 2:00 PM - 5:00 PM (Afternoon)',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 2 },
      { product: INITIAL_PRODUCTS[7], quantity: 2 },
      { product: INITIAL_PRODUCTS[8], quantity: 1 }
    ],
    subtotal: 2560,
    deliveryFee: 280,
    discount: 0,
    total: 2840,
    paymentMethod: 'mpesa',
    paymentStatus: 'pending',
    status: 'new',
    createdAt: '2026-10-17T08:10:00Z'
  },
  {
    id: 'SF-89207',
    customerName: 'Brian Kiprop',
    customerPhone: '+254 719 332 901',
    customerEmail: 'brian.k@gmail.com',
    neighborhood: NAIROBI_NEIGHBORHOODS[2], // Lavington
    deliveryAddress: 'Villa 4, Maji Mazuri Rd, Lavington',
    deliverySlot: 'Today, 11:30 AM - 1:30 PM (Express)',
    dropoffNote: 'Leave at security gate pillar.',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 }
    ],
    subtotal: 1250,
    deliveryFee: 180,
    discount: 0,
    total: 1430,
    paymentMethod: 'mpesa',
    mpesaCode: 'TWE91024PL',
    paymentStatus: 'paid',
    status: 'packing',
    createdAt: '2026-10-17T08:45:00Z'
  },
  {
    id: 'SF-89206',
    customerName: 'Sarah Ochieng',
    customerPhone: '+254 728 664 120',
    customerEmail: 'sarah.o@yahoo.com',
    neighborhood: NAIROBI_NEIGHBORHOODS[1], // Westlands
    deliveryAddress: 'Apt 2A, Mvuli Suites, Kipkabus Rd',
    deliverySlot: 'Today, 1:00 PM - 3:00 PM (Afternoon)',
    items: [
      { product: INITIAL_PRODUCTS[4], quantity: 2 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
      { product: INITIAL_PRODUCTS[6], quantity: 1 }
    ],
    subtotal: 1980,
    deliveryFee: 150,
    discount: 0,
    total: 2130,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'new',
    createdAt: '2026-10-17T09:00:00Z'
  },
  {
    id: 'SF-89205',
    customerName: 'David Njuguna',
    customerPhone: '+254 734 881 290',
    customerEmail: 'david.njuguna@gmail.com',
    neighborhood: NAIROBI_NEIGHBORHOODS[0], // Kilimani
    deliveryAddress: 'Penthouse B, Wood Avenue Towers',
    deliverySlot: 'Today, 3:00 PM - 6:00 PM (Evening)',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1 },
      { product: INITIAL_PRODUCTS[5], quantity: 2 }
    ],
    subtotal: 1450,
    deliveryFee: 150,
    discount: 0,
    total: 1600,
    paymentMethod: 'mpesa',
    mpesaCode: 'MKL98231XC',
    paymentStatus: 'paid',
    status: 'delivered',
    createdAt: '2026-10-17T06:00:00Z',
    deliveredAt: '2026-10-17T07:15:00Z'
  }
];
