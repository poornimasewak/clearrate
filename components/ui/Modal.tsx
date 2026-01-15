// components/ui/Modal.tsx
'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-all hover:rotate-90"
        >
          ×
        </button>

        {/* Header */}
        <div className="p-10 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 pr-12">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-600 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

// AI Summary Content Component
interface AISummaryProps {
  summary: string;
  reasons: string[];
  consumerImpact: string;
  comparison?: string;
}

export function AISummaryContent({ summary, reasons, consumerImpact, comparison }: AISummaryProps) {
  return (
    <div className="space-y-6">
      {/* AI Summary Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-8 rounded-xl">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-3 text-lg">
          🤖 AI-Generated Summary
        </h3>
        <p className="text-slate-700 mb-5 leading-relaxed">
          {summary}
        </p>
        <ul className="space-y-4">
          {reasons.map((reason, index) => (
            <li key={index} className="relative pl-8 text-slate-700 leading-relaxed">
              <span className="absolute left-0 top-1 text-blue-500 font-bold text-xl">
                ✓
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Consumer Impact */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl">
        <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
          ⚠️ Consumer Impact
        </h4>
        <p className="text-yellow-900 leading-relaxed">
          {consumerImpact}
        </p>
      </div>

      {/* Comparison (if provided) */}
      {comparison && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-3">
            How This Compares
          </h4>
          <p className="text-slate-600 leading-relaxed">
            {comparison}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all">
          View Original Filing (PDF)
        </button>
        <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all">
          Compare to Other Companies
        </button>
        <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-all">
          Get Rate Quotes
        </button>
      </div>
    </div>
  );
}




