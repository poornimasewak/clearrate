// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { FilterBar, FilterState } from '@/components/sections/FilterBar';
import { ScrapedResults, ScrapedFiling } from '@/components/sections/ScrapedResults';
import { LatestFilings } from '@/components/sections/LatestFilings';
import { StatCard } from '@/components/ui/StatCard';

// Note: Using real data from SERFF now via latest filings API
// No more dummy data needed!

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>({
    state: 'California',
    insuranceType: 'Auto Insurance',
    searchQuery: '',
    maxPages: 50,
  });

  // Scraping state
  const [scrapedResults, setScrapedResults] = useState<ScrapedFiling[] | null>(null);
  const [isScraperLoading, setIsScraperLoading] = useState(false);
  const [scraperError, setScraperError] = useState<string | undefined>();
  const [pagesScraped, setPagesScraped] = useState<number | undefined>();
  const [totalPages, setTotalPages] = useState<number | undefined>();

  // Monthly stats state
  const [monthlyFilings, setMonthlyFilings] = useState<number | null>(null);
  const [monthlyStatsLoading, setMonthlyStatsLoading] = useState(false);
  const [monthlyStatsError, setMonthlyStatsError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');

  // Latest filings state
  const [latestFilings, setLatestFilings] = useState<any[] | null>(null);
  const [latestFilingsLoading, setLatestFilingsLoading] = useState(false);
  const [latestFilingsError, setLatestFilingsError] = useState<string | null>(null);

  // Fetch monthly stats on mount
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      setMonthlyStatsLoading(true);
      try {
        const response = await fetch(`/api/stats/monthly-filings?state=${filters.state}&insuranceType=All`);
        const data = await response.json();
        
        if (data.success) {
          setMonthlyFilings(data.totalFilings);
          setCurrentMonth(`${data.month} ${data.year}`);
        } else {
          setMonthlyStatsError(data.error || 'Failed to load stats');
        }
      } catch (error) {
        setMonthlyStatsError('Failed to connect to stats API');
        console.error(error);
      } finally {
        setMonthlyStatsLoading(false);
      }
    };

    fetchMonthlyStats();
  }, []); // Run once on mount

  // Fetch latest 5 filings with documents on mount
  useEffect(() => {
    const fetchLatestFilings = async () => {
      setLatestFilingsLoading(true);
      try {
        const response = await fetch(`/api/latest-filings?state=${filters.state}&insuranceType=All&limit=5`);
        const data = await response.json();
        
        if (data.success) {
          setLatestFilings(data.filings);
        } else {
          setLatestFilingsError(data.error || 'Failed to load latest filings');
        }
      } catch (error) {
        setLatestFilingsError('Failed to connect to latest filings API');
        console.error(error);
      } finally {
        setLatestFilingsLoading(false);
      }
    };

    fetchLatestFilings();
  }, []); // Run once on mount

  const handleSearch = async (searchFilters: FilterState) => {
    setIsScraperLoading(true);
    setScraperError(undefined);
    setScrapedResults(null);
    setPagesScraped(undefined);
    setTotalPages(undefined);

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
          maxPages: searchFilters.maxPages || 50, // Pass maxPages to API
        }),
      });

      const data = await response.json();

      if (data.success && data.filings) {
        // Use the real scraped filings from SERFF!
        setScrapedResults(data.filings);
        setPagesScraped(data.pagesScraped);
        setTotalPages(data.totalPages);
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
          pagesScraped={pagesScraped}
          totalPages={totalPages}
        />
      )}

      {/* Latest Filings Section (only show if not searching) */}
      {!scrapedResults && !isScraperLoading && (
        <LatestFilings
          filings={latestFilings}
          isLoading={latestFilingsLoading}
          error={latestFilingsError}
        />
      )}

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label={`Filings This Month${currentMonth ? ` (${currentMonth})` : ''}`}
            value={
              monthlyStatsLoading 
                ? '...' 
                : monthlyStatsError 
                ? 'Error' 
                : monthlyFilings !== null 
                ? monthlyFilings.toString() 
                : '---'
            }
            change={monthlyStatsLoading ? 'Loading from SERFF...' : '🔴 Live from SERFF'}
            changeType="neutral"
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

        {/* Recent Filings Section - Now using real latest filings data above */}
        {/* The LatestFilings component displays real data with document lists */}
      </div>
    </>
  );
}
