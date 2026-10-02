'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 border font-mono text-xs shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-[#141413] border-[#ff3d17] text-[#ece8e1]'
              : toast.type === 'error'
              ? 'bg-[#1a0a08] border-red-500 text-red-200'
              : 'bg-[#171716] border-[#ece8e1]/30 text-[#ece8e1]'
          }`}
        >
          <div className="flex items-center space-x-3 mr-3">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#ff3d17] flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#8c8880] flex-shrink-0" />}
            <span className="leading-tight">{toast.text}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#8c8880] hover:text-[#ece8e1] transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
