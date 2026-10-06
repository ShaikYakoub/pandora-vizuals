'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  WORK_PHOTO_SLOTS,
  WORK_VIDEO_SLOTS,
  ALL_WORK_SLOTS,
  WorkMediaSlot,
  AddedWorkMediaItem,
} from '@/data/workSlots';
import {
  Lock,
  LogOut,
  Upload,
  RotateCcw,
  ExternalLink,
  Search,
  RefreshCw,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';

interface SlotOverride {
  image?: string;
  videoUrl?: string;
  updatedAt?: string;
}

type ManifestOverrides = Record<string, SlotOverride>;

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Media data & filters
  const [overrides, setOverrides] = useState<ManifestOverrides>({});
  const [addedMedia, setAddedMedia] = useState<AddedWorkMediaItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'new' | 'photos' | 'videos' | 'modified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingSlots, setUploadingSlots] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // "Add New Media" Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newTitle, setNewTitle] = useState('');
  const [newAspectRatio, setNewAspectRatio] = useState<'photo' | '9:16' | '16:9'>('photo');
  const [newCategory, setNewCategory] = useState('');
  const [newPrimaryFile, setNewPrimaryFile] = useState<File | null>(null);
  const [newPosterFile, setNewPosterFile] = useState<File | null>(null);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const newPrimaryFileRef = useRef<HTMLInputElement>(null);
  const newPosterFileRef = useRef<HTMLInputElement>(null);

  // Token helper
  const getToken = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('pv_admin_token') || '';
  };

  const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pv_admin_token', token);
    }
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pv_admin_token');
    }
  };

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check auth & fetch live R2 manifest
  const checkAuth = async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/admin/auth-check', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setAdminEmail(data.email || 'Admin');
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchManifest = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/work-media');
      if (res.ok) {
        const data = await res.json();
        setOverrides(data.overrides || {});
        setAddedMedia(Array.isArray(data.added) ? data.added : []);
      }
    } catch {
      addToast('error', 'Failed to fetch R2 manifest');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchManifest();
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        setAdminEmail(data.email);
        addToast('success', 'Authenticated successfully with Cloudflare R2 console');
        fetchManifest();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Network error while connecting to authentication service');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    setAdminEmail('');
    addToast('info', 'Signed out from admin console');
  };

  // Handle Create New Media (Prepended on top)
  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrimaryFile) {
      addToast('error', 'Please choose a media file to upload');
      return;
    }

    const token = getToken();
    setIsSubmittingNew(true);

    try {
      const formData = new FormData();
      formData.append('mediaType', newMediaType);
      formData.append('title', newTitle.trim() || (newMediaType === 'video' ? 'New Cinema Reel' : 'New Photo Shoot'));
      formData.append('aspectRatio', newAspectRatio);
      if (newCategory.trim()) formData.append('category', newCategory.trim());
      formData.append('file', newPrimaryFile);
      if (newPosterFile) formData.append('posterFile', newPosterFile);

      const res = await fetch('/api/admin/create-media', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.manifest) {
          setOverrides(data.manifest.overrides || {});
          setAddedMedia(Array.isArray(data.manifest.added) ? data.manifest.added : []);
        } else if (data.item) {
          setAddedMedia((prev) => [data.item, ...prev]);
        }
        addToast('success', 'New media published to top of Work page!');
        setIsAddModalOpen(false);
        // Reset modal form
        setNewTitle('');
        setNewCategory('');
        setNewPrimaryFile(null);
        setNewPosterFile(null);
      } else {
        addToast('error', data.error || 'Failed to create new media');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Error creating media');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Handle Delete Added Media
  const handleDeleteAddedMedia = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This item will be removed from the top of the Work page.`)) {
      return;
    }

    const token = getToken();
    try {
      const res = await fetch('/api/admin/delete-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.manifest) {
          setOverrides(data.manifest.overrides || {});
          setAddedMedia(Array.isArray(data.manifest.added) ? data.manifest.added : []);
        } else {
          setAddedMedia((prev) => prev.filter((item) => item.id !== id));
        }
        addToast('info', `Removed "${title}" from Work page`);
      } else {
        addToast('error', data.error || 'Failed to delete media item');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Error deleting media');
    }
  };

  // Handle file upload/replace
  const handleFileUpload = async (slotId: string, mediaField: 'image' | 'videoUrl', file: File) => {
    const token = getToken();
    setUploadingSlots((prev) => ({ ...prev, [slotId]: `Uploading ${mediaField}...` }));

    try {
      const formData = new FormData();
      formData.append('slotId', slotId);
      formData.append('mediaField', mediaField);
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.manifest) {
          setOverrides(data.manifest.overrides || {});
          setAddedMedia(Array.isArray(data.manifest.added) ? data.manifest.added : []);
        }
        addToast('success', `Updated ${slotId} in R2! Public site is updated.`);
      } else {
        addToast('error', data.error || 'Failed to upload file to R2');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Error uploading file');
    } finally {
      setUploadingSlots((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    }
  };

  // Handle baseline slot reset to factory static
  const handleReset = async (slotId: string, mediaField: 'image' | 'videoUrl' | 'all' = 'all') => {
    if (!window.confirm(`Reset slot "${slotId}" to factory default media? This will clear its R2 override.`)) {
      return;
    }

    const token = getToken();
    setUploadingSlots((prev) => ({ ...prev, [slotId]: 'Resetting...' }));

    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ slotId, mediaField }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.manifest) {
          setOverrides(data.manifest.overrides || {});
          setAddedMedia(Array.isArray(data.manifest.added) ? data.manifest.added : []);
        }
        addToast('success', `Reset ${slotId} to factory static default`);
      } else {
        addToast('error', data.error || 'Failed to reset slot');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Error resetting slot');
    } finally {
      setUploadingSlots((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    }
  };

  // Filter newly added items (ALWAYS ON TOP)
  const filteredAddedMedia = useMemo(() => {
    return addedMedia.filter((item) => {
      if (filterType === 'photos' && item.mediaType !== 'photo') return false;
      if (filterType === 'videos' && item.mediaType !== 'video') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [addedMedia, filterType, searchQuery]);

  // Filter baseline slots
  const filteredBaselineSlots = useMemo(() => {
    if (filterType === 'new') return [];

    return ALL_WORK_SLOTS.filter((slot) => {
      if (filterType === 'photos' && slot.mediaType !== 'photo') return false;
      if (filterType === 'videos' && slot.mediaType !== 'video') return false;
      if (filterType === 'modified') {
        const ov = overrides[slot.id];
        if (!ov || (!ov.image && !ov.videoUrl)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = slot.id.toLowerCase().includes(q);
        const matchTitle = slot.title.toLowerCase().includes(q);
        const matchCategory = slot.category?.toLowerCase().includes(q);
        return matchId || matchTitle || matchCategory;
      }

      return true;
    });
  }, [filterType, searchQuery, overrides]);

  const modifiedCount = useMemo(() => {
    return Object.keys(overrides).filter((k) => overrides[k]?.image || overrides[k]?.videoUrl).length;
  }, [overrides]);

  // Loading screen
  if (isAuthenticated === null) {
    return (
      <div className="w-full min-h-screen bg-[#0c0c0b] text-[#ece8e1] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#ff3d17] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#8c8880]">Initializing Secure R2 Console...</p>
        </div>
      </div>
    );
  }

  // 1. UNPROTECTED LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#0c0c0b] text-[#ece8e1] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
        <div className="w-full max-w-md bg-[#141413] border border-[#ece8e1]/15 p-8 sm:p-10 shadow-2xl relative space-y-8">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1c1c1a] border border-[#ece8e1]/10 text-[11px] text-[#ff3d17] uppercase tracking-widest font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>CLOUDFLARE R2 CONSOLE</span>
            </div>
            <h1 className="font-anton text-3xl sm:text-4xl text-[#ece8e1] uppercase tracking-wide">
              ADMIN SIGN IN
            </h1>
            <p className="text-xs text-[#8c8880] leading-relaxed">
              Authenticate to manage and add new Work page media stored in Cloudflare R2 bucket (<code className="text-[#ece8e1]">IMAGES</code>).
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-none text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#8c8880] font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@pandoravizuals.com"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 px-4 py-3 text-sm text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#8c8880] font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 px-4 py-3 text-sm text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full cursor-pointer py-3.5 bg-[#ece8e1] text-[#0c0c0b] hover:bg-[#ff3d17] hover:text-[#ece8e1] disabled:opacity-50 text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ACCESS CONSOLE</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#ece8e1]/10 text-[11px] text-[#6b675f]">
            Protected by Cloudflare Pages Functions &amp; Web Crypto HMAC
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-8 sm:py-12 px-4 sm:px-8 font-sans selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
      <div className="max-w-[1680px] mx-auto space-y-8">

        {/* Top Management Header Bar */}
        <div className="border border-[#ece8e1]/15 bg-[#141413] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-widest text-[#8c8880] uppercase">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                R2 BINDING: IMAGES
              </span>
              <span>•</span>
              <span className="text-[#ece8e1]">USER: {adminEmail}</span>
              <span>•</span>
              <span className="text-[#ff3d17]">LATEST ITEMS ALWAYS PUBLISH ON TOP</span>
            </div>
            <h1 className="font-anton text-4xl sm:text-5xl text-[#ece8e1] tracking-tight uppercase">
              WORK MEDIA MANAGER
            </h1>
            <p className="text-xs text-[#8c8880] max-w-2xl leading-relaxed">
              Upload new photos or cinema videos to display at the top of the <code className="text-[#ece8e1]">/work</code> page, or replace existing media slots. All files stream straight to Cloudflare R2 bucket without redeploying.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Action: Add New Media */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer px-5 py-2.5 bg-[#ff3d17] hover:bg-[#ff5533] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW MEDIA (ON TOP)</span>
            </button>

            <button
              onClick={fetchManifest}
              disabled={isRefreshing}
              className="cursor-pointer px-4 py-2.5 border border-[#ece8e1]/20 bg-[#1c1c1a] hover:border-[#ece8e1] text-xs font-bold uppercase tracking-wider text-[#ece8e1] flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>SYNC R2</span>
            </button>

            <Link
              href="/work/"
              target="_blank"
              className="cursor-pointer px-4 py-2.5 bg-[#ece8e1] text-[#0c0c0b] hover:bg-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>VIEW LIVE /WORK</span>
            </Link>

            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2.5 border border-red-900/50 bg-red-950/20 hover:bg-red-950/50 text-red-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ece8e1]/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-colors ${
                filterType === 'all'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              ALL ITEMS ({ALL_WORK_SLOTS.length + addedMedia.length})
            </button>

            {addedMedia.length > 0 && (
              <button
                onClick={() => setFilterType('new')}
                className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors ${
                  filterType === 'new'
                    ? 'bg-[#ff3d17] text-white border-[#ff3d17]'
                    : 'bg-[#ff3d17]/10 text-[#ff3d17] border-[#ff3d17]/40 hover:bg-[#ff3d17]/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEWLY ADDED ON TOP ({addedMedia.length})</span>
              </button>
            )}

            <button
              onClick={() => setFilterType('photos')}
              className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                filterType === 'photos'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PHOTOS ({WORK_PHOTO_SLOTS.length + addedMedia.filter(m => m.mediaType === 'photo').length})</span>
            </button>

            <button
              onClick={() => setFilterType('videos')}
              className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                filterType === 'videos'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>VIDEOS ({WORK_VIDEO_SLOTS.length + addedMedia.filter(m => m.mediaType === 'video').length})</span>
            </button>

            {modifiedCount > 0 && (
              <button
                onClick={() => setFilterType('modified')}
                className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                  filterType === 'modified'
                    ? 'bg-emerald-500 text-[#0c0c0b] border-emerald-500'
                    : 'bg-[#141413] text-emerald-400 border-emerald-800/40 hover:border-emerald-500'
                }`}
              >
                <span>BASELINE REPLACEMENTS ({modifiedCount})</span>
              </button>
            )}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8880]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or title..."
              className="w-full bg-[#141413] border border-[#ece8e1]/15 pl-10 pr-4 py-2 text-xs text-[#ece8e1] placeholder-[#6b675f] focus:border-[#ff3d17] outline-none"
            />
          </div>
        </div>

        {/* SECTION 1: NEWLY ADDED ITEMS (ALWAYS DISPLAYED ON TOP) */}
        {filteredAddedMedia.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#ff3d17]">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">NEW MEDIA PUBLISHED ON TOP ({filteredAddedMedia.length})</span>
              <span className="text-[#8c8880]">· Appears before all baseline cards on live site</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAddedMedia.map((item) => (
                <AddedMediaCard
                  key={item.id}
                  item={item}
                  isUploading={Boolean(uploadingSlots[item.id])}
                  uploadStatus={uploadingSlots[item.id]}
                  onFileUpload={(field, file) => handleFileUpload(item.id, field, file)}
                  onDelete={() => handleDeleteAddedMedia(item.id, item.title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: BASELINE PORTFOLIO SLOTS */}
        {filterType !== 'new' && filteredBaselineSlots.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#8c8880]">
              BASELINE WORK PORTFOLIO SLOTS ({filteredBaselineSlots.length})
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBaselineSlots.map((slot) => {
                const override = overrides[slot.id];
                const isOverridden = Boolean(override && (override.image || override.videoUrl));
                const activeImage = override?.image || slot.defaultImage;
                const activeVideoUrl = override?.videoUrl || slot.defaultVideoUrl;
                const isUploading = Boolean(uploadingSlots[slot.id]);
                const uploadStatus = uploadingSlots[slot.id];

                return (
                  <SlotEditorCard
                    key={slot.id}
                    slot={slot}
                    override={override}
                    isOverridden={isOverridden}
                    activeImage={activeImage}
                    activeVideoUrl={activeVideoUrl}
                    isUploading={isUploading}
                    uploadStatus={uploadStatus}
                    onFileUpload={(field, file) => handleFileUpload(slot.id, field, file)}
                    onReset={(field) => handleReset(slot.id, field)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {filteredAddedMedia.length === 0 && filteredBaselineSlots.length === 0 && (
          <div className="p-16 border border-[#ece8e1]/15 bg-[#141413] text-center space-y-4">
            <h3 className="font-anton text-2xl text-[#8c8880]">NO MEDIA FOUND</h3>
            <p className="text-xs text-[#6b675f]">
              Try clearing filters or add a new media piece.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW MEDIA (PUBLISHED ON TOP) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0b]/85 backdrop-blur-md">
          <div className="bg-[#141413] border border-[#ece8e1]/20 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ece8e1]/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-[#ff3d17]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PUBLISH TO TOP</span>
                </div>
                <h2 className="font-anton text-2xl sm:text-3xl text-[#ece8e1] uppercase">
                  ADD NEW MEDIA
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#8c8880] hover:text-[#ece8e1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateMedia} className="space-y-5">
              {/* Media Type Toggle */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#8c8880]">
                  Media Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewMediaType('photo');
                      setNewAspectRatio('photo');
                    }}
                    className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider border flex items-center justify-center space-x-2 transition-colors ${
                      newMediaType === 'photo'
                        ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                        : 'bg-[#0c0c0b] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>PHOTO (STILL)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewMediaType('video');
                      setNewAspectRatio('9:16');
                    }}
                    className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider border flex items-center justify-center space-x-2 transition-colors ${
                      newMediaType === 'video'
                        ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                        : 'bg-[#0c0c0b] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>CINEMA VIDEO</span>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#8c8880]">
                  Production Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={newMediaType === 'video' ? 'e.g., Midnight Commercial Reel' : 'e.g., Golden Hour Editorial'}
                  className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 px-3.5 py-2.5 text-xs text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none"
                />
              </div>

              {/* If Video: Aspect Ratio Selection */}
              {newMediaType === 'video' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8c8880]">
                    Video Aspect Ratio &amp; Layout
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewAspectRatio('9:16')}
                      className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                        newAspectRatio === '9:16'
                          ? 'border-[#ff3d17] bg-[#ff3d17]/15 text-[#ff3d17]'
                          : 'border-[#ece8e1]/15 text-[#8c8880] hover:text-[#ece8e1]'
                      }`}
                    >
                      9:16 Vertical Reel
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewAspectRatio('16:9')}
                      className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                        newAspectRatio === '16:9'
                          ? 'border-[#ff3d17] bg-[#ff3d17]/15 text-[#ff3d17]'
                          : 'border-[#ece8e1]/15 text-[#8c8880] hover:text-[#ece8e1]'
                      }`}
                    >
                      16:9 Widescreen Cinema
                    </button>
                  </div>
                </div>
              )}

              {/* Category (Optional) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#8c8880]">
                  Category / Tag (Optional)
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Commercial, Reels, Kids Birthdays, Adult Events"
                  className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 px-3.5 py-2.5 text-xs text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none"
                />
              </div>

              {/* Primary File Upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#8c8880]">
                  {newMediaType === 'video' ? 'Video File (.mp4, .webm, .mov)' : 'Photo File (.webp, .jpg, .png, .avif)'}
                </label>
                <input
                  ref={newPrimaryFileRef}
                  type="file"
                  required
                  accept={newMediaType === 'video' ? 'video/*,.mp4,.webm,.mov' : 'image/*,.webp,.jpg,.jpeg,.png,.avif'}
                  onChange={(e) => setNewPrimaryFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2 text-xs text-[#ece8e1] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#1c1c1a] file:text-[#ece8e1] file:text-[11px] file:uppercase file:cursor-pointer"
                />
              </div>

              {/* Poster File Upload (Only if Video) */}
              {newMediaType === 'video' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#8c8880]">
                    Video Poster Thumbnail (Optional Still)
                  </label>
                  <input
                    ref={newPosterFileRef}
                    type="file"
                    accept="image/*,.webp,.jpg,.jpeg,.png"
                    onChange={(e) => setNewPosterFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2 text-xs text-[#ece8e1] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#1c1c1a] file:text-[#ece8e1] file:text-[11px] file:uppercase file:cursor-pointer"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="w-full cursor-pointer py-3 bg-[#ff3d17] hover:bg-[#ff5533] text-white disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-lg"
                >
                  {isSubmittingNew ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>STREAMING TO R2 BUCKET...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>PUBLISH TO TOP OF /WORK</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`p-3.5 border shadow-2xl text-xs flex items-center space-x-2.5 pointer-events-auto cursor-pointer transition-all ${
              toast.type === 'success'
                ? 'bg-[#141413] border-emerald-600 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-[#141413] border-red-600 text-red-300'
                : 'bg-[#141413] border-[#ece8e1]/30 text-[#ece8e1]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-none" />}
            <span className="flex-1">{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-component for newly added media cards (published on top)
interface AddedCardProps {
  item: AddedWorkMediaItem;
  isUploading: boolean;
  uploadStatus?: string;
  onFileUpload: (field: 'image' | 'videoUrl', file: File) => void;
  onDelete: () => void;
}

function AddedMediaCard({
  item,
  isUploading,
  uploadStatus,
  onFileUpload,
  onDelete,
}: AddedCardProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isVideo = item.mediaType === 'video';
  const aspectClass =
    item.aspectRatio === '16:9'
      ? 'aspect-video'
      : item.aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : 'aspect-[3/4]';

  return (
    <div className="bg-[#141413] border-2 border-[#ff3d17]/50 p-5 flex flex-col justify-between space-y-4 shadow-2xl relative group">
      {/* Uploading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-[#0c0c0b]/85 z-20 flex flex-col items-center justify-center p-4 space-y-3 backdrop-blur-xs">
          <RefreshCw className="w-6 h-6 text-[#ff3d17] animate-spin" />
          <span className="text-xs font-mono tracking-wider text-[#ece8e1] uppercase">
            {uploadStatus || 'Updating R2...'}
          </span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,.webp,.jpg,.jpeg,.png,.avif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileUpload('image', e.target.files[0])}
      />
      {isVideo && (
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*,.mp4,.webm,.mov"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileUpload('videoUrl', e.target.files[0])}
        />
      )}

      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-white bg-[#ff3d17] px-2 py-0.5">
            NEW ON TOP
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE IN R2
          </span>
        </div>

        <h3 className="font-anton text-lg text-[#ece8e1] uppercase tracking-wide truncate" title={item.title}>
          {item.title}
        </h3>

        <div className="text-[10px] font-mono text-[#8c8880] uppercase">
          Format: {item.aspectRatio === '16:9' ? '16:9 Widescreen' : item.aspectRatio === '9:16' ? '9:16 Vertical Reel' : 'Photo'}
          {item.category ? ` • ${item.category}` : ''}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <div className={`relative w-full ${aspectClass} bg-[#0c0c0b] border border-[#ece8e1]/10 overflow-hidden`}>
          {isVideo && item.videoUrl ? (
            <video
              src={item.videoUrl}
              poster={item.image}
              controls
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="320px"
            />
          )}
        </div>

        <div className="text-[10px] font-mono text-[#6b675f] truncate" title={isVideo ? item.videoUrl : item.image}>
          R2 URL: <span className="text-[#8c8880]">{isVideo ? (item.videoUrl || item.image) : item.image}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-[#ece8e1]/10">
        <div className="flex items-center space-x-2">
          {isVideo ? (
            <>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex-1 cursor-pointer py-2 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
              >
                <Upload className="w-3 h-3" />
                <span>VIDEO</span>
              </button>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex-1 cursor-pointer py-2 border border-[#ece8e1]/20 bg-[#1c1c1a] text-[#ece8e1] hover:border-[#ece8e1] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
              >
                <ImageIcon className="w-3 h-3" />
                <span>POSTER</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex-1 cursor-pointer py-2 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>REPLACE PHOTO</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="cursor-pointer p-2 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-300 hover:text-white transition-colors"
            title="Delete this media from Work page"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for baseline editable slot card
interface SlotCardProps {
  slot: WorkMediaSlot;
  override?: SlotOverride;
  isOverridden: boolean;
  activeImage: string;
  activeVideoUrl?: string;
  isUploading: boolean;
  uploadStatus?: string;
  onFileUpload: (field: 'image' | 'videoUrl', file: File) => void;
  onReset: (field: 'image' | 'videoUrl' | 'all') => void;
}

function SlotEditorCard({
  slot,
  isOverridden,
  activeImage,
  activeVideoUrl,
  isUploading,
  uploadStatus,
  onFileUpload,
  onReset,
}: SlotCardProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isVideo = slot.mediaType === 'video';
  const aspectClass =
    slot.aspectRatio === '16:9'
      ? 'aspect-video'
      : slot.aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : 'aspect-[3/4]';

  return (
    <div className="bg-[#141413] border border-[#ece8e1]/15 p-5 flex flex-col justify-between space-y-4 shadow-xl relative group">
      {/* Uploading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-[#0c0c0b]/85 z-20 flex flex-col items-center justify-center p-4 space-y-3 backdrop-blur-xs">
          <RefreshCw className="w-6 h-6 text-[#ff3d17] animate-spin" />
          <span className="text-xs font-mono tracking-wider text-[#ece8e1] uppercase">
            {uploadStatus || 'Processing R2 upload...'}
          </span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,.webp,.jpg,.jpeg,.png,.avif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileUpload('image', e.target.files[0])}
      />
      {isVideo && (
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*,.mp4,.webm,.mov"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileUpload('videoUrl', e.target.files[0])}
        />
      )}

      {/* Card Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-[#ff3d17] bg-[#1c1c1a] px-2 py-0.5 border border-[#ece8e1]/10">
            {slot.id}
          </span>

          {isOverridden ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 uppercase font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE IN R2
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1c1c1a] text-[#8c8880] border border-[#ece8e1]/10 uppercase">
              DEFAULT STATIC
            </span>
          )}
        </div>

        <h3 className="font-anton text-lg text-[#ece8e1] uppercase tracking-wide truncate" title={slot.title}>
          {slot.title}
        </h3>

        <div className="text-[10px] font-mono text-[#8c8880] uppercase">
          Format: {slot.aspectRatio === '16:9' ? '16:9 Widescreen' : slot.aspectRatio === '9:16' ? '9:16 Vertical Reel' : 'Photo'}
          {slot.category ? ` • ${slot.category}` : ''}
        </div>
      </div>

      {/* Current Preview Container */}
      <div className="space-y-2">
        <div className={`relative w-full ${aspectClass} bg-[#0c0c0b] border border-[#ece8e1]/10 overflow-hidden`}>
          {isVideo && activeVideoUrl ? (
            <video
              src={activeVideoUrl}
              poster={activeImage}
              controls
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={activeImage}
              alt={slot.title}
              fill
              className="object-cover"
              sizes="320px"
            />
          )}
        </div>

        <div className="text-[10px] font-mono text-[#6b675f] truncate" title={isVideo ? activeVideoUrl : activeImage}>
          Source: <span className="text-[#8c8880]">{isVideo ? (activeVideoUrl || activeImage) : activeImage}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-[#ece8e1]/10">
        {isVideo ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="cursor-pointer py-2 px-2.5 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-3 h-3" />
              <span>REPLACE VIDEO</span>
            </button>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="cursor-pointer py-2 px-2.5 border border-[#ece8e1]/20 hover:border-[#ece8e1] bg-[#1c1c1a] text-[#ece8e1] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              <ImageIcon className="w-3 h-3" />
              <span>POSTER</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="w-full cursor-pointer py-2.5 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>UPLOAD / REPLACE PHOTO</span>
          </button>
        )}

        {isOverridden && (
          <button
            type="button"
            onClick={() => onReset('all')}
            className="w-full cursor-pointer py-2 border border-red-900/60 bg-red-950/20 hover:bg-red-950/60 text-red-300 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET TO FACTORY DEFAULT</span>
          </button>
        )}
      </div>
    </div>
  );
}
