// components/sections/ScrapedResults.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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
  pagesScraped?: number;
  totalPages?: number;
}

const ITEMS_PER_PAGE = 10;

export function ScrapedResults({ results, isLoading, error, pagesScraped, totalPages }: ScrapedResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to results section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const totalItems = results?.length || 0;
  const totalDisplayPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentItems = useMemo(() => {
    if (!results) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;
    
    if (totalDisplayPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalDisplayPages; i++) {
        pages.push(i);
      }
    } else {
      // Show abbreviated pagination
      if (currentPage <= 4) {
        // Near start
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalDisplayPages);
      } else if (currentPage >= totalDisplayPages - 3) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = totalDisplayPages - 4; i <= totalDisplayPages; i++) pages.push(i);
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalDisplayPages);
      }
    }
    
    return pages;
  };

  // Reset to page 1 when results change
  useMemo(() => {
    setCurrentPage(1);
  }, [results]);
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Scraping SERFF...
          </h3>
          <p className="text-slate-600">
            Please wait while we fetch filings from multiple pages. This may take a few minutes.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            ⏱️ Estimated time: 1-3 minutes per page
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
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Found {results.length} Filing{results.length !== 1 ? 's' : ''}
          </h2>
          {pagesScraped && (
            <p className="text-slate-600">
              📄 Scraped {pagesScraped} page{pagesScraped !== 1 ? 's' : ''} from SERFF
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-full font-semibold">
            📊 SERFF Results
          </div>
          {pagesScraped && pagesScraped > 1 && (
            <div className="text-xs text-slate-600 bg-green-50 px-3 py-1 rounded-full font-semibold text-center">
              ✅ Multi-page scrape complete
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {currentItems.map((filing, index) => {
          // Calculate global index for display
          const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
          // Encode filing number for URL
          const encodedFilingNumber = encodeURIComponent(filing.filingNumber);
          
          return (
            <div
              key={filing.filingNumber || index}
              className="bg-white rounded-xl border-2 border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-blue-600">
                      #{globalIndex}
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

              {/* Action Button */}
              <Link 
                href={{
                  pathname: `/summary/${encodedFilingNumber}`,
                  query: {
                    data: JSON.stringify(filing)
                  }
                }}
                className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-4 font-semibold text-base transition-all border-t-2 border-blue-600"
              >
                🧠 View AI Summary in Layman&apos;s Terms →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Scrape Summary (Above Pagination) */}
      {pagesScraped && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">
                Successfully scraped <span className="font-bold text-blue-600">{pagesScraped}</span> SERFF page{pagesScraped !== 1 ? 's' : ''} with{' '}
                <span className="font-bold text-blue-600">{results.length}</span> total filing{results.length !== 1 ? 's' : ''}
              </p>
            </div>
            {pagesScraped >= 50 && (
              <div className="text-xs text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full font-semibold">
                ⚠️ Max limit reached
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalDisplayPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Page Info */}
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} filings
          </div>

          {/* Page Numbers */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[44px] px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:scale-105'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(totalDisplayPages, currentPage + 1))}
              disabled={currentPage === totalDisplayPages}
              className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Next →
            </button>
          </div>

          {/* Jump to Page */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Jump to page:</span>
            <input
              type="number"
              min="1"
              max={totalDisplayPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalDisplayPages) {
                  handlePageChange(page);
                }
              }}
              className="w-20 px-3 py-1 border-2 border-slate-200 rounded-lg text-center font-semibold focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400">of {totalDisplayPages}</span>
          </div>
        </div>
      )}
    </div>
  );
}

