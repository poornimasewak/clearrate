// app/test-ai/page.tsx
'use client';

import { useState } from 'react';

export default function TestAIPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleFiling = {
    companyName: '21st Century Casualty Company',
    naicNumber: '36404',
    productDescription: 'Private Passenger Auto',
    typeOfInsurance: '19.0001 Private Passenger Auto (PPA)',
    filingType: 'Rate',
    status: 'Closed - Approved',
    filingNumber: 'AGMK-132215191',
  };

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch('/api/summarize-filing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filing: sampleFiling,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('Failed to connect to AI API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🤖</span>
            <h1 className="text-4xl font-bold text-slate-900">
              AI Summarizer Agent
            </h1>
          </div>
          <p className="text-slate-600 mb-2">
            Powered by <strong>Claude Sonnet 3.5</strong> (Sonnet 4.5) via Agno
          </p>
          <p className="text-sm text-purple-600 mb-8">
            Analyzes insurance rate filings and provides consumer insights
          </p>

          {/* Sample Filing Info */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-purple-900 text-lg mb-3">
              📄 Sample Filing
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-purple-600 font-semibold">Company:</span>{' '}
                {sampleFiling.companyName}
              </div>
              <div>
                <span className="text-purple-600 font-semibold">NAIC:</span>{' '}
                {sampleFiling.naicNumber}
              </div>
              <div>
                <span className="text-purple-600 font-semibold">Product:</span>{' '}
                {sampleFiling.productDescription}
              </div>
              <div>
                <span className="text-purple-600 font-semibold">Type:</span>{' '}
                {sampleFiling.typeOfInsurance}
              </div>
              <div>
                <span className="text-purple-600 font-semibold">Filing Type:</span>{' '}
                {sampleFiling.filingType}
              </div>
              <div>
                <span className="text-purple-600 font-semibold">Status:</span>{' '}
                <span className="px-2 py-1 bg-green-100 text-green-900 rounded-full text-xs font-bold">
                  {sampleFiling.status}
                </span>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mb-6"
          >
            {loading ? '🤖 AI is analyzing...' : '✨ Generate AI Summary'}
          </button>

          {/* Loading State */}
          {loading && (
            <div className="bg-purple-50 border-2 border-purple-500 rounded-xl p-8 text-center">
              <div className="animate-pulse text-6xl mb-4">🧠</div>
              <p className="text-purple-900 font-semibold text-lg">
                Claude Sonnet 3.5 is analyzing the filing...
              </p>
              <p className="text-purple-700 text-sm mt-2">
                This usually takes 5-10 seconds
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
                  <p className="text-red-600 text-sm mt-2">
                    Make sure ANTHROPIC_API_KEY or CLAUDE_API_KEY is set in your environment
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Results */}
          {summary && (
            <div className="space-y-6">
              {/* Risk Level Badge */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  AI Analysis Results
                </h2>
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                  summary.riskLevel === 'High' ? 'bg-red-100 text-red-900' :
                  summary.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-900' :
                  'bg-green-100 text-green-900'
                }`}>
                  {summary.riskLevel} Risk
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2 text-lg flex items-center gap-2">
                  <span>📝</span> Summary
                </h3>
                <p className="text-blue-900 leading-relaxed">{summary.summary}</p>
              </div>

              {/* Key Points */}
              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                <h3 className="font-bold text-purple-900 mb-3 text-lg flex items-center gap-2">
                  <span>🔑</span> Key Points
                </h3>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-purple-900">
                      <span className="text-purple-500 font-bold mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Estimated Impact */}
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
                <h3 className="font-bold text-orange-900 mb-2 text-lg flex items-center gap-2">
                  <span>💰</span> Estimated Impact
                </h3>
                <p className="text-orange-900 leading-relaxed">{summary.estimatedImpact}</p>
              </div>

              {/* Consumer Advice */}
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-2 text-lg flex items-center gap-2">
                  <span>💡</span> Consumer Advice
                </h3>
                <p className="text-green-900 leading-relaxed">{summary.consumerAdvice}</p>
              </div>

              {/* Raw JSON */}
              <details className="bg-slate-900 rounded-xl p-6">
                <summary className="text-white font-bold cursor-pointer">
                  📄 View Raw JSON
                </summary>
                <pre className="mt-4 text-xs text-green-400 overflow-auto">
                  {JSON.stringify(summary, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-purple-900 text-white rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3">🎯 What It Does</h2>
            <ul className="space-y-2 text-purple-100 text-sm">
              <li>✅ Analyzes insurance rate filings</li>
              <li>✅ Summarizes complex documents</li>
              <li>✅ Estimates consumer impact</li>
              <li>✅ Provides actionable advice</li>
              <li>✅ Assesses risk level</li>
            </ul>
          </div>

          <div className="bg-blue-900 text-white rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3">⚡ Powered By</h2>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><strong>Agno:</strong> AI agent orchestration</li>
              <li><strong>Claude Sonnet 3.5:</strong> Latest AI model</li>
              <li><strong>Anthropic API:</strong> Enterprise-grade AI</li>
              <li><strong>Next.js:</strong> Modern web framework</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}




