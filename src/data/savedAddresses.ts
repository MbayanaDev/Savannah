import { SavedAddress } from '../types';

export const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    tag: 'Default',
    iconName: 'home',
    street: 'Dennis Pritt Road',
    region: 'Kilimani',
    apartment: 'Silver Oak Court, Apt 3B',
    reference: 'Near Shell petrol station opposite Friends supermarket',
    instructions: 'Ring buzzer 3B. Leave at door if no answer.'
  },
  {
    id: 'work',
    label: 'Work',
    tag: 'Office',
    iconName: 'work',
    street: 'Riverside Drive',
    region: 'Westlands',
    apartment: 'Riverside Green Offices, 4th Floor',
    reference: 'Opposite Riverside Square Mall, near Java House',
    instructions: 'Deliver to main reception desk.'
  },
  {
    id: 'kims',
    label: "Kim's place",
    tag: 'Friend',
    iconName: 'friend',
    street: 'James Gichuru Road',
    region: 'Lavington',
    apartment: 'Maple Crest Villa #12',
    reference: 'Near Lavington Curve, opposite Shell station',
    instructions: 'Gate code 4022. Call on arrival.'
  },
  {
    id: 'karen',
    label: 'Karen Retreat',
    tag: 'Family',
    iconName: 'family',
    street: 'Bogani East Road',
    region: 'Karen',
    apartment: 'House 8, Acacia Mews',
    reference: 'Opposite Karen Country Club, near Gate 2',
    instructions: 'Gate intercom at pillar. Call on arrival.'
  }
];
