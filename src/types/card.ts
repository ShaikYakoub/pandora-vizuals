export type CardSectionKey = 
  | 'home-drop'
  | 'home-edit'
  | 'home-moodboard'
  | 'work'
  | 'lookbook';

export interface EditableCard {
  id: string;
  section: CardSectionKey | string;
  title: string;
  description: string;
  image: string;
  price?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
  metadata?: {
    itemNumber?: string;
    category?: string;
    readTime?: string;
    rotation?: number;
    colorway?: string;
    sizes?: string[];
    details?: string[];
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionDefinition {
  key: CardSectionKey;
  name: string;
  page: string;
  description: string;
  hasPrice: boolean;
  hasBadge: boolean;
  hasCta: boolean;
  hasDescription: boolean;
  customFields?: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
    placeholder?: string;
  }[];
}

export const SECTIONS_CONFIG: Record<CardSectionKey, SectionDefinition> = {
  'home-drop': {
    key: 'home-drop',
    name: 'Production Reels & Highlights',
    page: 'Homepage — Section 02',
    description: 'Horizontal cards showcasing recent reels, birthday shoots & video highlights.',
    hasPrice: false,
    hasBadge: false,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Production Number (e.g. 01, 02)', type: 'text', placeholder: '01' }
    ]
  },
  'home-edit': {
    key: 'home-edit',
    name: 'Featured Productions & Packages',
    page: 'Homepage — Section 02 Productions',
    description: 'Grid cards of featured reels, birthday photography & campaign packages.',
    hasPrice: true,
    hasBadge: true,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Item Number (e.g. 001)', type: 'text', placeholder: '001' },
      { key: 'category', label: 'Category', type: 'select', options: ['Reels', 'Kids Birthdays', 'Adult Events', 'Digital Marketing', 'Commercial'] }
    ]
  },
  'home-moodboard': {
    key: 'home-moodboard',
    name: 'Production Board Polaroids',
    page: 'Homepage — Section 04',
    description: 'Interactive draggable production shots with tape & captions.',
    hasPrice: false,
    hasBadge: false,
    hasCta: false,
    hasDescription: true,
    customFields: [
      { key: 'rotation', label: 'Initial Rotation (deg, e.g. -6, 5)', type: 'number', placeholder: '-4' }
    ]
  },
  'work': {
    key: 'work',
    name: 'Work Productions & Packages',
    page: 'Work Page (/work)',
    description: 'Full portfolio of reels, event photography, birthday shoots & digital marketing.',
    hasPrice: true,
    hasBadge: true,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Item Code (e.g. 001)', type: 'text', placeholder: '001' },
      { key: 'category', label: 'Category', type: 'select', options: ['Reels', 'Kids Birthdays', 'Adult Events', 'Digital Marketing', 'Commercial'] },
      { key: 'colorway', label: 'Format / Deliverable', type: 'text', placeholder: '4K REEL / RAW EDITS' }
    ]
  },
  'lookbook': {
    key: 'lookbook',
    name: 'Lookbook Chapters',
    page: 'Lookbook Page (/lookbook)',
    description: 'Editorial lookbook photography chapters.',
    hasPrice: false,
    hasBadge: true,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Chapter (e.g. CHAPTER 01)', type: 'text', placeholder: 'CHAPTER 01' }
    ]
  }
};
