// components/sections/FilterBar.tsx
'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
  onSearch?: (filters: FilterState) => void;
}

export interface FilterState {
  state: string;
  insuranceType: string;
  searchQuery: string;
}

export function FilterBar({ onFilterChange, onSearch }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    state: 'California',
    insuranceType: 'Auto Insurance',
    searchQuery: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      await onSearch?.(filters);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white p-8 max-w-7xl mx-auto -mt-12 mb-12 rounded-2xl shadow-2xl border border-slate-200 relative z-20">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* State Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="state" className="font-semibold text-slate-700 text-sm">
            📍 State
          </label>
          <select
            id="state"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="px-4 py-3.5 border-2 border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option>California</option>
            <option>Texas</option>
            <option>New York</option>
            <option>Florida</option>
            <option>Illinois</option>
          </select>
        </div>

        {/* Insurance Type Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="insurance-type" className="font-semibold text-slate-700 text-sm">
            📋 Insurance Type
          </label>
          <select
            id="insurance-type"
            value={filters.insuranceType}
            onChange={(e) => handleFilterChange('insuranceType', e.target.value)}
            className="px-4 py-3.5 border-2 border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option>Auto Insurance</option>
            <option>Home Insurance</option>
            <option>Life Insurance</option>
            <option>Health Insurance</option>
            <option>All Types</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="font-semibold text-slate-700 text-sm">
            🔍 Search Company
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by company name..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="px-4 py-3.5 border-2 border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSearching}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        {isSearching ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">🔄</span> Searching SERFF...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🔍 Search Filings
          </span>
        )}
      </button>
      </form>
    </div>
  );
}

