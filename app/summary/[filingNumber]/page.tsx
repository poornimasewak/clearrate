// app/summary/[filingNumber]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ScrapedFiling } from '@/components/sections/ScrapedResults';

interface AISummaryResult {
  summary: string;
  keyPoints: string[];
  consumerImpact: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  consumerAdvice: string;
  marketTrendAnalysis?: string;
  error?: string;
}

export default function SummaryPage({ params }: { params: { filingNumber: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filing, setFiling] = useState<ScrapedFiling | null>(null);
  const [summary, setSummary] = useState<AISummaryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get filing data from query params
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const filingData = JSON.parse(dataParam) as ScrapedFiling;
        setFiling(filingData);
        generateSummary(filingData);
      } catch (err) {
        setError('Failed to load filing data');
        setLoading(false);
      }
    } else {
      setError('No filing data provided');
      setLoading(false);
    }
  }, [searchParams]);

  const generateSummary = async (filingData: ScrapedFiling) => {
    try {
      const response = await fetch('/api/summarize-filing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filing: filingData }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
      } else {
        // Check if it's an authentication error
        const errorMsg = data.error || 'Failed to generate summary';
        if (errorMsg.includes('authentication_error') || errorMsg.includes('invalid x-api-key')) {
          setError('⚠️ Anthropic API Key Missing: Please add your ANTHROPIC_API_KEY to the .env.local file and restart the server. Get your key at: https://console.anthropic.com/');
        } else {
          setError('Failed to generate AI summary: ' + errorMsg);
        }
      }
    } catch (err) {
      setError('Failed to connect to AI summarizer: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-900 border-green-500';
      case 'Medium': return 'bg-yellow-100 text-yellow-900 border-yellow-500';
      case 'High': return 'bg-red-100 text-red-900 border-red-500';
      default: return 'bg-slate-100 text-slate-900 border-slate-500';
    }
  };

  const getRiskLevelEmoji = (level: string) => {
    switch (level) {
      case 'Low': return '✅';
      case 'Medium': return '⚠️';
      case 'High': return '🚨';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="animate-spin text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Analyzing Filing with AI...
            </h3>
            <p className="text-slate-600">
              Claude AI is reading the filing details and generating a plain-English summary
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !filing || !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-red-50 rounded-2xl border-2 border-red-500 p-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">❌</span>
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Error Loading Summary
                </h3>
                <p className="text-red-700">{error || 'Unknown error occurred'}</p>
                <Link 
                  href="/"
                  className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
          >
            ← Back to Search Results
          </Link>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {filing.companyName}
                </h1>
                <p className="text-lg text-slate-600">
                  {filing.productDescription}
                </p>
              </div>
              
              <div className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                filing.status.includes('Approved') ? 'bg-green-100 text-green-900' :
                filing.status.includes('Withdrawn') ? 'bg-red-100 text-red-900' :
                filing.status.includes('Pending') ? 'bg-yellow-100 text-yellow-900' :
                'bg-slate-100 text-slate-900'
              }`}>
                {filing.status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  Filing Number
                </div>
                <div className="text-sm font-mono font-semibold text-blue-600">
                  {filing.filingNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  NAIC Number
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {filing.naicNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  Insurance Type
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {filing.typeOfInsurance}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  Filing Type
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {filing.filingType}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="space-y-6">
          {/* Risk Level Alert */}
          <div className={`rounded-2xl border-2 p-8 ${getRiskLevelColor(summary.riskLevel)}`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{getRiskLevelEmoji(summary.riskLevel)}</span>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Risk Level: {summary.riskLevel}
                </h2>
                <p className="text-lg leading-relaxed">
                  {summary.riskLevel === 'Low' && 'This filing appears to have minimal negative impact on consumers.'}
                  {summary.riskLevel === 'Medium' && 'This filing may have moderate impact on consumers. Review the details carefully.'}
                  {summary.riskLevel === 'High' && 'This filing could significantly impact consumers. Pay close attention to the consumer impact section.'}
                  {summary.riskLevel === 'Unknown' && 'Unable to assess risk level. Please review the filing details.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span>📋</span> What This Filing Is About
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {summary.summary}
            </p>
          </div>

          {/* Key Points */}
          {summary.keyPoints.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span>💡</span> Key Points Explained
              </h2>
              <div className="space-y-4">
                {summary.keyPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed pt-1">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consumer Impact */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-500 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-3">
              <span>💰</span> How This Affects You
            </h2>
            <p className="text-lg text-yellow-900 leading-relaxed">
              {summary.consumerImpact}
            </p>
          </div>

          {/* Consumer Advice */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-500 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
              <span>✅</span> What You Should Do
            </h2>
            <p className="text-lg text-green-900 leading-relaxed">
              {summary.consumerAdvice}
            </p>
          </div>

          {/* Market Trend Analysis */}
          {summary.marketTrendAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span>📊</span> Market Trends
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                {summary.marketTrendAnalysis}
              </p>
            </div>
          )}

          {/* AI Disclaimer */}
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-600">
              <strong>⚠️ AI-Generated Summary:</strong> This summary was generated by Claude AI (Sonnet 3.5) 
              based on the filing metadata. For complete accuracy, always refer to the original filing documents.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg"
            >
              ← Back to Search
            </Link>
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-slate-600 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-all shadow-lg"
            >
              🖨️ Print Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

