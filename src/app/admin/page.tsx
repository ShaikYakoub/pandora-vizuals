'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCards } from '@/context/CardsContext';
import { EditableCard, CardSectionKey, SECTIONS_CONFIG } from '@/types/card';
import CardEditorModal from '@/components/admin/CardEditorModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  ExternalLink,
  Search,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export default function AdminPage() {
  const {
    cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
    toggleCardActive,
    resetCards,
  } = useCards();

  const [activeSection, setActiveSection] = useState<CardSectionKey>('home-drop');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<EditableCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter cards for current section
  const sectionCards = cards
    .filter((c) => c.section === activeSection)
    .sort((a, b) => a.order - b.order);

  const displayedCards = sectionCards.filter((c) => {
    if (statusFilter === 'active' && !c.isActive) return false;
    if (statusFilter === 'inactive' && c.isActive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      const matchBadge = c.badge?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchBadge;
    }
    return true;
  });

  const activeCount = sectionCards.filter((c) => c.isActive).length;

  // Reorder handlers
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionCards.length) return;

    const newOrder = [...sectionCards];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const orderedIds = newOrder.map((c) => c.id);
    await reorderCards(activeSection, orderedIds);
    addToast('success', `Moved "${temp.title}" ${direction === 'up' ? 'up' : 'down'}`);
  };

  // Delete handler
  const handleDelete = async (card: EditableCard) => {
    if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
      await deleteCard(card.id);
      addToast('info', `Deleted card "${card.title}"`);
    }
  };

  // Duplicate handler
  const handleDuplicate = async (card: EditableCard) => {
    const newCard = await createCard({
      ...card,
      id: undefined,
      title: `${card.title} (Copy)`,
      order: sectionCards.length + 1,
      createdAt: undefined,
      updatedAt: undefined,
    });
    addToast('success', `Duplicated "${card.title}" as new card`);
  };

  // Toggle active handler
  const handleToggle = async (card: EditableCard) => {
    await toggleCardActive(card.id);
    addToast(
      'info',
      `Card "${card.title}" is now ${!card.isActive ? 'Active (Visible)' : 'Inactive (Hidden)'}`
    );
  };

  // Reset handler
  const handleReset = async () => {
    if (
      window.confirm(
        'Restore all cards across all sections to original factory Bureau27 defaults? Any custom cards will be reset.'
      )
    ) {
      await resetCards();
      addToast('success', 'Reset all cards to factory defaults!');
    }
  };

  const handleOpenCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (card: EditableCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleSaveModal = async (cardData: Partial<EditableCard>) => {
    if (editingCard) {
      await updateCard({ ...editingCard, ...cardData } as EditableCard);
      addToast('success', `Updated card "${cardData.title}"`);
    } else {
      await createCard(cardData);
      addToast('success', `Created new card "${cardData.title}"`);
    }
  };

  const activeConfig = SECTIONS_CONFIG[activeSection] || SECTIONS_CONFIG['home-drop'];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-8 sm:py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-[1720px] mx-auto space-y-8">
        {/* Top Management Header Bar */}
        <div className="border border-[#ece8e1]/15 bg-[#141413] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-xs font-sans tracking-widest text-[#8c8880] uppercase">
              <span className="flex items-center gap-1.5 text-[#ff3d17] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#ff3d17] animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span>•</span>
              <span>STUDIO PRODUCTION CMS</span>
            </div>
            <h1 className="font-anton text-4xl sm:text-5xl text-[#ece8e1] tracking-tight uppercase">
              CARD MANAGEMENT
            </h1>
            <p className="text-xs font-sans text-[#8c8880] max-w-xl">
              Edit card titles, descriptions, imagery, pricing, and display orders. Changes synchronize in real-time with the live website without touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#ece8e1]/20 font-sans text-xs uppercase tracking-wider text-[#8c8880] hover:text-[#ece8e1] hover:border-[#ece8e1] transition-colors bg-[#0c0c0b]"
              title="Reset all sections to original factory seed cards"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>FACTORY RESET</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#ff3d17]/40 font-sans text-xs uppercase tracking-wider text-[#ff3d17] hover:bg-[#ff3d17]/10 transition-colors bg-[#0c0c0b]"
            >
              <span>VIEW LIVE SITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleOpenCreate}
              className="bureau-btn bureau-btn-primary px-5 py-2.5 font-bold shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>ADD CARD</span>
            </button>
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-2 border-b border-[#ece8e1]/10 pb-4">
          {(Object.keys(SECTIONS_CONFIG) as CardSectionKey[]).map((secKey) => {
            const cfg = SECTIONS_CONFIG[secKey];
            const isTabActive = activeSection === secKey;
            const count = cards.filter((c) => c.section === secKey).length;

            return (
              <button
                key={secKey}
                onClick={() => setActiveSection(secKey)}
                className={`flex-none font-sans text-xs tracking-wider uppercase px-5 py-3 border transition-all flex items-center space-x-3 ${
                  isTabActive
                    ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1] font-bold shadow-md'
                    : 'border-[#ece8e1]/15 text-[#8c8880] hover:text-[#ece8e1] hover:border-[#ff3d17] bg-[#141413]'
                }`}
              >
                <span>{cfg.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isTabActive ? 'bg-[#0c0c0b] text-[#ece8e1]' : 'bg-[#1c1c1a] text-[#8c8880]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section Context Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#171716] border border-[#ece8e1]/10 px-6 py-4 text-xs font-sans gap-4">
          <div className="space-y-1">
            <div className="text-[#ece8e1] font-bold tracking-wider uppercase">
              {activeConfig.name}
            </div>
            <div className="text-[#8c8880]">
              Location: <span className="text-[#ff3d17]">{activeConfig.page}</span> — {activeConfig.description}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[#8c8880]">
            <div>
              Active: <span className="text-[#ece8e1] font-bold">{activeCount}</span> / {sectionCards.length}
            </div>
          </div>
        </div>

        {/* Search, Filter & Actions Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8880]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards in this section..."
              className="w-full bg-[#141413] border border-[#ece8e1]/15 pl-10 pr-4 py-2.5 text-[#ece8e1] placeholder-[#6b675f] focus:border-[#ff3d17] outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-[#8c8880] tracking-wider uppercase mr-1">Status:</span>
            {(['all', 'active', 'inactive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 uppercase text-[11px] border tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'border-[#ff3d17] text-[#ff3d17] bg-[#ff3d17]/10 font-bold'
                    : 'border-[#ece8e1]/15 text-[#8c8880] hover:text-[#ece8e1] bg-[#141413]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table / List */}
        <div className="border border-[#ece8e1]/15 bg-[#141413] shadow-xl overflow-hidden">
          {displayedCards.length === 0 ? (
            <div className="p-16 text-center space-y-4 font-sans">
              <div className="w-12 h-12 rounded-full bg-[#171716] border border-[#ece8e1]/20 flex items-center justify-center mx-auto text-[#ff3d17]">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-anton text-2xl text-[#ece8e1]">NO CARDS FOUND</h3>
              <p className="text-xs text-[#8c8880] max-w-sm mx-auto">
                No cards match your filter criteria in this section. Add a new card or clear filters.
              </p>
              <button
                onClick={handleOpenCreate}
                className="bureau-btn bureau-btn-primary mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                CREATE FIRST CARD
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#ece8e1]/10 bg-[#191918] text-[#8c8880] uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 w-20 text-center">ORDER</th>
                    <th className="py-4 px-4 w-24">STATUS</th>
                    <th className="py-4 px-4 w-28">IMAGE</th>
                    <th className="py-4 px-6">TITLE &amp; DESCRIPTION</th>
                    <th className="py-4 px-4">PRICE / BADGE</th>
                    <th className="py-4 px-4">CTA ACTION</th>
                    <th className="py-4 px-6 text-right">MANAGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece8e1]/10">
                  {displayedCards.map((card, index) => {
                    const originalIndex = sectionCards.findIndex((c) => c.id === card.id);
                    return (
                      <tr
                        key={card.id}
                        className={`hover:bg-[#1b1b1a] transition-colors ${
                          !card.isActive ? 'opacity-50 bg-[#0f0f0e]' : ''
                        }`}
                      >
                        {/* Order & Reorder Controls */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="font-bold text-[#ece8e1] bg-[#0c0c0b] px-2 py-0.5 border border-[#ece8e1]/20">
                              #{card.order}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleMove(originalIndex, 'up')}
                                disabled={originalIndex === 0}
                                className="p-1 hover:text-[#ff3d17] disabled:opacity-20 transition-colors"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMove(originalIndex, 'down')}
                                disabled={originalIndex === sectionCards.length - 1}
                                className="p-1 hover:text-[#ff3d17] disabled:opacity-20 transition-colors"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Status Toggle Switch */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggle(card)}
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                              card.isActive
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                                : 'bg-red-950/40 text-red-400 border-red-900'
                            }`}
                          >
                            {card.isActive ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span>ACTIVE</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-red-400" />
                                <span>HIDDEN</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Image Thumbnail */}
                        <td className="py-4 px-4">
                          <div className="relative w-16 h-20 bg-[#1a1a18] border border-[#ece8e1]/20 overflow-hidden group">
                            <Image
                              src={card.image}
                              alt={card.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </td>

                        {/* Title & Description */}
                        <td className="py-4 px-6 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-anton text-lg text-[#ece8e1] tracking-wide uppercase">
                              {card.title}
                            </span>
                            {card.metadata?.itemNumber && (
                              <span className="text-[10px] font-sans font-semibold text-[#ff3d17] bg-[#1f1f1d] px-1.5 py-0.5 border border-[#ece8e1]/10">
                                {card.metadata.itemNumber}
                              </span>
                            )}
                          </div>
                          {card.description && (
                            <p className="text-[11px] font-sans text-[#8c8880] line-clamp-2 max-w-md leading-relaxed">
                              {card.description}
                            </p>
                          )}
                          {card.metadata?.category && (
                            <div className="text-[10px] text-[#6b675f] uppercase tracking-wider">
                              Category: {card.metadata.category}
                              {card.metadata?.colorway ? ` • ${card.metadata.colorway}` : ''}
                            </div>
                          )}
                          {card.metadata?.readTime && (
                            <div className="text-[10px] text-[#6b675f] uppercase tracking-wider">
                              Read Time: {card.metadata.readTime}
                            </div>
                          )}
                        </td>

                        {/* Price / Badge */}
                        <td className="py-4 px-4 space-y-1">
                          {card.price ? (
                            <div className="font-bold text-[#ff3d17] text-sm">{card.price}</div>
                          ) : (
                            <div className="text-[#6b675f] text-[10px]">—</div>
                          )}
                          {card.badge && (
                            <span className="inline-block bg-[#ff3d17]/15 text-[#ff3d17] border border-[#ff3d17]/30 text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                              {card.badge}
                            </span>
                          )}
                        </td>

                        {/* CTA Action */}
                        <td className="py-4 px-4 space-y-0.5 text-[11px]">
                          <div className="text-[#ece8e1] font-bold">{card.ctaText || 'NONE'}</div>
                          {card.ctaLink && (
                            <div className="text-[10px] text-[#6b675f] truncate max-w-[140px]">
                              {card.ctaLink}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEdit(card)}
                              className="p-2 border border-[#ece8e1]/15 hover:border-[#ff3d17] hover:text-[#ff3d17] transition-colors text-[#dcd6cc] bg-[#0c0c0b]"
                              title="Edit Card Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(card)}
                              className="p-2 border border-[#ece8e1]/15 hover:border-[#ece8e1] hover:text-[#ece8e1] transition-colors text-[#8c8880] bg-[#0c0c0b]"
                              title="Duplicate Card"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(card)}
                              className="p-2 border border-[#ece8e1]/15 hover:border-red-500 hover:text-red-400 transition-colors text-[#8c8880] bg-[#0c0c0b]"
                              title="Delete Card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Card Editor Modal */}
      <CardEditorModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveModal}
        initialCard={editingCard}
        defaultSection={activeSection}
      />

      {/* Floating Notification Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
