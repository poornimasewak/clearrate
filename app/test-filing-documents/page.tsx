// app/test-filing-documents/page.tsx
'use client';

import { useState } from 'react';

interface DocumentInfo {
  pageTitle: string;
  allLinks: Array<{
    text: string;
    href: string;
    isPDF: boolean;
    isDocument: boolean;
  }>;
  sections: Array<{
    index: number;
    title: string;
    content: string;
  }>;
  tables: Array<{
    index: number;
    headers: string[];
    rowCount: number;
    sampleRows: string[][];
  }>;
}

interface ScraperResult {
  success: boolean;
  resultCount: number;
  message?: string;
  error?: string;
  filings?: any[];
  sampleFilingDocuments?: DocumentInfo;
}

export default function TestFilingDocumentsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const runScraper = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: 'California',
          insuranceType: 'Auto Insurance',
          companyName: '',
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        resultCount: 0,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🔍 Test: Filing Documents Extraction
          </h1>
          <p className="text-lg text-slate-600">
            This will scrape SERFF, find filings, then click on the first filing to see what documents are available.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
          <button
            onClick={runScraper}
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? '🔄 Scraping SERFF & Extracting Documents...' : '🚀 Run Scraper'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Basic Results */}
            <div className={`rounded-2xl border-2 p-8 ${
              result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <h2 className="text-2xl font-bold mb-4">
                {result.success ? '✅ Scraping Successful' : '❌ Scraping Failed'}
              </h2>
              <p className="text-lg mb-2">
                <strong>Filings Found:</strong> {result.resultCount}
              </p>
              {result.message && <p className="text-sm">{result.message}</p>}
              {result.error && <p className="text-red-700">{result.error}</p>}
            </div>

            {/* Filing List */}
            {result.filings && result.filings.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  📋 Filings Found
                </h2>
                <div className="space-y-3">
                  {result.filings.map((filing, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="font-bold text-lg text-blue-600">
                        {filing.companyName}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Filing #: {filing.filingNumber} | NAIC: {filing.naicNumber}
                      </div>
                      <div className="text-sm text-slate-600">
                        {filing.productDescription} | Status: {filing.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Extraction Results */}
            {result.sampleFilingDocuments && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-500 p-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-6">
                  📄 Documents Found in First Filing
                </h2>

                {/* Page Title */}
                {result.sampleFilingDocuments.pageTitle && (
                  <div className="mb-6 p-4 bg-white rounded-lg border border-blue-300">
                    <div className="text-sm font-semibold text-blue-600 uppercase mb-1">
                      Page Title
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {result.sampleFilingDocuments.pageTitle}
                    </div>
                  </div>
                )}

                {/* Document Links */}
                {result.sampleFilingDocuments.allLinks && result.sampleFilingDocuments.allLinks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      📎 All Links ({result.sampleFilingDocuments.allLinks.length} total)
                    </h3>
                    <div className="space-y-2">
                      {result.sampleFilingDocuments.allLinks.map((link, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            link.isDocument 
                              ? 'bg-green-100 border-green-500' 
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">
                              {link.isPDF ? '📄' : link.isDocument ? '📎' : '🔗'}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">
                                {link.text}
                              </div>
                              <div className="text-xs text-slate-600 font-mono break-all">
                                {link.href}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tables */}
                {result.sampleFilingDocuments.tables && result.sampleFilingDocuments.tables.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      📊 Tables Found ({result.sampleFilingDocuments.tables.length} total)
                    </h3>
                    <div className="space-y-4">
                      {result.sampleFilingDocuments.tables.map((table, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-lg border border-slate-200">
                          <div className="font-bold text-lg text-slate-900 mb-2">
                            Table {table.index + 1}
                          </div>
                          {table.headers && table.headers.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-slate-500 uppercase font-semibold">
                                Headers:
                              </div>
                              <div className="text-sm text-slate-700">
                                {table.headers.join(' | ')}
                              </div>
                            </div>
                          )}
                          <div className="text-sm text-slate-600">
                            Total Rows: {table.rowCount}
                          </div>
                          {table.sampleRows && table.sampleRows.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">
                                Sample Rows:
                              </div>
                              {table.sampleRows.map((row, rowIdx) => (
                                <div key={rowIdx} className="text-xs text-slate-600 font-mono">
                                  {row.join(' | ')}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sections */}
                {result.sampleFilingDocuments.sections && result.sampleFilingDocuments.sections.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      📑 Sections Found ({result.sampleFilingDocuments.sections.length} total)
                    </h3>
                    <div className="space-y-3">
                      {result.sampleFilingDocuments.sections.map((section, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-lg border border-slate-200">
                          {section.title && (
                            <div className="font-bold text-slate-900 mb-1">
                              {section.title}
                            </div>
                          )}
                          <div className="text-sm text-slate-600">
                            {section.content}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



