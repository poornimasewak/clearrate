// app/test-monitor/page.tsx
'use client';

import { useState } from 'react';

export default function TestMonitorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState('California');
  const [insuranceType, setInsuranceType] = useState('Auto Insurance');
  const [company, setCompany] = useState('21st Century Casualty Company');

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          insuranceType,
          company: company || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to run monitor');
      }
    } catch (err) {
      setError('Failed to connect to monitor API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🤖 Monitor Agent Test
          </h1>
          <p className="text-slate-600 mb-8">
            Test the SERFF Monitor Agent that runs daily at 6:00 AM
          </p>

          {/* Test Form */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📍 State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>California</option>
                <option>Texas</option>
                <option>New York</option>
                <option>Florida</option>
                <option>Illinois</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📋 Insurance Type
              </label>
              <select
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>Auto Insurance</option>
                <option>Home Insurance</option>
                <option>Life Insurance</option>
                <option>Health Insurance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🏢 Company Name (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Leave empty for all companies"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleTest}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? '🔄 Running Monitor Agent...' : '🚀 Test Monitor Agent'}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6 text-center">
              <div className="animate-spin text-5xl mb-4">🤖</div>
              <p className="text-blue-900 font-semibold">
                Monitor Agent is checking SERFF...
              </p>
              <p className="text-blue-700 text-sm mt-2">
                This may take 20-30 seconds
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">❌</span>
                <div>
                  <h3 className="font-bold text-red-900 text-lg mb-1">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-green-900 mb-1">
                    {result.totalFilings}
                  </div>
                  <div className="text-green-700 font-semibold">Total Filings</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-blue-900 mb-1">
                    {result.newFilings}
                  </div>
                  <div className="text-blue-700 font-semibold">New Filings</div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4">
                  📊 Monitor Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Timestamp:</span>
                    <span className="font-mono text-slate-900">
                      {new Date(result.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Success:</span>
                    <span className={result.success ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {result.success ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Errors:</span>
                    <span className="text-slate-900 font-semibold">
                      {result.errors.length}
                    </span>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
                    <p className="font-bold text-red-900 mb-2">Errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {result.errors.map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Raw JSON */}
              <details className="bg-slate-900 rounded-xl p-6">
                <summary className="text-white font-bold cursor-pointer">
                  📄 View Raw JSON Response
                </summary>
                <pre className="mt-4 text-xs text-green-400 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-900 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">ℹ️ About the Monitor Agent</h2>
          <ul className="space-y-2 text-blue-100">
            <li>✅ Runs automatically every day at 6:00 AM UTC</li>
            <li>✅ Checks multiple states and insurance types</li>
            <li>✅ Detects new filings and stores them in database</li>
            <li>✅ Logs all activity for debugging and monitoring</li>
          </ul>
          <p className="mt-4 text-sm text-blue-200">
            This test page allows you to manually trigger the monitor for any state/type combination.
          </p>
        </div>
      </div>
    </div>
  );
}




