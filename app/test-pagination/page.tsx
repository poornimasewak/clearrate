// app/test-pagination/page.tsx
'use client';

import { useState } from 'react';

interface PaginationTestResult {
  success: boolean;
  resultCount: number;
  pagesScraped: number;
  message: string;
  error?: string;
  sampleFilings?: any[];
  timestamp: string;
}

export default function TestPaginationPage() {
  const [maxPages, setMaxPages] = useState(5); // Default to 5 pages for testing
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PaginationTestResult | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setResult(null);
    const startTime = new Date().toISOString();

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: 'California',
          insuranceType: 'Auto Insurance',
          companyName: '', // Empty to get all companies
          maxPages: maxPages,
        }),
      });

      const data = await response.json();

      setResult({
        success: data.success,
        resultCount: data.filings?.length || 0,
        pagesScraped: data.pagesScraped || 0,
        message: data.message || '',
        error: data.error,
        sampleFilings: data.filings?.slice(0, 5), // Show first 5 filings
        timestamp: startTime,
      });
    } catch (error: any) {
      setResult({
        success: false,
        resultCount: 0,
        pagesScraped: 0,
        message: '',
        error: error.message,
        timestamp: startTime,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🔄 Pagination Test
          </h1>
          <p className="text-lg text-slate-600">
            Test the multi-page scraping functionality (up to 50 pages)
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">⚙️ Configuration</h2>

          <div className="mb-6">
            <label htmlFor="maxPages" className="block font-semibold text-slate-700 mb-2">
              Max Pages to Scrape:
            </label>
            <input
              type="number"
              id="maxPages"
              min="1"
              max="50"
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-lg font-bold transition-all focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            <p className="text-sm text-slate-500 mt-2">
              ⚠️ Each page takes ~2-3 seconds to scrape. {maxPages} pages ≈{' '}
              {Math.round(maxPages * 2.5)} seconds
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Test Parameters:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <span className="font-semibold">State:</span> California</li>
              <li>• <span className="font-semibold">Insurance Type:</span> Auto Insurance</li>
              <li>• <span className="font-semibold">Company Name:</span> All (empty)</li>
              <li>
                • <span className="font-semibold">Max Pages:</span>{' '}
                <span className="font-bold text-purple-600">{maxPages}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={runTest}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🔄</span> Scraping {maxPages} page
                {maxPages !== 1 ? 's' : ''}...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🚀 Start Pagination Test
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div
            className={`bg-white rounded-2xl shadow-xl border-2 p-8 ${
              result.success ? 'border-green-300' : 'border-red-300'
            }`}
          >
            {/* Result Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Test Results</h3>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  result.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {result.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>

            {/* Stats Grid */}
            {result.success && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold uppercase mb-1">
                    Pages Scraped
                  </div>
                  <div className="text-4xl font-bold text-blue-900">
                    {result.pagesScraped}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    of {maxPages} requested
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold uppercase mb-1">
                    Total Filings
                  </div>
                  <div className="text-4xl font-bold text-purple-900">
                    {result.resultCount}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    extracted from SERFF
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                  <div className="text-sm text-green-600 font-semibold uppercase mb-1">
                    Avg Per Page
                  </div>
                  <div className="text-4xl font-bold text-green-900">
                    {result.pagesScraped > 0
                      ? Math.round(result.resultCount / result.pagesScraped)
                      : 0}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    filings/page
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {result.message && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <p className="text-slate-700">{result.message}</p>
              </div>
            )}

            {/* Error */}
            {result.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 font-mono text-sm">{result.error}</p>
              </div>
            )}

            {/* Sample Filings */}
            {result.sampleFilings && result.sampleFilings.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">
                  📋 Sample Filings (first 5):
                </h4>
                <div className="space-y-3">
                  {result.sampleFilings.map((filing, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200"
                    >
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Company:</span>{' '}
                          {filing.companyName}
                        </div>
                        <div>
                          <span className="font-semibold">Filing #:</span>{' '}
                          {filing.filingNumber}
                        </div>
                        <div>
                          <span className="font-semibold">Type:</span>{' '}
                          {filing.typeOfInsurance}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{' '}
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              filing.status.includes('Approved')
                                ? 'bg-green-100 text-green-700'
                                : filing.status.includes('Withdrawn')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {filing.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-sm text-slate-500">
              Test completed at {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {!result && !isLoading && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-12 text-center">
            <p className="text-xl text-slate-500">
              👆 Configure the test and click "Start" to begin
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-900 mb-2">ℹ️ How Pagination Works:</h3>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Scraper navigates to SERFF and performs search</li>
            <li>Extracts all filings from the first page of results</li>
            <li>
              Looks for &quot;Next&quot; button or pagination controls (PrimeFaces UI)
            </li>
            <li>If next page exists and maxPages not reached, clicks next</li>
            <li>Waits for new content to load (3 seconds)</li>
            <li>Repeats steps 2-5 until no more pages or maxPages reached</li>
            <li>Returns combined array of all filings from all pages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

