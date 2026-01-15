// components/sections/LatestFilings.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FilingDocument {
  name: string;
  type: string;
  size?: string;
  url?: string;
}

interface FilingWithDocs {
  companyName: string;
  naicNumber: string;
  productDescription: string;
  typeOfInsurance: string;
  filingType: string;
  status: string;
  filingNumber: string;
  documents: FilingDocument[];
  documentCount: number;
}

interface LatestFilingsProps {
  filings: FilingWithDocs[] | null;
  isLoading: boolean;
  error?: string;
}

export function LatestFilings({ filings, isLoading, error }: LatestFilingsProps) {
  const [expandedFiling, setExpandedFiling] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          📰 Latest Filings
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Loading Latest Filings...
          </h3>
          <p className="text-slate-600">
            Fetching recent filings with document lists from SERFF
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          📰 Latest Filings
        </h2>
        <div className="bg-red-50 rounded-2xl border-2 border-red-500 p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">❌</span>
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">
                Failed to Load Latest Filings
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!filings || filings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          📰 Latest Filings
        </h2>
        <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-500 p-8 text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            No Recent Filings Found
          </h3>
          <p className="text-yellow-700">
            Try adjusting your filters or check back later
          </p>
        </div>
      </div>
    );
  }

  const toggleExpand = (filingNumber: string) => {
    setExpandedFiling(expandedFiling === filingNumber ? null : filingNumber);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-900">
          📰 Latest Filings
        </h2>
        <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-full font-semibold">
          🔴 Live from SERFF
        </div>
      </div>

      {/* Filings List */}
      <div className="space-y-4">
        {filings.map((filing, index) => {
          const isExpanded = expandedFiling === filing.filingNumber;
          const encodedFilingNumber = encodeURIComponent(filing.filingNumber);

          return (
            <div
              key={filing.filingNumber || index}
              className="bg-white rounded-xl border-2 border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all overflow-hidden"
            >
              {/* Filing Header */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl font-bold text-blue-600">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {filing.companyName}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {filing.productDescription}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                      filing.status.includes('Approved')
                        ? 'bg-green-100 text-green-900'
                        : filing.status.includes('Withdrawn')
                        ? 'bg-red-100 text-red-900'
                        : filing.status.includes('Pending')
                        ? 'bg-yellow-100 text-yellow-900'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {filing.status}
                  </div>
                </div>

                {/* Filing Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                      NAIC #
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {filing.naicNumber}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                      Type
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {filing.filingType}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                      Documents
                    </div>
                    <div className="text-sm font-semibold text-purple-600">
                      📄 {filing.documentCount} file{filing.documentCount !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                      Filing #
                    </div>
                    <div className="text-sm font-mono font-semibold text-blue-600">
                      {filing.filingNumber}
                    </div>
                  </div>
                </div>

                {/* Document List Toggle */}
                {filing.documentCount > 0 && (
                  <button
                    onClick={() => toggleExpand(filing.filingNumber)}
                    className="mt-4 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-sm text-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isExpanded ? '▼' : '▶'} {isExpanded ? 'Hide' : 'Show'}{' '}
                    {filing.documentCount} Document{filing.documentCount !== 1 ? 's' : ''}
                  </button>
                )}

                {/* Expanded Document List */}
                {isExpanded && filing.documents.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-3">
                      📄 Filing Documents:
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filing.documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">
                              {doc.type === 'PDF' ? '📕' : '📄'}
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-slate-900">
                                {doc.name}
                              </div>
                              {doc.size && (
                                <div className="text-xs text-slate-500">
                                  {doc.size}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {doc.type}
                            </span>
                            {doc.url && (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={{
                  pathname: `/summary/${encodedFilingNumber}`,
                  query: {
                    data: JSON.stringify(filing),
                  },
                }}
                className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-4 font-semibold text-base transition-all border-t-2 border-blue-600"
              >
                🧠 View AI Summary in Layman&apos;s Terms →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
        ℹ️ Showing the most recent {filings.length} filing
        {filings.length !== 1 ? 's' : ''} with document lists from SERFF
      </div>
    </div>
  );
}

