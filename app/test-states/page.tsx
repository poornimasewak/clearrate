// app/test-states/page.tsx
'use client';

import { useState } from 'react';

interface TestResult {
  state: string;
  success: boolean;
  filingCount: number;
  error?: string;
  filings?: any[];
  timestamp: string;
}

export default function TestStatesPage() {
  const [selectedState, setSelectedState] = useState('California');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testState = async (state: string) => {
    setIsLoading(true);
    const startTime = new Date().toISOString();

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: state,
          insuranceType: 'Auto Insurance',
          companyName: '', // Empty to get all companies
        }),
      });

      const data = await response.json();

      const result: TestResult = {
        state,
        success: data.success,
        filingCount: data.filings?.length || 0,
        error: data.error,
        filings: data.filings?.slice(0, 3), // Show first 3 filings
        timestamp: startTime,
      };

      setResults((prev) => [result, ...prev]);
    } catch (error: any) {
      setResults((prev) => [
        {
          state,
          success: false,
          filingCount: 0,
          error: error.message,
          timestamp: startTime,
        },
        ...prev,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const states = ['California', 'Illinois', 'Texas', 'New York', 'Florida'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🧪 Multi-State Scraper Test
          </h1>
          <p className="text-lg text-slate-600">
            Test the Puppeteer scraper across different SERFF state portals
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🎯 Select State to Test</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  selectedState === state
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          <button
            onClick={() => testState(selectedState)}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🔄</span> Testing {selectedState}...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🚀 Test {selectedState} Scraper
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <div
              key={`${result.state}-${result.timestamp}`}
              className={`bg-white rounded-2xl shadow-xl border-2 p-8 ${
                result.success ? 'border-green-300' : 'border-red-300'
              }`}
            >
              {/* Result Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {result.state}
                  </h3>
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
                <div className="text-sm text-slate-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Filing Count */}
              {result.success && (
                <div className="mb-4">
                  <p className="text-lg font-semibold text-slate-700">
                    📊 Found {result.filingCount} filings
                  </p>
                </div>
              )}

              {/* Error Message */}
              {result.error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-mono text-sm">{result.error}</p>
                </div>
              )}

              {/* Sample Filings */}
              {result.filings && result.filings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700">Sample Filings:</h4>
                  {result.filings.map((filing, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
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
                          {filing.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SERFF URL */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">SERFF URL:</span>{' '}
                  <a
                    href={`https://filingaccess.serff.com/sfa/home/${
                      result.state === 'California'
                        ? 'CA'
                        : result.state === 'Illinois'
                        ? 'IL'
                        : result.state === 'Texas'
                        ? 'TX'
                        : result.state === 'New York'
                        ? 'NY'
                        : 'FL'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://filingaccess.serff.com/sfa/home/{result.state === 'California'
                      ? 'CA'
                      : result.state === 'Illinois'
                      ? 'IL'
                      : result.state === 'Texas'
                      ? 'TX'
                      : result.state === 'New York'
                      ? 'NY'
                      : 'FL'}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-12 text-center">
            <p className="text-xl text-slate-500">
              👆 Select a state and click "Test" to see results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

