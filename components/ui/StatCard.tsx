// components/ui/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, change, changeType = 'neutral' }: StatCardProps) {
  const changeColors = {
    up: 'text-red-600',
    down: 'text-green-600',
    neutral: 'text-slate-600',
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500 relative overflow-hidden group">
      {/* Hover accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="stat-label text-sm text-slate-600 mb-3 font-semibold uppercase tracking-wide">
        {label}
      </div>
      
      <div className="text-5xl font-extrabold text-slate-900 mb-2">
        {value}
      </div>
      
      {change && (
        <div className={`text-sm font-medium ${changeColors[changeType]}`}>
          {change}
        </div>
      )}
    </div>
  );
}

