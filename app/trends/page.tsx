// app/trends/page.tsx
import { StatCard } from '@/components/ui/StatCard';

export default function TrendsPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Market Trends & Insights</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Filings This Month" value="456" />
        <StatCard label="Average Increase" value="9.2%" />
        <StatCard label="States Tracked" value="23" />
        <StatCard label="Rate Increases" value="78%" />
      </div>

      {/* Time Series Chart */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 mb-12">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Rate Filings Over Time (12 Months)
        </h3>
        <div className="h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-500 font-semibold border-2 border-dashed border-blue-300">
          Interactive Line Chart - Filing Volume Trends
          <br />
          (Use Recharts LineChart here)
        </div>
      </div>

      {/* State Comparison Chart */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 mb-12">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Top States by Average Rate Increase
        </h3>
        <div className="h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-500 font-semibold border-2 border-dashed border-blue-300">
          Horizontal Bar Chart - State Comparison
          <br />
          (Use Recharts BarChart here)
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Key Market Insights</h3>
        
        <div className="space-y-4">
          <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <strong className="text-slate-900">Auto insurance rates up 9.2% on average</strong> across 
            tracked states in Q4 2024, driven primarily by increased repair costs and higher claim severity.
          </div>
          
          <div className="p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
            <strong className="text-slate-900">78% of filings were rate increases</strong>, compared to 
            65% in Q3 2024, indicating continued upward pressure on premiums.
          </div>
          
          <div className="p-6 bg-red-50 rounded-xl border-l-4 border-red-500">
            <strong className="text-slate-900">California saw the most filing activity</strong> with 127 
            filings in December 2024, largely due to wildfire risk reassessments.
          </div>
          
          <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
            <strong className="text-slate-900">Most common justification:</strong> Increased repair costs 
            due to supply chain issues, mentioned in 64% of auto insurance filings.
          </div>
        </div>
      </div>
    </div>
  );
}
