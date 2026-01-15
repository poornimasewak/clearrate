// app/test-monthly-stats/page.tsx
'use client';

import { useState } from 'react';

interface StatsResult {
  success: boolean;
  totalFilings: number;
  month: string;
  year: number;
  error?: string;
}

export default function TestMonthlyStatsPage() {
  const [selectedState, setSelectedState] = useState('California');
  const [selectedType, setSelectedType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StatsResult | null>(null);

  const states = ['California', 'Illinois', 'Texas', 'New York', 'Florida'];
  const types = ['All', 'Auto Insurance', 'Home Insurance'];

  const fetchStats = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/stats/monthly-filings?state=${selectedState}&insuranceType=${selectedType}`
      );
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        totalFilings: 0,
        month: '',
        year: 0,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            📊 Monthly Filing Stats Tool
          </h1>
          <p className="text-lg text-slate-600">
            Get real-time filing counts for the current month from SERFF
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">⚙️ Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* State Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                📍 State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Insurance Type Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                📋 Insurance Type:
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🔄</span> Fetching Stats from SERFF...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                📊 Get Monthly Filing Count
              </span>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`bg-white rounded-2xl shadow-xl border-2 p-8 ${
              result.success ? 'border-green-300' : 'border-red-300'
            }`}
          >
            {result.success ? (
              <>
                {/* Success Result */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {result.month} {result.year}
                  </h3>
                  <span className="px-4 py-2 rounded-full font-semibold bg-green-100 text-green-700">
                    ✅ Success
                  </span>
                </div>

                {/* Big Number Display */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-12 rounded-2xl border-2 border-green-200 text-center mb-6">
                  <div className="text-sm text-green-600 font-semibold uppercase mb-2">
                    Total Filings This Month
                  </div>
                  <div className="text-7xl font-bold text-green-900 mb-2">
                    {result.totalFilings.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">
                    {selectedState} • {selectedType}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      State
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {selectedState}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Insurance Type
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {selectedType}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    🔴 <span className="font-semibold">Live data</span> from SERFF
                    filing portal for <span className="font-semibold">{result.month} {result.year}</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Error Result */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">❌</span>
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-1">
                      Failed to Fetch Stats
                    </h3>
                    <p className="text-red-700">{result.error}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!result && !isLoading && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-12 text-center">
            <p className="text-xl text-slate-500">
              👆 Select a state and insurance type, then click &quot;Get Monthly Filing Count&quot;
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ How This Works:</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Calculates date range for current month (1st to today)</li>
            <li>Navigates to SERFF portal for selected state</li>
            <li>Fills search form with date range and insurance type</li>
            <li>Extracts total filing count from results page</li>
            <li>Returns real-time data from SERFF</li>
          </ol>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              ⏱️ <span className="font-semibold">Estimated time:</span> 15-30 seconds per query
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-900 mb-3">🎯 Use Cases:</h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li className="flex items-start gap-2">
              <span>✅</span>
              <span>Display &quot;Filings This Month&quot; stat on homepage</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✅</span>
              <span>Track monthly filing trends across states</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✅</span>
              <span>Compare filing volumes between insurance types</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✅</span>
              <span>Monitor filing activity for specific states</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

