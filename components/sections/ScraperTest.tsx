// components/sections/ScraperTest.tsx
'use client';

import { useState } from 'react';

interface ScraperResult {
  success: boolean;
  resultCount: number;
  message?: string;
  error?: string;
}

export function ScraperTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [formData, setFormData] = useState({
    state: 'California',
    insuranceType: 'Auto Insurance',
    companyName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        resultCount: 0,
        error: 'Failed to connect to scraper',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          🔍 SERFF Scraper Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* State Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              State
            </label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option>California</option>
              <option>Texas</option>
              <option>New York</option>
              <option>Florida</option>
              <option>Illinois</option>
            </select>
          </div>

          {/* Insurance Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Insurance Type
            </label>
            <select
              value={formData.insuranceType}
              onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option>Auto Insurance</option>
              <option>Home Insurance</option>
              <option>Life Insurance</option>
              <option>Health Insurance</option>
            </select>
          </div>

          {/* Company Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g., ABC Insurance"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '🔄 Scraping...' : '🚀 Start Scraping'}
          </button>
        </form>

        {/* Results Display */}
        {result && (
          <div className={`mt-6 p-6 rounded-xl ${
            result.success ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            {result.success ? (
              <>
                <div className="text-green-900 font-bold text-lg mb-2">
                  ✅ Success!
                </div>
                <div className="text-green-800 text-3xl font-extrabold mb-2">
                  {result.resultCount} Results Found
                </div>
                {result.message && (
                  <div className="text-green-700 text-sm">
                    {result.message}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-red-900 font-bold text-lg mb-2">
                  ❌ Error
                </div>
                <div className="text-red-700">
                  {result.error || 'Something went wrong'}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

