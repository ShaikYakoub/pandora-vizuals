'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { EditableCard } from '@/types/card';
import { DEFAULT_CARDS } from '@/data/defaultCards';

interface CardsContextType {
  cards: EditableCard[];
  loading: boolean;
  getCardsBySection: (section: string, activeOnly?: boolean) => EditableCard[];
  getCardById: (id: string) => EditableCard | undefined;
  createCard: (card: Partial<EditableCard>) => Promise<EditableCard>;
  updateCard: (card: EditableCard) => Promise<EditableCard>;
  deleteCard: (id: string) => Promise<void>;
  reorderCards: (section: string, cardIds: string[]) => Promise<void>;
  toggleCardActive: (id: string) => Promise<void>;
  resetCards: () => Promise<void>;
  refreshCards: () => Promise<void>;
}

const CardsContext = createContext<CardsContextType | undefined>(undefined);

const STORAGE_KEY = 'bureau27_editable_cards_v3';
const SYNC_EVENT_NAME = 'bureau27_cards_updated';

export function CardsProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<EditableCard[]>(DEFAULT_CARDS);
  const [loading, setLoading] = useState(true);

  // Synchronize state to localStorage and broadcast event
  const persistCards = useCallback((newCards: EditableCard[]) => {
    setCards(newCards);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: newCards }));
      }
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, []);

  // Fetch cards from API, falling back to localStorage or DEFAULT_CARDS
  const fetchCards = useCallback(async () => {
    try {
      // First check local storage for instant render
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCards(parsed);
            }
          } catch (err) {
            console.error('Error parsing stored cards:', err);
          }
        }
      }

      // Try server fetch
      const res = await fetch('/api/cards');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // If server responded, check if localStorage was empty or initialize
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              setCards(data);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch from /api/cards, using local state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();

    // Listen for cross-tab or custom sync events
    const handleSync = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCards(e.detail);
      } else if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setCards(JSON.parse(stored));
          } catch (err) {}
        }
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [fetchCards]);

  const getCardsBySection = useCallback(
    (section: string, activeOnly = true) => {
      return cards
        .filter((c) => {
          if (section === 'shop') {
            return (c.section === 'shop' || c.section === 'home-edit') && (!activeOnly || c.isActive);
          }
          return c.section === section && (!activeOnly || c.isActive);
        })
        .sort((a, b) => a.order - b.order);
    },
    [cards]
  );

  const getCardById = useCallback(
    (id: string) => {
      return cards.find((c) => c.id === id);
    },
    [cards]
  );

  const createCard = useCallback(
    async (cardData: Partial<EditableCard>): Promise<EditableCard> => {
      const newId = cardData.id || `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const sectionCards = cards.filter((c) => c.section === cardData.section);
      const maxOrder = sectionCards.reduce((max, c) => Math.max(max, c.order || 0), 0);

      const newCard: EditableCard = {
        id: newId,
        section: cardData.section || 'home-edit',
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        image: cardData.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop',
        price: cardData.price,
        badge: cardData.badge,
        ctaText: cardData.ctaText || 'VIEW PIECE',
        ctaLink: cardData.ctaLink || '#',
        order: typeof cardData.order === 'number' ? cardData.order : maxOrder + 1,
        isActive: cardData.isActive !== false,
        metadata: cardData.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedCards = [...cards, newCard];
      persistCards(updatedCards);

      // Async sync to server API
      try {
        await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCard)
        });
      } catch (err) {
        console.warn('API sync warning:', err);
      }

      return newCard;
    },
    [cards, persistCards]
  );

  const updateCard = useCallback(
    async (updatedCard: EditableCard): Promise<EditableCard> => {
      const cardWithTimestamp = {
        ...updatedCard,
        updatedAt: new Date().toISOString()
      };

      const updatedCards = cards.map((c) => (c.id === updatedCard.id ? cardWithTimestamp : c));
      persistCards(updatedCards);

      // Async sync to server API
      try {
        await fetch('/api/cards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cardWithTimestamp)
        });
      } catch (err) {
        console.warn('API sync warning:', err);
      }

      return cardWithTimestamp;
    },
    [cards, persistCards]
  );

  const deleteCard = useCallback(
    async (id: string): Promise<void> => {
      const updatedCards = cards.filter((c) => c.id !== id);
      persistCards(updatedCards);

      try {
        await fetch(`/api/cards?id=${id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('API sync warning:', err);
      }
    },
    [cards, persistCards]
  );

  const reorderCards = useCallback(
    async (section: string, cardIds: string[]): Promise<void> => {
      const orderMap = new Map<string, number>();
      cardIds.forEach((id, index) => {
        orderMap.set(id, index + 1);
      });

      const updatedCards = cards.map((card) => {
        if (card.section === section && orderMap.has(card.id)) {
          return { ...card, order: orderMap.get(card.id)!, updatedAt: new Date().toISOString() };
        }
        return card;
      });

      persistCards(updatedCards);

      try {
        const reorderPayload = cardIds.map((id, index) => ({ id, order: index + 1 }));
        await fetch('/api/cards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reorderPayload)
        });
      } catch (err) {
        console.warn('API sync warning:', err);
      }
    },
    [cards, persistCards]
  );

  const toggleCardActive = useCallback(
    async (id: string): Promise<void> => {
      const target = cards.find((c) => c.id === id);
      if (!target) return;

      const updated = { ...target, isActive: !target.isActive, updatedAt: new Date().toISOString() };
      await updateCard(updated);
    },
    [cards, updateCard]
  );

  const resetCards = useCallback(async () => {
    persistCards(DEFAULT_CARDS);
    try {
      await fetch('/api/cards/reset', { method: 'POST' });
    } catch (err) {
      console.warn('API sync warning:', err);
    }
  }, [persistCards]);

  return (
    <CardsContext.Provider
      value={{
        cards,
        loading,
        getCardsBySection,
        getCardById,
        createCard,
        updateCard,
        deleteCard,
        reorderCards,
        toggleCardActive,
        resetCards,
        refreshCards: fetchCards
      }}
    >
      {children}
    </CardsContext.Provider>
  );
}

export function useCards(section?: string, activeOnly = true) {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useCards must be used within a CardsProvider');
  }

  const { getCardsBySection } = context;
  const sectionCards = section ? getCardsBySection(section, activeOnly) : context.cards;

  return {
    ...context,
    sectionCards
  };
}
