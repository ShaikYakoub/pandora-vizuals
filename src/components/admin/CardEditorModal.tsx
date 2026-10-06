'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EditableCard, CardSectionKey, SECTIONS_CONFIG } from '@/types/card';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';

interface CardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Partial<EditableCard>) => Promise<void>;
  initialCard?: EditableCard | null;
  defaultSection?: CardSectionKey;
}

export default function CardEditorModal({
  isOpen,
  onClose,
  onSave,
  initialCard,
  defaultSection = 'home-edit',
}: CardEditorModalProps) {
  const [section, setSection] = useState<CardSectionKey>(initialCard?.section as CardSectionKey || defaultSection);
  const [title, setTitle] = useState(initialCard?.title || '');
  const [description, setDescription] = useState(initialCard?.description || '');
  const [image, setImage] = useState(initialCard?.image || '');
  const [price, setPrice] = useState(initialCard?.price || '');
  const [badge, setBadge] = useState(initialCard?.badge || '');
  const [ctaText, setCtaText] = useState(initialCard?.ctaText || 'VIEW PIECE');
  const [ctaLink, setCtaLink] = useState(initialCard?.ctaLink || '');
  const [order, setOrder] = useState<number>(initialCard?.order || 1);
  const [isActive, setIsActive] = useState<boolean>(initialCard ? initialCard.isActive : true);

  // Metadata / Custom Fields
  const [itemNumber, setItemNumber] = useState(initialCard?.metadata?.itemNumber || '');
  const [category, setCategory] = useState(initialCard?.metadata?.category || 'Reels');
  const [colorway, setColorway] = useState(initialCard?.metadata?.colorway || '');
  const [readTime, setReadTime] = useState(initialCard?.metadata?.readTime || '');
  const [rotation, setRotation] = useState<number>(initialCard?.metadata?.rotation ?? -2);

  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCard) {
      setSection(initialCard.section as CardSectionKey);
      setTitle(initialCard.title);
      setDescription(initialCard.description || '');
      setImage(initialCard.image);
      setPrice(initialCard.price || '');
      setBadge(initialCard.badge || '');
      setCtaText(initialCard.ctaText || 'VIEW PROJECT');
      setCtaLink(initialCard.ctaLink || '');
      setOrder(initialCard.order);
      setIsActive(initialCard.isActive);
      setItemNumber(initialCard.metadata?.itemNumber || '');
      setCategory(initialCard.metadata?.category || 'Reels');
      setColorway(initialCard.metadata?.colorway || '');
      setReadTime(initialCard.metadata?.readTime || '');
      setRotation(initialCard.metadata?.rotation ?? 0);
    } else {
      setSection(defaultSection);
      setTitle('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop');
      setPrice('');
      setBadge('');
      setCtaText('VIEW PROJECT');
      setCtaLink('');
      setOrder(1);
      setIsActive(true);
      setItemNumber('');
      setCategory('Reels');
      setColorway('');
      setReadTime('');
      setRotation(0);
    }
  }, [initialCard, defaultSection, isOpen]);

  if (!isOpen) return null;

  const currentSectionConfig = SECTIONS_CONFIG[section] || SECTIONS_CONFIG['home-edit'];

  // Handle local file upload (converts to base64 Data URL + calls upload API)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        setImage(base64Data);

        // Also attempt upload endpoint
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: base64Data, filename: file.name }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) setImage(data.url);
          }
        } catch (err) {
          // If server upload fails (e.g. static), the base64 URL is already set!
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Card Title is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...(initialCard ? { id: initialCard.id } : {}),
        section,
        title,
        description,
        image: image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop',
        price: price.trim() || undefined,
        badge: badge.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        ctaLink: ctaLink.trim() || undefined,
        order: Number(order) || 1,
        isActive,
        metadata: {
          ...(initialCard?.metadata || {}),
          ...(itemNumber ? { itemNumber } : {}),
          ...(category ? { category } : {}),
          ...(colorway ? { colorway } : {}),
          ...(readTime ? { readTime } : {}),
          ...(section === 'home-moodboard' ? { rotation: Number(rotation) } : {}),
        },
      });
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#141413] border border-[#ece8e1]/20 shadow-2xl text-[#ece8e1] my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ece8e1]/10 flex items-center justify-between bg-[#191918]">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3d17]" />
            <h3 className="font-anton text-2xl tracking-wide uppercase">
              {initialCard ? 'EDIT CARD' : 'CREATE NEW CARD'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c8880] hover:text-[#ece8e1] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans text-xs">
          {/* Section Selection */}
          <div className="space-y-1.5">
            <label className="text-[#8c8880] tracking-wider uppercase block">
              TARGET SECTION / PAGE
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as CardSectionKey)}
              disabled={!!initialCard}
              className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none disabled:opacity-50"
            >
              {Object.values(SECTIONS_CONFIG).map((cfg) => (
                <option key={cfg.key} value={cfg.key}>
                  {cfg.name} ({cfg.page})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#6b675f]">{currentSectionConfig.description}</p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[#8c8880] tracking-wider uppercase block">
              CARD TITLE <span className="text-[#ff3d17]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Void Overcoat or LOOK 01"
              className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[#8c8880] tracking-wider uppercase block">
              DESCRIPTION / SUBTITLE
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Card descriptive copy or silhouette notes..."
              className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none resize-none"
            />
          </div>

          {/* Image Uploader & URL Switcher */}
          <div className="space-y-2 border border-[#ece8e1]/15 p-4 bg-[#0c0c0b]">
            <div className="flex items-center justify-between pb-2 border-b border-[#ece8e1]/10">
              <label className="text-[#8c8880] tracking-wider uppercase block font-bold">
                CARD IMAGE (REPLACEABLE / UPLOADABLE)
              </label>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 text-[10px] tracking-wider uppercase transition-colors ${
                    imageTab === 'upload' ? 'bg-[#ff3d17] text-[#0c0c0b] font-bold' : 'text-[#8c8880]'
                  }`}
                >
                  <Upload className="w-3 h-3 inline mr-1" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 text-[10px] tracking-wider uppercase transition-colors ${
                    imageTab === 'url' ? 'bg-[#ff3d17] text-[#0c0c0b] font-bold' : 'text-[#8c8880]'
                  }`}
                >
                  <LinkIcon className="w-3 h-3 inline mr-1" />
                  Image URL
                </button>
              </div>
            </div>

            {imageTab === 'upload' ? (
              <div className="pt-2">
                <label className="border-2 border-dashed border-[#ece8e1]/20 hover:border-[#ff3d17] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#141413]">
                  <Upload className="w-6 h-6 text-[#ff3d17] mb-2" />
                  <span className="text-[#ece8e1] font-bold">
                    {uploading ? 'Processing Image...' : 'Click to select or drop an image file'}
                  </span>
                  <span className="text-[10px] text-[#6b675f] mt-1">PNG, JPG, WEBP accepted</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="pt-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#141413] border border-[#ece8e1]/20 p-2.5 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
                />
              </div>
            )}

            {/* Live Preview Box */}
            {image && (
              <div className="mt-3 flex items-center space-x-3 pt-2 border-t border-[#ece8e1]/10">
                <div className="relative w-16 h-20 bg-[#171716] border border-[#ece8e1]/20 overflow-hidden flex-shrink-0">
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 overflow-hidden text-[10px] text-[#8c8880] truncate">
                  <div className="text-[#ece8e1] font-bold">Current Preview</div>
                  <div className="truncate">{image}</div>
                </div>
              </div>
            )}
          </div>

          {/* Row: Price & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#8c8880] tracking-wider uppercase block">
                PRICE (OPTIONAL)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. €890"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#8c8880] tracking-wider uppercase block">
                BADGE / TAG (OPTIONAL)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. NEW, LAST PIECES, MANIFESTO"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
              />
            </div>
          </div>

          {/* Row: CTA Text & CTA Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#8c8880] tracking-wider uppercase block">
                BUTTON / CTA TEXT
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. SHOP THE LOOK, VIEW PIECE"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#8c8880] tracking-wider uppercase block">
                BUTTON / CTA LINK
              </label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="e.g. /shop/void-overcoat"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
              />
            </div>
          </div>

          {/* Section Specific Details (Extensible) */}
          <div className="border border-[#ece8e1]/10 p-4 bg-[#171716] space-y-4">
            <div className="text-[11px] font-bold text-[#ff3d17] uppercase tracking-wider">
              SECTION SPECIFIC ATTRIBUTES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#8c8880] tracking-wider uppercase block">
                  ITEM NUMBER / LOOK CODE
                </label>
                <input
                  type="text"
                  value={itemNumber}
                  onChange={(e) => setItemNumber(e.target.value)}
                  placeholder="e.g. 001, 01"
                  className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2.5 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
                />
              </div>

              {(section === 'home-edit' || section === 'shop') && (
                <div className="space-y-1.5">
                  <label className="text-[#8c8880] tracking-wider uppercase block">
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2.5 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
                  >
                    <option value="Reels">Reels</option>
                    <option value="Kids Birthdays">Kids Birthdays</option>
                    <option value="Adult Events">Adult Events</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              )}

              {(section === 'home-edit' || section === 'shop') && (
                <div className="space-y-1.5">
                  <label className="text-[#8c8880] tracking-wider uppercase block">
                    COLORWAY
                  </label>
                  <input
                    type="text"
                    value={colorway}
                    onChange={(e) => setColorway(e.target.value)}
                    placeholder="e.g. INK / UNLINED"
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2.5 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
                  />
                </div>
              )}


              {section === 'home-moodboard' && (
                <div className="space-y-1.5">
                  <label className="text-[#8c8880] tracking-wider uppercase block">
                    ROTATION (DEGREES, E.G. -4, 6)
                  </label>
                  <input
                    type="number"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2.5 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Row: Order & Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div className="space-y-1.5">
              <label className="text-[#8c8880] tracking-wider uppercase block">
                DISPLAY ORDER INDEX
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3 text-[#ece8e1] focus:border-[#ff3d17] outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4 sm:pt-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-[#ff3d17] cursor-pointer"
                />
                <span className="text-[#ece8e1] font-bold tracking-wider uppercase">
                  CARD ACTIVE (VISIBLE TO PUBLIC)
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#ece8e1]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-[#ece8e1]/20 text-[#8c8880] hover:text-[#ece8e1] hover:border-[#ece8e1] transition-colors uppercase tracking-widest font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bureau-btn bureau-btn-primary px-8 py-3 font-bold"
            >
              {saving ? 'SAVING...' : initialCard ? 'UPDATE CARD' : 'CREATE CARD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
