import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_CARDS } from '@/data/defaultCards';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'cards.json');

export async function POST() {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(DEFAULT_CARDS, null, 2), 'utf-8');
    return NextResponse.json({ success: true, count: DEFAULT_CARDS.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reset cards' }, { status: 500 });
  }
}
