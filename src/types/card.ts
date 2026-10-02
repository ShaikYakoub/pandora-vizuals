export type CardSectionKey = 
  | 'home-drop'
  | 'home-edit'
  | 'home-moodboard'
  | 'home-journal'
  | 'shop'
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
    name: 'The Drop (SS27 Looks)',
    page: 'Homepage — Section 02',
    description: 'Horizontal look cards showcasing the season looks.',
    hasPrice: false,
    hasBadge: false,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Look Number (e.g. 01, 02)', type: 'text', placeholder: '01' }
    ]
  },
  'home-edit': {
    key: 'home-edit',
    name: 'The Edit (Featured Pieces)',
    page: 'Homepage — Section 02 Edit',
    description: 'Grid cards of key signature garments with pricing & badges.',
    hasPrice: true,
    hasBadge: true,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Item Number (e.g. 001)', type: 'text', placeholder: '001' },
      { key: 'category', label: 'Category', type: 'select', options: ['Outerwear', 'Tailoring', 'Knitwear', 'Accessories'] }
    ]
  },
  'home-moodboard': {
    key: 'home-moodboard',
    name: 'Moodboard Polaroids',
    page: 'Homepage — Section 04',
    description: 'Interactive draggable polaroid photos with tape & captions.',
    hasPrice: false,
    hasBadge: false,
    hasCta: false,
    hasDescription: true,
    customFields: [
      { key: 'rotation', label: 'Initial Rotation (deg, e.g. -6, 5)', type: 'number', placeholder: '-4' }
    ]
  },
  'home-journal': {
    key: 'home-journal',
    name: 'Journal Stories',
    page: 'Homepage & Journal',
    description: 'Editorial atelier stories with tags and read times.',
    hasPrice: false,
    hasBadge: true,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'readTime', label: 'Read Time (e.g. 5 MIN)', type: 'text', placeholder: '5 MIN' }
    ]
  },
  'shop': {
    key: 'shop',
    name: 'Shop Catalog Products',
    page: 'Shop Page (/shop)',
    description: 'Full product line displayed in the online store with filtering.',
    hasPrice: true,
    hasBadge: true,
    hasCta: true,
    hasDescription: true,
    customFields: [
      { key: 'itemNumber', label: 'Item Code (e.g. 001)', type: 'text', placeholder: '001' },
      { key: 'category', label: 'Category', type: 'select', options: ['Outerwear', 'Tailoring', 'Knitwear', 'Accessories'] },
      { key: 'colorway', label: 'Colorway', type: 'text', placeholder: 'INK / UNLINED' }
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
