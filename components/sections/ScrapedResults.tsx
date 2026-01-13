// components/sections/ScrapedResults.tsx
'use client';

export interface ScrapedFiling {
  companyName: string;
  naicNumber: string;
  productDescription: string;
  typeOfInsurance: string;
  filingType: string;
  status: string;
  filingNumber: string;
}

interface ScrapedResultsProps {
  results: ScrapedFiling[] | null;
  isLoading: boolean;
  error?: string;
}

export function ScrapedResults({ results, isLoading, error }: ScrapedResultsProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Scraping SERFF...
          </h3>
          <p className="text-slate-600">
            Please wait while we fetch the latest filings from SERFF
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="bg-red-50 rounded-2xl border-2 border-red-500 p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">❌</span>
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">
                Scraping Failed
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-500 p-8 text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            No Results Found
          </h3>
          <p className="text-yellow-700">
            Try adjusting your search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 mb-12">
      {/* Results Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Found {results.length} Filing{results.length !== 1 ? 's' : ''} on Page 1
        </h2>
        <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-full font-semibold">
          📊 SERFF Results
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((filing, index) => (
          <div
            key={filing.filingNumber || index}
            className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-400 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-600">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {filing.companyName}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {filing.productDescription}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                filing.status.includes('Approved') ? 'bg-green-100 text-green-900' :
                filing.status.includes('Withdrawn') ? 'bg-red-100 text-red-900' :
                filing.status.includes('Pending') ? 'bg-yellow-100 text-yellow-900' :
                'bg-slate-100 text-slate-900'
              }`}>
                {filing.status}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  NAIC #
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {filing.naicNumber}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  Type of Insurance
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
              
              <div className="col-span-2">
                <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                  Filing Number
                </div>
                <div className="text-sm font-mono font-semibold text-blue-600">
                  {filing.filingNumber}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      <div className="mt-6 text-center text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
        ℹ️ Showing results from Page 1 only. Additional pages available on SERFF.
      </div>
    </div>
  );
}

