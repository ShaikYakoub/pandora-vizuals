import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EditableCard } from '@/types/card';
import { DEFAULT_CARDS } from '@/data/defaultCards';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'cards.json');

function getCardsFromDisk(): EditableCard[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading cards.json:', error);
  }
  return DEFAULT_CARDS;
}

function saveCardsToDisk(cards: EditableCard[]) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(cards, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing cards.json:', error);
  }
}

// GET /api/cards?section=home-drop
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const cards = getCardsFromDisk();

  if (section) {
    const filtered = cards
      .filter((c) => c.section === section)
      .sort((a, b) => a.order - b.order);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(cards.sort((a, b) => a.order - b.order));
}

// POST /api/cards - create new card
export async function POST(request: Request) {
  try {
    const newCardData: Partial<EditableCard> = await request.json();
    const cards = getCardsFromDisk();

    const newId = newCardData.id || `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Find highest order in section
    const sectionCards = cards.filter((c) => c.section === newCardData.section);
    const maxOrder = sectionCards.reduce((max, c) => Math.max(max, c.order || 0), 0);

    const newCard: EditableCard = {
      id: newId,
      section: newCardData.section || 'home-edit',
      title: newCardData.title || 'Untitled Card',
      description: newCardData.description || '',
      image: newCardData.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop',
      price: newCardData.price,
      badge: newCardData.badge,
      ctaText: newCardData.ctaText || 'VIEW PIECE',
      ctaLink: newCardData.ctaLink || '#',
      order: typeof newCardData.order === 'number' ? newCardData.order : maxOrder + 1,
      isActive: newCardData.isActive !== false,
      metadata: newCardData.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cards.push(newCard);
    saveCardsToDisk(cards);

    return NextResponse.json(newCard, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create card' }, { status: 500 });
  }
}

// PUT /api/cards - update single card or reorder
export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    let cards = getCardsFromDisk();

    // Check if payload is an array (batch reorder)
    if (Array.isArray(payload)) {
      const orderMap = new Map<string, number>();
      payload.forEach((item, index) => {
        if (item.id) orderMap.set(item.id, typeof item.order === 'number' ? item.order : index + 1);
      });

      cards = cards.map((c) => {
        if (orderMap.has(c.id)) {
          return { ...c, order: orderMap.get(c.id)!, updatedAt: new Date().toISOString() };
        }
        return c;
      });

      saveCardsToDisk(cards);
      return NextResponse.json({ success: true, count: payload.length });
    }

    // Single card update
    const updatedCard: EditableCard = payload;
    const index = cards.findIndex((c) => c.id === updatedCard.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    cards[index] = {
      ...cards[index],
      ...updatedCard,
      updatedAt: new Date().toISOString()
    };

    saveCardsToDisk(cards);
    return NextResponse.json(cards[index]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update card' }, { status: 500 });
  }
}

// DELETE /api/cards?id=xyz
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing card id' }, { status: 400 });
  }

  const cards = getCardsFromDisk();
  const filtered = cards.filter((c) => c.id !== id);

  if (filtered.length === cards.length) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  saveCardsToDisk(filtered);
  return NextResponse.json({ success: true, deletedId: id });
}
