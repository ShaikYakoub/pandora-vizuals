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
  Upload,
  RotateCcw,
  RefreshCw,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  Smartphone,
  Play,
} from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail } from '@/utils/youtube';

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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Media data & filters
  const [overrides, setOverrides] = useState<ManifestOverrides>({});
  const [addedMedia, setAddedMedia] = useState<AddedWorkMediaItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'videos' | '16:9' | '9:16'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingSlots, setUploadingSlots] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // "Add New Media" Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newAspectRatio, setNewAspectRatio] = useState<'photo' | '9:16' | '16:9'>('photo');
  const [newPrimaryFile, setNewPrimaryFile] = useState<File | null>(null);
  const [newPosterFile, setNewPosterFile] = useState<File | null>(null);
  const [newYouTubeUrl, setNewYouTubeUrl] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Link Edit Modal state (for updating YouTube link on existing cards)
  const [editingLinkSlotId, setEditingLinkSlotId] = useState<string | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState('');
  const [isSavingLink, setIsSavingLink] = useState(false);

  const newPrimaryFileRef = useRef<HTMLInputElement>(null);
  const newPosterFileRef = useRef<HTMLInputElement>(null);

  // Concurrency & batch deletion queue refs
  const pendingDeleteQueueRef = useRef<string[]>([]);
  const isDeletingRef = useRef<boolean>(false);
  const locallyDeletedIdsRef = useRef<Set<string>>(new Set());

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
    }, 4000);
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
        setIsAuthenticated(true);
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
      const res = await fetch(`/api/work-media?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const serverDeleted: string[] = Array.isArray(data.deleted) ? data.deleted : [];
        const mergedDeleted = Array.from(new Set([...serverDeleted, ...locallyDeletedIdsRef.current]));
        const delSet = new Set(mergedDeleted);
        const serverAdded = Array.isArray(data.added) ? data.added : [];

        setOverrides(data.overrides || {});
        setDeletedIds(mergedDeleted);
        setAddedMedia(serverAdded.filter((item: AddedWorkMediaItem) => !delSet.has(item.id)));

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('pandora_work_manifest', JSON.stringify({
              overrides: data.overrides || {},
              added: serverAdded.filter((item: AddedWorkMediaItem) => !delSet.has(item.id)),
              deleted: mergedDeleted,
            }));
            window.dispatchEvent(new CustomEvent('pandora_manifest_updated'));
          } catch {}
        }
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
        addToast('success', 'Authenticated');
        fetchManifest();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Authentication connection error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    addToast('info', 'Signed out');
  };

  // Handle Create New Media (Prepended on top)
  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMediaType === 'photo' && !newPrimaryFile) {
      addToast('error', 'Please choose a photo file to upload');
      return;
    }
    if (newMediaType === 'video' && !newYouTubeUrl.trim() && !newPrimaryFile) {
      addToast('error', 'Please provide a YouTube URL or video file');
      return;
    }

    const token = getToken();
    setIsSubmittingNew(true);

    try {
      const formData = new FormData();
      formData.append('mediaType', newMediaType);
      formData.append('title', newMediaType === 'video' ? 'Video' : 'Photo');
      formData.append('aspectRatio', newAspectRatio);
      if (newPrimaryFile) formData.append('file', newPrimaryFile);
      if (newYouTubeUrl.trim()) formData.append('youtubeUrl', newYouTubeUrl.trim());
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
        addToast('success', 'Published to top of /work');
        setIsAddModalOpen(false);
        setNewPrimaryFile(null);
        setNewPosterFile(null);
        setNewYouTubeUrl('');
      } else {
        addToast('error', data.error || 'Upload failed');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Error creating media');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Handle Save YouTube Link on an existing card slot
  const handleSaveYouTubeLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLinkSlotId) return;

    if (!editingLinkValue.trim()) {
      addToast('error', 'Please enter a valid YouTube URL');
      return;
    }

    const token = getToken();
    setIsSavingLink(true);

    try {
      const res = await fetch('/api/admin/update-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          slotId: editingLinkSlotId,
          videoUrl: editingLinkValue.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.manifest) {
        setOverrides(data.manifest.overrides || {});
        setAddedMedia(Array.isArray(data.manifest.added) ? data.manifest.added : []);
        setDeletedIds(Array.isArray(data.manifest.deleted) ? data.manifest.deleted : []);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('pandora_work_manifest', JSON.stringify({
              overrides: data.manifest.overrides || {},
              added: Array.isArray(data.manifest.added) ? data.manifest.added : [],
              deleted: Array.isArray(data.manifest.deleted) ? data.manifest.deleted : [],
            }));
            window.dispatchEvent(new CustomEvent('pandora_manifest_updated'));
          } catch {}
        }

        addToast('success', 'YouTube link updated live');
        setEditingLinkSlotId(null);
        setEditingLinkValue('');
      } else {
        addToast('error', data?.error || 'Failed to update link');
      }
    } catch (err: any) {
      addToast('error', err?.message || 'Error updating link');
    } finally {
      setIsSavingLink(false);
    }
  };

  // Process queued deletions sequentially in atomic batches (prevents concurrent R2 overwrite races)
  const flushDeleteQueue = async () => {
    if (isDeletingRef.current) return;
    if (pendingDeleteQueueRef.current.length === 0) return;

    isDeletingRef.current = true;
    const batch = [...pendingDeleteQueueRef.current];
    pendingDeleteQueueRef.current = [];

    const token = getToken();
    try {
      const res = await fetch('/api/admin/delete-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ids: batch }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.manifest) {
        const serverDeleted: string[] = Array.isArray(data.manifest.deleted) ? data.manifest.deleted : [];
        const mergedDeleted = Array.from(new Set([...serverDeleted, ...locallyDeletedIdsRef.current]));
        const delSet = new Set(mergedDeleted);

        setDeletedIds(mergedDeleted);
        setAddedMedia((prev) => {
          const serverAdded = Array.isArray(data.manifest.added) ? data.manifest.added : prev;
          return serverAdded.filter((item: AddedWorkMediaItem) => !delSet.has(item.id));
        });
        setOverrides(data.manifest.overrides || {});

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('pandora_work_manifest', JSON.stringify({
              overrides: data.manifest.overrides || {},
              added: (Array.isArray(data.manifest.added) ? data.manifest.added : []).filter((item: AddedWorkMediaItem) => !delSet.has(item.id)),
              deleted: mergedDeleted,
            }));
            window.dispatchEvent(new CustomEvent('pandora_manifest_updated'));
          } catch {}
        }

        addToast('info', `Deleted ${batch.length > 1 ? `${batch.length} items` : 'item'}`);
      } else {
        addToast('error', data?.error || 'Failed to sync deletion to R2');
      }
    } catch (err: any) {
      addToast('error', err?.message || 'Error deleting item(s)');
    } finally {
      isDeletingRef.current = false;
      // If user clicked more delete buttons while request was in-flight, immediately process next batch!
      if (pendingDeleteQueueRef.current.length > 0) {
        flushDeleteQueue();
      }
    }
  };

  // Handle Delete ANY card (0ms instant UI removal, queued batch sync, zero race conditions)
  const handleDeleteCard = (id: string) => {
    locallyDeletedIdsRef.current.add(id);

    // Instant UI removal
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setAddedMedia((prev) => prev.filter((item) => item.id !== id));

    // Update localStorage immediately so /work updates in real-time
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('pandora_work_manifest');
        const parsed = raw ? JSON.parse(raw) : { overrides: {}, added: [], deleted: [] };
        const updatedDeleted = Array.from(new Set([...(parsed.deleted || []), id]));
        const updatedAdded = (parsed.added || []).filter((item: any) => item.id !== id);
        localStorage.setItem('pandora_work_manifest', JSON.stringify({
          ...parsed,
          added: updatedAdded,
          deleted: updatedDeleted,
        }));
        window.dispatchEvent(new CustomEvent('pandora_manifest_updated'));
      } catch {}
    }

    // Queue for network batch execution
    if (!pendingDeleteQueueRef.current.includes(id)) {
      pendingDeleteQueueRef.current.push(id);
    }
    flushDeleteQueue();
  };

  // Handle file upload/replace
  const handleFileUpload = async (slotId: string, mediaField: 'image' | 'videoUrl', file: File) => {
    const token = getToken();
    setUploadingSlots((prev) => ({ ...prev, [slotId]: 'Uploading...' }));

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
        addToast('success', 'Media updated live in R2');
      } else {
        addToast('error', data.error || 'Upload failed');
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

  // Handle baseline slot reset
  const handleReset = async (slotId: string, mediaField: 'image' | 'videoUrl' | 'all' = 'all') => {
    if (!window.confirm('Reset this slot to original default?')) return;

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
        addToast('success', 'Reset to default');
      } else {
        addToast('error', data.error || 'Failed to reset');
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

  // Categorized lists by aspect ratio format
  const widescreenAdded = useMemo(
    () => addedMedia.filter((item) => item.aspectRatio === '16:9'),
    [addedMedia]
  );
  const reelsAdded = useMemo(
    () => addedMedia.filter((item) => item.aspectRatio === '9:16'),
    [addedMedia]
  );
  const photosAdded = useMemo(
    () => addedMedia.filter((item) => item.aspectRatio !== '16:9' && item.aspectRatio !== '9:16'),
    [addedMedia]
  );

  const widescreenBaseline = useMemo(
    () => ALL_WORK_SLOTS.filter((slot) => slot.aspectRatio === '16:9' && !deletedIds.includes(slot.id)),
    [deletedIds]
  );
  const reelsBaseline = useMemo(
    () => ALL_WORK_SLOTS.filter((slot) => slot.aspectRatio === '9:16' && !deletedIds.includes(slot.id)),
    [deletedIds]
  );
  const photosBaseline = useMemo(
    () => ALL_WORK_SLOTS.filter((slot) => slot.aspectRatio !== '16:9' && slot.aspectRatio !== '9:16' && !deletedIds.includes(slot.id)),
    [deletedIds]
  );

  const totalBaselineVisible = widescreenBaseline.length + reelsBaseline.length + photosBaseline.length;
  const totalAllCount = addedMedia.length + totalBaselineVisible;

  // Section visibility based on active filter
  const showWidescreen = filterType === 'all' || filterType === 'videos' || filterType === '16:9';
  const showReels = filterType === 'all' || filterType === 'videos' || filterType === '9:16';
  const showPhotos = filterType === 'all' || filterType === 'photos';

  // Loading screen
  if (isAuthenticated === null) {
    return (
      <div className="w-full min-h-screen bg-[#0c0c0b] text-[#ece8e1] flex items-center justify-center font-sans">
        <RefreshCw className="w-6 h-6 text-[#ff3d17] animate-spin" />
      </div>
    );
  }

  // 1. UNPROTECTED LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#0c0c0b] text-[#ece8e1] flex items-center justify-center p-4 font-sans selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
        <div className="w-full max-w-sm bg-[#141413] border border-[#ece8e1]/15 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#1c1c1a] border border-[#ece8e1]/10 text-[10px] text-[#ff3d17] uppercase tracking-widest font-mono">
              <Lock className="w-3 h-3" />
              <span>ADMIN</span>
            </div>
            <h1 className="font-anton text-2xl text-[#ece8e1] uppercase tracking-wide">
              SIGN IN
            </h1>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-none text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 px-3.5 py-2.5 text-xs text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none"
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 px-3.5 py-2.5 text-xs text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full cursor-pointer py-3 bg-[#ece8e1] text-[#0c0c0b] hover:bg-[#ff3d17] hover:text-[#ece8e1] disabled:opacity-50 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>ACCESS</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. CLEAN UNCLUTTERED ADMIN DASHBOARD
  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-6 sm:py-8 px-4 sm:px-8 font-sans selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
      <div className="max-w-[1720px] mx-auto space-y-6">

        {/* Action Header Bar (No text clutter, just clean controls) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece8e1]/15 pb-4">
          {/* Segmented Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`cursor-pointer px-3.5 py-1.5 border text-xs font-bold uppercase tracking-wider transition-colors ${
                filterType === 'all'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              ALL ({totalAllCount})
            </button>

            <button
              onClick={() => setFilterType('videos')}
              className={`cursor-pointer px-3.5 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors ${
                filterType === 'videos'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>VIDEOS ({widescreenAdded.length + widescreenBaseline.length + reelsAdded.length + reelsBaseline.length})</span>
            </button>

            <button
              onClick={() => setFilterType('16:9')}
              className={`cursor-pointer px-3 py-1.5 border text-xs font-bold uppercase tracking-wider transition-colors ${
                filterType === '16:9'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              16:9 CINEMA ({widescreenAdded.length + widescreenBaseline.length})
            </button>

            <button
              onClick={() => setFilterType('9:16')}
              className={`cursor-pointer px-3 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors ${
                filterType === '9:16'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 REELS ({reelsAdded.length + reelsBaseline.length})</span>
            </button>

            <button
              onClick={() => setFilterType('photos')}
              className={`cursor-pointer px-3.5 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors ${
                filterType === 'photos'
                  ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                  : 'bg-[#141413] text-[#8c8880] border-[#ece8e1]/15 hover:text-[#ece8e1]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PHOTOS ({photosAdded.length + photosBaseline.length})</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer px-4 py-2 bg-[#ff3d17] hover:bg-[#ff5533] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW</span>
            </button>

            <button
              onClick={fetchManifest}
              disabled={isRefreshing}
              className="cursor-pointer px-3.5 py-2 border border-[#ece8e1]/20 bg-[#1c1c1a] hover:border-[#ece8e1] text-[#ece8e1] text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>REFRESH</span>
            </button>
          </div>
        </div>

        {/* Format-Optimized Media Sections */}
        <div className="space-y-8">
          {/* Section 1: 16:9 Widescreen Cinema (Wide, cinematic, spacious) */}
          {showWidescreen && (widescreenAdded.length > 0 || widescreenBaseline.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#ece8e1]/10 pb-2">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-[#ece8e1] uppercase">
                  <Film className="w-3.5 h-3.5 text-[#ff3d17]" />
                  <span>16:9 WIDESCREEN CINEMA</span>
                  <span className="text-[10px] text-[#8c8880]">
                    ({widescreenAdded.length + widescreenBaseline.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 items-start">
                {widescreenAdded.map((item) => (
                  <AddedMediaCard
                    key={item.id}
                    item={item}
                    isUploading={Boolean(uploadingSlots[item.id])}
                    onFileUpload={(field, file) => handleFileUpload(item.id, field, file)}
                    onEditLink={() => {
                      setEditingLinkSlotId(item.id);
                      setEditingLinkValue(item.videoUrl || '');
                    }}
                    onDelete={() => handleDeleteCard(item.id)}
                  />
                ))}

                {widescreenBaseline.map((slot) => {
                  const override = overrides[slot.id];
                  const isOverridden = Boolean(override && (override.image || override.videoUrl));
                  const activeImage = override?.image || slot.defaultImage;
                  const activeVideoUrl = override?.videoUrl || slot.defaultVideoUrl;

                  return (
                    <SlotEditorCard
                      key={slot.id}
                      slot={slot}
                      isOverridden={isOverridden}
                      activeImage={activeImage}
                      activeVideoUrl={activeVideoUrl}
                      isUploading={Boolean(uploadingSlots[slot.id])}
                      onFileUpload={(field, file) => handleFileUpload(slot.id, field, file)}
                      onReset={(field) => handleReset(slot.id, field)}
                      onEditLink={() => {
                        setEditingLinkSlotId(slot.id);
                        setEditingLinkValue(activeVideoUrl || '');
                      }}
                      onDelete={() => handleDeleteCard(slot.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: 9:16 Vertical Reels (Uniform 4-across quad reels) */}
          {showReels && (reelsAdded.length > 0 || reelsBaseline.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#ece8e1]/10 pb-2">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-[#ece8e1] uppercase">
                  <Smartphone className="w-3.5 h-3.5 text-[#ff3d17]" />
                  <span>9:16 VERTICAL REELS</span>
                  <span className="text-[10px] text-[#8c8880]">
                    ({reelsAdded.length + reelsBaseline.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 items-start">
                {reelsAdded.map((item) => (
                  <AddedMediaCard
                    key={item.id}
                    item={item}
                    isUploading={Boolean(uploadingSlots[item.id])}
                    onFileUpload={(field, file) => handleFileUpload(item.id, field, file)}
                    onEditLink={() => {
                      setEditingLinkSlotId(item.id);
                      setEditingLinkValue(item.videoUrl || '');
                    }}
                    onDelete={() => handleDeleteCard(item.id)}
                  />
                ))}

                {reelsBaseline.map((slot) => {
                  const override = overrides[slot.id];
                  const isOverridden = Boolean(override && (override.image || override.videoUrl));
                  const activeImage = override?.image || slot.defaultImage;
                  const activeVideoUrl = override?.videoUrl || slot.defaultVideoUrl;

                  return (
                    <SlotEditorCard
                      key={slot.id}
                      slot={slot}
                      isOverridden={isOverridden}
                      activeImage={activeImage}
                      activeVideoUrl={activeVideoUrl}
                      isUploading={Boolean(uploadingSlots[slot.id])}
                      onFileUpload={(field, file) => handleFileUpload(slot.id, field, file)}
                      onReset={(field) => handleReset(slot.id, field)}
                      onEditLink={() => {
                        setEditingLinkSlotId(slot.id);
                        setEditingLinkValue(activeVideoUrl || '');
                      }}
                      onDelete={() => handleDeleteCard(slot.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: 4:5 Portfolio Photos (Uniform dense gallery grid) */}
          {showPhotos && (photosAdded.length > 0 || photosBaseline.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#ece8e1]/10 pb-2">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-[#ece8e1] uppercase">
                  <ImageIcon className="w-3.5 h-3.5 text-[#ff3d17]" />
                  <span>4:5 PORTFOLIO PHOTOS</span>
                  <span className="text-[10px] text-[#8c8880]">
                    ({photosAdded.length + photosBaseline.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 items-start">
                {photosAdded.map((item) => (
                  <AddedMediaCard
                    key={item.id}
                    item={item}
                    isUploading={Boolean(uploadingSlots[item.id])}
                    onFileUpload={(field, file) => handleFileUpload(item.id, field, file)}
                    onDelete={() => handleDeleteCard(item.id)}
                  />
                ))}

                {photosBaseline.map((slot) => {
                  const override = overrides[slot.id];
                  const isOverridden = Boolean(override && (override.image || override.videoUrl));
                  const activeImage = override?.image || slot.defaultImage;
                  const activeVideoUrl = override?.videoUrl || slot.defaultVideoUrl;

                  return (
                    <SlotEditorCard
                      key={slot.id}
                      slot={slot}
                      isOverridden={isOverridden}
                      activeImage={activeImage}
                      activeVideoUrl={activeVideoUrl}
                      isUploading={Boolean(uploadingSlots[slot.id])}
                      onFileUpload={(field, file) => handleFileUpload(slot.id, field, file)}
                      onReset={(field) => handleReset(slot.id, field)}
                      onDelete={() => handleDeleteCard(slot.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clean Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0b]/85 backdrop-blur-sm">
          <div className="bg-[#141413] border border-[#ece8e1]/20 max-w-sm w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#ece8e1]/10 pb-3">
              <h2 className="font-anton text-xl text-[#ece8e1] uppercase">
                ADD NEW MEDIA
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#8c8880] hover:text-[#ece8e1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMedia} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewMediaType('photo');
                    setNewAspectRatio('photo');
                  }}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border ${
                    newMediaType === 'photo'
                      ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                      : 'bg-[#0c0c0b] text-[#8c8880] border-[#ece8e1]/15'
                  }`}
                >
                  PHOTO
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewMediaType('video');
                    setNewAspectRatio('9:16');
                  }}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border ${
                    newMediaType === 'video'
                      ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1]'
                      : 'bg-[#0c0c0b] text-[#8c8880] border-[#ece8e1]/15'
                  }`}
                >
                  VIDEO
                </button>
              </div>

              {newMediaType === 'video' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAspectRatio('9:16')}
                    className={`py-1.5 text-[10px] font-bold uppercase tracking-wider border ${
                      newAspectRatio === '9:16'
                        ? 'border-[#ff3d17] bg-[#ff3d17]/15 text-[#ff3d17]'
                        : 'border-[#ece8e1]/15 text-[#8c8880]'
                    }`}
                  >
                    9:16 Reel
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAspectRatio('16:9')}
                    className={`py-1.5 text-[10px] font-bold uppercase tracking-wider border ${
                      newAspectRatio === '16:9'
                        ? 'border-[#ff3d17] bg-[#ff3d17]/15 text-[#ff3d17]'
                        : 'border-[#ece8e1]/15 text-[#8c8880]'
                    }`}
                  >
                    16:9 Widescreen
                  </button>
                </div>
              )}

              {newMediaType === 'video' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8c8880]">
                      YouTube Video Link or ID
                    </label>
                    <input
                      type="text"
                      value={newYouTubeUrl}
                      onChange={(e) => setNewYouTubeUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/... or Shorts"
                      className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2 text-xs text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none"
                    />
                  </div>

                  {extractYouTubeId(newYouTubeUrl) && (
                    <div className="p-2 border border-emerald-900/40 bg-emerald-950/20 text-emerald-300 text-[10px] font-mono flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>YouTube ID: {extractYouTubeId(newYouTubeUrl)} (Auto-poster ready)</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#8c8880]">
                      Custom Poster Frame (Optional)
                    </label>
                    <input
                      ref={newPosterFileRef}
                      type="file"
                      accept="image/*,.webp,.jpg,.jpeg,.png"
                      onChange={(e) => setNewPosterFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2 text-xs text-[#ece8e1] file:mr-2 file:py-1 file:px-2.5 file:border-0 file:bg-[#1c1c1a] file:text-[#ece8e1] file:text-[10px] file:uppercase file:cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#8c8880]">
                    Photo File (.webp, .jpg, .png)
                  </label>
                  <input
                    ref={newPrimaryFileRef}
                    type="file"
                    required
                    accept="image/*,.webp,.jpg,.jpeg,.png,.avif"
                    onChange={(e) => setNewPrimaryFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2 text-xs text-[#ece8e1] file:mr-2 file:py-1 file:px-2.5 file:border-0 file:bg-[#1c1c1a] file:text-[#ece8e1] file:text-[10px] file:uppercase file:cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="w-full cursor-pointer py-2.5 bg-[#ff3d17] hover:bg-[#ff5533] text-white disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                >
                  {isSubmittingNew ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>PUBLISH TO TOP</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit YouTube Link Modal */}
      {editingLinkSlotId && (
        <div className="fixed inset-0 bg-[#0c0c0b]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141413] border border-[#ece8e1]/20 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ece8e1]/15 pb-3">
              <div className="flex items-center space-x-2">
                <Film className="w-4 h-4 text-[#ff3d17]" />
                <h3 className="font-anton text-lg tracking-wide uppercase text-[#ece8e1]">
                  SET YOUTUBE VIDEO
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingLinkSlotId(null);
                  setEditingLinkValue('');
                }}
                className="text-[#8c8880] hover:text-[#ece8e1] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveYouTubeLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-[#8c8880]">
                  YouTube Video Link or ID
                </label>
                <input
                  type="text"
                  required
                  value={editingLinkValue}
                  onChange={(e) => setEditingLinkValue(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/... or Shorts"
                  className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-2.5 text-xs text-[#ece8e1] placeholder-[#555] focus:border-[#ff3d17] outline-none"
                />
              </div>

              {extractYouTubeId(editingLinkValue) && (
                <div className="p-2 border border-emerald-900/40 bg-emerald-950/20 text-emerald-300 text-[10px] font-mono flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified YouTube ID: {extractYouTubeId(editingLinkValue)}</span>
                </div>
              )}

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLinkSlotId(null);
                    setEditingLinkValue('');
                  }}
                  className="flex-1 py-2 border border-[#ece8e1]/20 text-[#8c8880] hover:text-[#ece8e1] text-xs font-bold uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSavingLink}
                  className="flex-1 py-2 bg-[#ff3d17] hover:bg-[#ff5533] text-white disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  {isSavingLink ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>SAVE LINK</span>
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
            className={`p-3 border shadow-2xl text-xs flex items-center space-x-2 pointer-events-auto cursor-pointer transition-all ${
              toast.type === 'success'
                ? 'bg-[#141413] border-emerald-600 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-[#141413] border-red-600 text-red-300'
                : 'bg-[#141413] border-[#ece8e1]/30 text-[#ece8e1]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-none" />}
            {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-none" />}
            <span className="flex-1">{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-component for newly added media cards
interface AddedCardProps {
  item: AddedWorkMediaItem;
  isUploading: boolean;
  onFileUpload: (field: 'image' | 'videoUrl', file: File) => void;
  onEditLink?: () => void;
  onDelete: () => void;
}

function AddedMediaCard({
  item,
  isUploading,
  onFileUpload,
  onEditLink,
  onDelete,
}: AddedCardProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isVideo = item.mediaType === 'video';
  const aspectStyle =
    item.aspectRatio === '16:9'
      ? { aspectRatio: '16 / 9' }
      : item.aspectRatio === '9:16'
      ? { aspectRatio: '9 / 16' }
      : { aspectRatio: '4 / 5' };
  const aspectClass =
    item.aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : item.aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : 'aspect-[4/5]';

  const youtubeId = extractYouTubeId(item.videoUrl);

  return (
    <div className="bg-[#141413] border border-[#ff3d17]/60 p-2.5 flex flex-col space-y-2.5 shadow-xl relative group">
      {isUploading && (
        <div className="absolute inset-0 bg-[#0c0c0b]/85 z-20 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-[#ff3d17] animate-spin" />
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

      {/* Pure Media Preview Only */}
      <div 
        className={`relative w-full ${aspectClass} bg-[#0c0c0b] overflow-hidden`}
        style={aspectStyle}
      >
        {isVideo && item.videoUrl && !youtubeId ? (
          <video
            src={item.videoUrl}
            poster={item.image}
            controls
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={item.image || (youtubeId ? getYouTubeThumbnail(youtubeId) : '/images/IMG_20261003_170037.webp')}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
            {youtubeId && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1 shadow">
                <Play className="w-2 h-2 fill-current" />
                <span>YOUTUBE</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1.5 pt-1">
        {isVideo ? (
          <>
            <button
              type="button"
              onClick={onEditLink}
              className="flex-1 cursor-pointer py-1.5 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[10px] font-bold uppercase tracking-wider transition-colors text-center flex items-center justify-center space-x-1"
            >
              <Play className="w-2.5 h-2.5 text-red-600 fill-current" />
              <span>LINK</span>
            </button>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex-1 cursor-pointer py-1.5 border border-[#ece8e1]/20 bg-[#1c1c1a] text-[#ece8e1] hover:border-[#ece8e1] text-[10px] font-bold uppercase tracking-wider transition-colors text-center"
            >
              POSTER
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex-1 cursor-pointer py-1.5 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[10px] font-bold uppercase tracking-wider transition-colors text-center"
          >
            REPLACE
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer p-1.5 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-300 hover:text-white transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Sub-component for baseline editable slot card
interface SlotCardProps {
  slot: WorkMediaSlot;
  isOverridden: boolean;
  activeImage: string;
  activeVideoUrl?: string;
  isUploading: boolean;
  onFileUpload: (field: 'image' | 'videoUrl', file: File) => void;
  onReset: (field: 'image' | 'videoUrl' | 'all') => void;
  onEditLink?: () => void;
  onDelete: () => void;
}

function SlotEditorCard({
  slot,
  isOverridden,
  activeImage,
  activeVideoUrl,
  isUploading,
  onFileUpload,
  onReset,
  onEditLink,
  onDelete,
}: SlotCardProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isVideo = slot.mediaType === 'video';
  const aspectStyle =
    slot.aspectRatio === '16:9'
      ? { aspectRatio: '16 / 9' }
      : slot.aspectRatio === '9:16'
      ? { aspectRatio: '9 / 16' }
      : { aspectRatio: '4 / 5' };
  const aspectClass =
    slot.aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : slot.aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : 'aspect-[4/5]';

  const youtubeId = extractYouTubeId(activeVideoUrl);

  return (
    <div className="bg-[#141413] border border-[#ece8e1]/15 p-2.5 flex flex-col space-y-2.5 shadow-xl relative group">
      {isUploading && (
        <div className="absolute inset-0 bg-[#0c0c0b]/85 z-20 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-[#ff3d17] animate-spin" />
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

      {/* Pure Media Preview Only */}
      <div 
        className={`relative w-full ${aspectClass} bg-[#0c0c0b] overflow-hidden`}
        style={aspectStyle}
      >
        {isVideo && activeVideoUrl && !youtubeId ? (
          <video
            src={activeVideoUrl}
            poster={activeImage}
            controls
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={activeImage || (youtubeId ? getYouTubeThumbnail(youtubeId) : slot.defaultImage)}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
            {youtubeId && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1 shadow">
                <Play className="w-2 h-2 fill-current" />
                <span>YOUTUBE</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-1.5 pt-1">
        {isVideo ? (
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onEditLink}
              className="flex-1 cursor-pointer py-1.5 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[10px] font-bold uppercase tracking-wider transition-colors text-center flex items-center justify-center space-x-1"
            >
              <Play className="w-2.5 h-2.5 text-red-600 fill-current" />
              <span>LINK</span>
            </button>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex-1 cursor-pointer py-1.5 border border-[#ece8e1]/20 hover:border-[#ece8e1] bg-[#1c1c1a] text-[#ece8e1] text-[10px] font-bold uppercase tracking-wider transition-colors text-center"
            >
              POSTER
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer p-1.5 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-300 hover:text-white transition-colors flex items-center justify-center"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex-1 cursor-pointer py-1.5 bg-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#ece8e1] text-[#0c0c0b] text-[10px] font-bold uppercase tracking-wider transition-colors text-center"
            >
              REPLACE
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer p-1.5 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-300 hover:text-white transition-colors flex items-center justify-center"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isOverridden && (
          <button
            type="button"
            onClick={() => onReset('all')}
            className="w-full cursor-pointer py-1 border border-red-900/60 bg-red-950/20 hover:bg-red-950/60 text-red-300 text-[9px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>RESET</span>
          </button>
        )}
      </div>
    </div>
  );
}
