// app/test-latest-filings/page.tsx
'use client';

import { useState } from 'react';

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

export default function TestLatestFilingsPage() {
  const [selectedState, setSelectedState] = useState('California');
  const [selectedType, setSelectedType] = useState('All');
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [filings, setFilings] = useState<FilingWithDocs[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const states = ['California', 'Illinois', 'Texas', 'New York', 'Florida'];
  const types = ['All', 'Auto Insurance', 'Home Insurance'];

  const fetchLatestFilings = async () => {
    setIsLoading(true);
    setError(null);
    setFilings(null);

    try {
      const response = await fetch(
        `/api/latest-filings?state=${selectedState}&insuranceType=${selectedType}&limit=${limit}`
      );
      const data = await response.json();

      if (data.success) {
        setFilings(data.filings);
      } else {
        setError(data.error || 'Failed to fetch latest filings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            📰 Latest Filings with Documents Tool
          </h1>
          <p className="text-lg text-slate-600">
            Test the latest filings tool that fetches recent filings with their document lists
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">⚙️ Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* State */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                📍 State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg transition-all focus:outline-none focus:border-purple-500"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Insurance Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                📋 Insurance Type:
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg transition-all focus:outline-none focus:border-purple-500"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Limit */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                🔢 Number of Filings:
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg transition-all focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            onClick={fetchLatestFilings}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🔄</span> Fetching Latest Filings...
              </span>
            ) : (
              <span>📰 Get Latest Filings with Documents</span>
            )}
          </button>

          <p className="text-sm text-slate-500 mt-4 text-center">
            ⏱️ This will take ~30-60 seconds (navigates to SERFF, gets filings, then clicks
            into each one to fetch documents)
          </p>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 rounded-2xl border-2 border-red-300 p-8 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">❌</span>
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {filings && filings.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border-2 border-green-200 p-6">
              <h3 className="text-xl font-bold text-green-900 mb-2">
                ✅ Successfully Fetched {filings.length} Filings
              </h3>
              <p className="text-green-700">
                Total Documents:{' '}
                {filings.reduce((sum, f) => sum + f.documentCount, 0)} files
              </p>
            </div>

            {/* Filings */}
            {filings.map((filing, index) => (
              <div
                key={filing.filingNumber}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6"
              >
                {/* Filing Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-purple-600">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {filing.companyName}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {filing.productDescription}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    📄 {filing.documentCount} docs
                  </div>
                </div>

                {/* Filing Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">
                      Filing #
                    </div>
                    <div className="text-sm font-mono font-semibold text-slate-900">
                      {filing.filingNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">
                      NAIC
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {filing.naicNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">
                      Type
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {filing.filingType}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">
                      Status
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {filing.status}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {filing.documents.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">
                      📄 Documents ({filing.documents.length}):
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filing.documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span>{doc.type === 'PDF' ? '📕' : '📄'}</span>
                            <span className="text-sm font-medium text-slate-900">
                              {doc.name}
                            </span>
                            {doc.size && (
                              <span className="text-xs text-slate-500">
                                ({doc.size})
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded">
                            {doc.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filing.documents.length === 0 && (
                  <div className="text-center text-slate-500 py-4">
                    No documents found for this filing
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !filings && !error && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <p className="text-xl text-slate-500">
              👆 Configure settings and click &quot;Get Latest Filings&quot;
            </p>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ How This Works:</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Navigate to SERFF and perform search with yesterday&apos;s date filter</li>
            <li>Extract the first N filings from results table</li>
            <li>For each filing, click the filing number link</li>
            <li>On detail page, extract all document names, types, and sizes</li>
            <li>Go back and repeat for next filing</li>
            <li>Return array of filings with their document lists</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

