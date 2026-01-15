// components/ui/FilingCard.tsx
'use client';

interface FilingCardProps {
  filing: {
    id: string;
    company: string;
    type: string;
    state: string;
    rateChange: number;
    filedDate: string;
    status: 'Pending' | 'Approved' | 'Denied';
    effectiveDate: string;
    filingNumber: string;
  };
  onViewSummary?: () => void;
  onCompare?: () => void;
  onViewOriginal?: () => void;
}

export function FilingCard({ filing, onViewSummary, onCompare, onViewOriginal }: FilingCardProps) {
  const getRateChangeColor = (change: number) => {
    if (change >= 10) return 'bg-red-100 text-red-900 shadow-red-500/15';
    if (change >= 5) return 'bg-yellow-100 text-yellow-900 shadow-yellow-500/15';
    if (change < 0) return 'bg-green-100 text-green-900 shadow-green-500/15';
    return 'bg-slate-100 text-slate-900';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-900';
      case 'Approved':
        return 'bg-green-100 text-green-900';
      case 'Denied':
        return 'bg-red-100 text-red-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500">
      {/* Header */}
      <div className="p-7 flex justify-between items-start border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {filing.company}
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            {filing.type} • {filing.state}
          </p>
        </div>
        
        <div className={`px-5 py-2.5 rounded-xl font-bold text-2xl shadow-md ${getRateChangeColor(filing.rateChange)}`}>
          {filing.rateChange > 0 ? '+' : ''}{filing.rateChange}%
        </div>
      </div>

      {/* Body */}
      <div className="p-7">
        {/* Meta Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-slate-600 uppercase tracking-wide font-semibold">
              Filed
            </span>
            <span className="font-semibold text-slate-900">
              {filing.filedDate}
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-slate-600 uppercase tracking-wide font-semibold">
              Status
            </span>
            <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(filing.status)}`}>
              {filing.status}
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-slate-600 uppercase tracking-wide font-semibold">
              Effective Date
            </span>
            <span className="font-semibold text-slate-900">
              {filing.effectiveDate}
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-slate-600 uppercase tracking-wide font-semibold">
              Filing #
            </span>
            <span className="font-semibold text-slate-900">
              {filing.filingNumber}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-100">
          <button
            onClick={onViewSummary}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            View AI Summary
          </button>
          
          <button
            onClick={onCompare}
            className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm transition-all hover:bg-slate-200"
          >
            Compare
          </button>
          
          <button
            onClick={onViewOriginal}
            className="px-6 py-3.5 bg-transparent text-blue-500 border-2 border-blue-500 rounded-lg font-semibold text-sm transition-all hover:bg-blue-50"
          >
            Original Filing
          </button>
        </div>
      </div>
    </div>
  );
}




