// app/page.tsx
'use client';

import { useState } from 'react';
import { Hero } from '@/components/sections/Hero';
import { FilterBar, FilterState } from '@/components/sections/FilterBar';
import { ScrapedResults, ScrapedFiling } from '@/components/sections/ScrapedResults';
import { StatCard } from '@/components/ui/StatCard';
import { FilingCard } from '@/components/ui/FilingCard';
import { Modal, AISummaryContent } from '@/components/ui/Modal';

// Sample data - replace with real data from API/Supabase
const sampleFilings = [
  {
    id: '1',
    company: 'ABC Insurance Company',
    type: 'Auto Insurance',
    state: 'California',
    rateChange: 12.5,
    filedDate: 'Jan 8, 2025',
    status: 'Pending' as const,
    effectiveDate: 'April 1, 2025',
    filingNumber: 'CA-2025-1234',
  },
  {
    id: '2',
    company: 'XYZ Insurance Group',
    type: 'Home Insurance',
    state: 'California',
    rateChange: 7.8,
    filedDate: 'Jan 7, 2025',
    status: 'Approved' as const,
    effectiveDate: 'March 15, 2025',
    filingNumber: 'CA-2025-1189',
  },
  {
    id: '3',
    company: 'Premier Insurance Co.',
    type: 'Auto Insurance',
    state: 'California',
    rateChange: -2.1,
    filedDate: 'Jan 6, 2025',
    status: 'Approved' as const,
    effectiveDate: 'Feb 28, 2025',
    filingNumber: 'CA-2025-1145',
  },
];

const sampleSummary = {
  summary: 'This filing requests a 12.5% rate increase for auto insurance policies in California, effective April 1, 2025. Based on analysis of the 47-page filing document, here are the key reasons:',
  reasons: [
    'Repair costs increased 18% due to ongoing supply chain issues affecting auto parts availability. Modern vehicles with advanced technology and safety features are significantly more expensive to repair. This factor accounts for approximately 40% of the requested increase.',
    'Claims severity up 12% as more severe accidents resulted in higher average claim costs. The company notes that distracted driving incidents have increased, leading to more serious collisions and higher medical expenses.',
    'Reinsurance costs rose 8% as the company\'s reinsurance contracts renewed at higher rates, driven by increased catastrophic weather events and natural disasters affecting the broader insurance market.',
  ],
  consumerImpact: 'For an average policy premium of $1,200/year, this increase would add approximately $150/year ($12.50/month) to your insurance costs. Higher-risk drivers or those with comprehensive coverage may see larger increases.',
  comparison: 'This 12.5% increase is higher than the state average of 8.3% for auto insurance filings in the same period. Three competitors (XYZ Insurance, Premier Insurance, and National Insurance) have filed lower rate increases for similar products, ranging from -2.1% to +7.8%.',
};

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    state: 'California',
    insuranceType: 'Auto Insurance',
    searchQuery: '',
  });

  // Scraping state
  const [scrapedResults, setScrapedResults] = useState<ScrapedFiling[] | null>(null);
  const [isScraperLoading, setIsScraperLoading] = useState(false);
  const [scraperError, setScraperError] = useState<string | undefined>();

  const handleViewSummary = (filingId: string) => {
    setSelectedFiling(filingId);
    setModalOpen(true);
  };

  const handleSearch = async (searchFilters: FilterState) => {
    setIsScraperLoading(true);
    setScraperError(undefined);
    setScrapedResults(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: searchFilters.state,
          insuranceType: searchFilters.insuranceType,
          companyName: searchFilters.searchQuery || 'All',
        }),
      });

      const data = await response.json();

      if (data.success && data.filings) {
        // Use the real scraped filings from SERFF!
        setScrapedResults(data.filings);
      } else {
        setScraperError(data.error || 'Failed to scrape SERFF');
      }
    } catch (error) {
      setScraperError('Failed to connect to scraper');
    } finally {
      setIsScraperLoading(false);
    }
  };

  return (
    <>
      <Hero />

      <div className="px-8">
        <FilterBar
          onFilterChange={setFilters}
          onSearch={handleSearch}
        />
      </div>

      {/* Scraped Results Section */}
      {(scrapedResults || isScraperLoading || scraperError) && (
        <ScrapedResults
          results={scrapedResults}
          isLoading={isScraperLoading}
          error={scraperError}
        />
      )}

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Filings This Month"
            value="456"
            change="↑ 23% from last month"
            changeType="up"
          />
          <StatCard
            label="Average Rate Change"
            value="+9.2%"
            change="↑ 1.5% from last quarter"
            changeType="up"
          />
          <StatCard
            label="States Tracked"
            value="23"
            change="Expanding coverage"
            changeType="neutral"
          />
          <StatCard
            label="Rate Increases"
            value="78%"
            change="Of all filings"
            changeType="up"
          />
        </div>

        {/* Recent Filings Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900">Recent Filings</h2>
          <a href="#" className="text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors">
            View All →
          </a>
        </div>

        <div className="space-y-6">
          {sampleFilings.map((filing) => (
            <FilingCard
              key={filing.id}
              filing={filing}
              onViewSummary={() => handleViewSummary(filing.id)}
              onCompare={() => console.log('Compare', filing.id)}
              onViewOriginal={() => console.log('View Original', filing.id)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ABC Insurance Company"
        subtitle="Auto Insurance Rate Filing • CA-2025-1234 • Filed Jan 8, 2025"
      >
        <AISummaryContent {...sampleSummary} />
      </Modal>
    </>
  );
}
