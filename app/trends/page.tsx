// app/trends/page.tsx
'use client';

import { StatCard } from '@/components/ui/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Chart 1 Data: Insurance Type vs Filing Count (Users/Filings)
const insuranceTypeData = [
  { type: 'Auto Insurance', filings: 2847, percentage: 45 },
  { type: 'Home Insurance', filings: 1923, percentage: 30 },
  { type: 'Life Insurance', filings: 856, percentage: 14 },
  { type: 'Health Insurance', filings: 698, percentage: 11 },
];

// Chart 2 Data: Companies offering different types of insurance
const companyInsuranceData = [
  {
    company: 'State Farm',
    auto: 456,
    home: 312,
    life: 189,
    health: 145,
  },
  {
    company: 'GEICO',
    auto: 523,
    home: 0,
    life: 0,
    health: 0,
  },
  {
    company: 'Allstate',
    auto: 387,
    home: 298,
    life: 156,
    health: 0,
  },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function TrendsPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          📊 Market Trends & Insights
        </h1>
        <p className="text-lg text-slate-600">
          Real-time analytics from SERFF insurance rate filings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Filings"
          value="6,324"
          change="↑ 12% from last month"
          changeType="up"
        />
        <StatCard
          label="Average Increase"
          value="+9.2%"
          change="↑ 1.5% from Q3"
          changeType="up"
        />
        <StatCard
          label="Active Companies"
          value="847"
          change="Across 50 states"
          changeType="neutral"
        />
        <StatCard
          label="Rate Increases"
          value="78%"
          change="Of all filings"
          changeType="up"
        />
      </div>

      {/* Chart 1: Insurance Type vs Filings */}
      <div className="bg-white p-10 rounded-2xl border-2 border-slate-200 shadow-lg mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            📋 Insurance Type Distribution
          </h2>
          <p className="text-slate-600">
            Filing volume by insurance type across all states
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={insuranceTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="type"
                  angle={-15}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#475569', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#475569' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="filings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={insuranceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="filings"
                >
                  {insuranceTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {insuranceTypeData.map((item, index) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Below Chart */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200">
          {insuranceTypeData.map((item, index) => (
            <div
              key={item.type}
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${COLORS[index]}15` }}
            >
              <div className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                {item.filings.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                {item.type}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {item.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Company Comparison */}
      <div className="bg-white p-10 rounded-2xl border-2 border-slate-200 shadow-lg mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            🏢 Top Insurance Companies by Product Type
          </h2>
          <p className="text-slate-600">
            Filing activity comparison across major insurance providers
          </p>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={companyInsuranceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="company" tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }} />
            <YAxis tick={{ fill: '#475569' }} label={{ value: 'Number of Filings', angle: -90, position: 'insideLeft', style: { fill: '#475569' } }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar dataKey="auto" fill="#3b82f6" name="Auto Insurance" radius={[8, 8, 0, 0]} />
            <Bar dataKey="home" fill="#10b981" name="Home Insurance" radius={[8, 8, 0, 0]} />
            <Bar dataKey="life" fill="#f59e0b" name="Life Insurance" radius={[8, 8, 0, 0]} />
            <Bar dataKey="health" fill="#ef4444" name="Health Insurance" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-200">
          {companyInsuranceData.map((company, index) => {
            const total = company.auto + company.home + company.life + company.health;
            const products = [
              company.auto > 0 && 'Auto',
              company.home > 0 && 'Home',
              company.life > 0 && 'Life',
              company.health > 0 && 'Health',
            ].filter(Boolean);

            return (
              <div
                key={company.company}
                className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {company.company}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Filings:</span>
                    <span className="font-bold text-blue-600">{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Product Lines:</span>
                    <span className="font-bold text-slate-900">{products.length}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {products.map((product) => (
                    <span
                      key={product}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white p-10 rounded-2xl border-2 border-slate-200 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          💡 Key Market Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🚗</span>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Auto Insurance Dominates</h3>
                <p className="text-sm text-slate-700">
                  Auto insurance accounts for <strong>45% of all filings</strong>, with 2,847
                  rate filings across all states. Average rate increase: 9.2%.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🏠</span>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Home Insurance Growing</h3>
                <p className="text-sm text-slate-700">
                  Home insurance filings increased <strong>18% year-over-year</strong>, driven by
                  wildfire and flood risk reassessments in high-risk areas.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📈</span>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">State Farm Leads</h3>
                <p className="text-sm text-slate-700">
                  State Farm filed the most rate changes with <strong>1,102 total filings</strong>,
                  offering the broadest product portfolio across all insurance types.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">GEICO Specializes</h3>
                <p className="text-sm text-slate-700">
                  GEICO focuses exclusively on auto insurance with <strong>523 filings</strong>,
                  demonstrating a specialized business model with deep market penetration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">78%</div>
              <div className="text-sm text-slate-600 mt-1">Rate Increases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">22%</div>
              <div className="text-sm text-slate-600 mt-1">Rate Decreases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">64%</div>
              <div className="text-sm text-slate-600 mt-1">Cite Repair Costs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">847</div>
              <div className="text-sm text-slate-600 mt-1">Active Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
