import { NairobiNeighborhood } from '../types';

export const NAIROBI_NEIGHBORHOODS: NairobiNeighborhood[] = [
  {
    id: 'kilimani',
    name: 'Kilimani & Kileleshwa',
    zone: 'Central',
    deliveryFee: 150,
    freeThreshold: 3500,
    minMins: 45,
    maxMins: 90,
    expressAvailable: true,
    popularEstate: 'Dennis Pritt, Argwings Kodhek, State House Rd'
  },
  {
    id: 'westlands',
    name: 'Westlands & Parklands',
    zone: 'West',
    deliveryFee: 150,
    freeThreshold: 3500,
    minMins: 40,
    maxMins: 80,
    expressAvailable: true,
    popularEstate: 'Brookside, Rhapta Rd, Highridge, 3rd Parklands'
  },
  {
    id: 'lavington',
    name: 'Lavington & Riverside',
    zone: 'West',
    deliveryFee: 180,
    freeThreshold: 3500,
    minMins: 50,
    maxMins: 95,
    expressAvailable: true,
    popularEstate: 'James Gichuru, Riverside Dr, Muthangari'
  },
  {
    id: 'karen',
    name: 'Karen & Lang\'ata',
    zone: 'Karen & Suburbs',
    deliveryFee: 300,
    freeThreshold: 4500,
    minMins: 60,
    maxMins: 110,
    expressAvailable: true,
    popularEstate: 'Hardy, Karen Plains, Galleria, Mbagathi Way'
  },
  {
    id: 'runda',
    name: 'Runda, Gigiri & Rosslyn',
    zone: 'North',
    deliveryFee: 280,
    freeThreshold: 4500,
    minMins: 60,
    maxMins: 105,
    expressAvailable: true,
    popularEstate: 'UN Avenue, Whispers, Rosslyn Lone Tree'
  },
  {
    id: 'kitisuru',
    name: 'Kitisuru & Spring Valley',
    zone: 'North',
    deliveryFee: 240,
    freeThreshold: 4000,
    minMins: 50,
    maxMins: 90,
    expressAvailable: true,
    popularEstate: 'Nyari Estate, Kyuna, Spring Valley Crescent'
  },
  {
    id: 'muthaiga',
    name: 'Muthaiga & Old Muthaiga',
    zone: 'North',
    deliveryFee: 220,
    freeThreshold: 4000,
    minMins: 50,
    maxMins: 90,
    expressAvailable: true,
    popularEstate: 'Limuru Rd, Muthaiga Club area'
  },
  {
    id: 'upperhill',
    name: 'Upper Hill & CBD Fringe',
    zone: 'Central',
    deliveryFee: 180,
    freeThreshold: 3500,
    minMins: 45,
    maxMins: 85,
    expressAvailable: true,
    popularEstate: 'Hospital Rd, Kilimanjaro Ave, Ngong Rd entry'
  },
  {
    id: 'southbc',
    name: 'South B, South C & Nairobi West',
    zone: 'South',
    deliveryFee: 250,
    freeThreshold: 4000,
    minMins: 60,
    maxMins: 100,
    expressAvailable: true,
    popularEstate: 'Golden Gate, Five Star, Madaraka, Akiba'
  },
  {
    id: 'ngongroad',
    name: 'Ngong Road, Jamhuri & Adams',
    zone: 'West',
    deliveryFee: 200,
    freeThreshold: 3500,
    minMins: 50,
    maxMins: 90,
    expressAvailable: true,
    popularEstate: 'Adams Arcade, Jamhuri Estate, Impala Club'
  },
  {
    id: 'kasarani',
    name: 'Roysambu & Garden City / Thika Rd',
    zone: 'North',
    deliveryFee: 350,
    freeThreshold: 5000,
    minMins: 75,
    maxMins: 120,
    expressAvailable: false,
    popularEstate: 'Garden City Residences, Mirema, TRM strip'
  },
  {
    id: 'mombasaroad',
    name: 'Syokimau & Mombasa Road',
    zone: 'South',
    deliveryFee: 380,
    freeThreshold: 5000,
    minMins: 80,
    maxMins: 130,
    expressAvailable: false,
    popularEstate: 'Gateway Mall, Katani Rd, Syokimau Airport side'
  }
];

export const DEFAULT_NEIGHBORHOOD = NAIROBI_NEIGHBORHOODS[0]; // Kilimani
