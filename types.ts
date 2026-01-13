// types/index.ts

// Filing Types
export interface Filing {
  id: string;
  filing_id: string;
  company_name: string;
  state: string;
  product_type: 'Auto' | 'Home' | 'Life' | 'Health';
  rate_change_pct: number;
  filing_date: string;
  approval_date?: string;
  status: 'Pending' | 'Approved' | 'Denied';
  effective_date: string;
  filing_number: string;
  pdf_path?: string;
  created_at: string;
  updated_at: string;
}

// AI Summary Types
export interface AISummary {
  id: string;
  filing_id: string;
  summary_text: string;
  main_reasons: string[];
  consumer_impact: string;
  key_statistics: string[];
  tokens_used: number;
  generated_at: string;
}

// Trend Statistics Types
export interface TrendStats {
  id: string;
  state: string;
  month_year: string;
  avg_rate_increase: number;
  median_rate_increase: number;
  total_filings: number;
  pct_increases: number;
  pct_decreases: number;
  companies_filing: number;
  updated_at: string;
}

// Filter State Types
export interface FilterState {
  state: string;
  insuranceType: string;
  searchQuery: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Component Props Types
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

export interface FilingCardProps {
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

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export interface AISummaryContentProps {
  summary: string;
  reasons: string[];
  consumerImpact: string;
  comparison?: string;
}

// API Response Types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

