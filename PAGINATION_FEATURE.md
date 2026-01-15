# 📄 SERFF Pagination Feature

## Overview

The ClearRate scraper now supports **multi-page scraping up to 50 pages** of SERFF results. This allows users to extract hundreds or even thousands of filings in a single search.

---

## ✨ Features

### 1. **Configurable Page Limit**
- Users can specify how many pages to scrape (1-50)
- Default: 50 pages
- Each page typically contains 10-25 filings

### 2. **Automatic Pagination**
- Scraper automatically detects "Next" button
- Clicks through pages seamlessly
- Waits for content to load between pages (3 seconds)
- Stops when:
  - No more pages available
  - Maximum page limit reached

### 3. **Progress Tracking**
- Real-time page counter during scraping
- Final summary shows:
  - Total pages scraped
  - Total filings extracted
  - Average filings per page

### 4. **Screenshots for Debugging**
- Saves screenshot for each page: `step6-page-1.png`, `step6-page-2.png`, etc.
- Helps debug pagination issues

---

## 🔧 Technical Implementation

### Backend Changes

#### 1. **Updated Interfaces** (`lib/agents/puppeteer-scraper.ts`)

```typescript
interface PuppeteerScraperInput {
    state: string;
    insuranceType: string;
    companyName: string;
    startDate?: Date;
    maxPages?: number; // NEW: Maximum number of pages to scrape
}

interface PuppeteerScraperResult {
    success: boolean;
    resultCount: number;
    message?: string;
    error?: string;
    filings?: any[];
    sampleFilingDocuments?: any;
    pagesScraped?: number; // NEW: Actual pages scraped
    totalPages?: number;   // NEW: Total pages available
}
```

#### 2. **Pagination Logic** (`lib/agents/puppeteer-scraper.ts`)

```typescript
// Loop through pages
const maxPages = input.maxPages || 50;
let allFilings: any[] = [];
let currentPage = 1;
let hasNextPage = true;

while (hasNextPage && currentPage <= maxPages) {
    // Extract filings from current page
    const pageFilings = await page.evaluate(() => {
        // ... extraction logic ...
    });
    
    allFilings = [...allFilings, ...pageFilings];
    
    // Check for next page button
    const paginationInfo = await page.evaluate(() => {
        const nextButton = document.querySelector('.ui-paginator-next:not(.ui-state-disabled)');
        return { hasNextButton: !!nextButton };
    });
    
    // Click next button if available
    if (paginationInfo.hasNextButton && currentPage < maxPages) {
        await page.evaluate(() => {
            const nextBtn = document.querySelector('.ui-paginator-next');
            nextBtn?.click();
        });
        await new Promise(r => setTimeout(r, 3000));
        currentPage++;
    } else {
        hasNextPage = false;
    }
}
```

#### 3. **API Route Update** (`app/api/scrape/route.ts`)

```typescript
const { state, insuranceType, companyName, maxPages } = body;

const result = await puppeteerScraper.scrapeFilings({
    state,
    insuranceType,
    companyName: companyName || '',
    maxPages: maxPages || 50, // Default to 50 pages
});
```

### Frontend Changes

#### 1. **FilterBar Component** (`components/sections/FilterBar.tsx`)

Added `maxPages` input field:

```typescript
export interface FilterState {
    state: string;
    insuranceType: string;
    searchQuery: string;
    maxPages: number; // NEW
}

// In the component
<input
    type="number"
    id="maxPages"
    min="1"
    max="50"
    value={filters.maxPages}
    onChange={(e) => handleFilterChange('maxPages', e.target.value)}
/>
```

#### 2. **ScrapedResults Component** (`components/sections/ScrapedResults.tsx`)

Added pagination info display:

```typescript
interface ScrapedResultsProps {
    results: ScrapedFiling[] | null;
    isLoading: boolean;
    error?: string;
    pagesScraped?: number; // NEW
    totalPages?: number;   // NEW
}

// Pagination summary display
<div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
    <p>Successfully scraped {pagesScraped} pages with {results.length} filings</p>
</div>
```

#### 3. **Main Page** (`app/page.tsx`)

Updated to track and display pagination:

```typescript
const [pagesScraped, setPagesScraped] = useState<number | undefined>();
const [totalPages, setTotalPages] = useState<number | undefined>();

// In handleSearch
body: JSON.stringify({
    state: searchFilters.state,
    insuranceType: searchFilters.insuranceType,
    companyName: searchFilters.searchQuery || 'All',
    maxPages: searchFilters.maxPages || 50,
}),

// Store pagination info
setPagesScraped(data.pagesScraped);
setTotalPages(data.totalPages);
```

---

## 🧪 Testing

### Test Pages

1. **Main App**: http://localhost:3000
   - Select state, insurance type, and company
   - Set max pages (1-50)
   - Click "Search Filings"

2. **Pagination Test Page**: http://localhost:3000/test-pagination
   - Dedicated test page for pagination
   - Shows stats: pages scraped, total filings, avg per page
   - Displays sample filings

3. **Multi-State Test**: http://localhost:3000/test-states
   - Test pagination across different states

---

## 📊 Performance

### Timing Estimates

| Pages | Estimated Time | Expected Filings* |
|-------|----------------|-------------------|
| 1     | ~10 seconds    | 10-25             |
| 5     | ~25 seconds    | 50-125            |
| 10    | ~45 seconds    | 100-250           |
| 25    | ~2 minutes     | 250-625           |
| 50    | ~4 minutes     | 500-1,250         |

\* Varies by state and search criteria

### Bottlenecks

1. **Network Latency**: SERFF server response time
2. **Page Load Time**: 3-second wait between pages
3. **Puppeteer Overhead**: Browser automation
4. **Data Extraction**: Parsing HTML tables

### Optimization Tips

- For quick tests, use 1-5 pages
- For comprehensive data, use 25-50 pages
- Empty company name returns more results
- Recent filings (yesterday's date) have fewer pages

---

## 🔍 Pagination Detection

The scraper looks for PrimeFaces pagination controls:

```typescript
// Primary selector: PrimeFaces "Next" button
const nextButton = document.querySelector('.ui-paginator-next:not(.ui-state-disabled)');

// Fallback: Any link/button with "next" text
const nextLinks = Array.from(document.querySelectorAll('a, button'))
    .filter(el => el.textContent?.toLowerCase().includes('next') && !el.classList.contains('disabled'));
```

---

## 🐛 Debugging

### Screenshots

Each page generates a screenshot:
- `step6-page-1.png` - First page of results
- `step6-page-2.png` - Second page of results
- ... up to `step6-page-50.png`

### Console Logs

```
📄 Processing page 1...
   ✅ Extracted 26 filings from page 1
   📊 Pagination info: { hasNextButton: true, ... }
   ➡️ Navigating to page 2...

📄 Processing page 2...
   ✅ Extracted 25 filings from page 2
   ...
```

### Common Issues

1. **"No next button found"**
   - SERFF might have changed their pagination HTML
   - Check screenshot to see page state
   - Update selectors in scraper code

2. **"Stuck on same page"**
   - Next button click might not be working
   - Increase wait time between pages
   - Check for JavaScript errors in console

3. **"Fewer pages than expected"**
   - SERFF might have fewer results for your search
   - Try broader search (empty company name)
   - Check if SERFF is filtering results

---

## 🚀 Usage Examples

### Example 1: Get All Recent Auto Insurance Filings in California

```typescript
const response = await fetch('/api/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        state: 'California',
        insuranceType: 'Auto Insurance',
        companyName: '', // Empty = all companies
        maxPages: 50,
    }),
});
```

### Example 2: Get Specific Company Filings (First 5 Pages)

```typescript
const response = await fetch('/api/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        state: 'Illinois',
        insuranceType: 'Auto Insurance',
        companyName: 'State Farm',
        maxPages: 5,
    }),
});
```

### Example 3: Quick Test (1 Page Only)

```typescript
const response = await fetch('/api/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        state: 'California',
        insuranceType: 'Auto Insurance',
        companyName: '',
        maxPages: 1, // Quick test
    }),
});
```

---

## 📝 Future Enhancements

1. **Parallel Page Scraping**: Scrape multiple pages simultaneously
2. **Smart Pagination**: Auto-detect total pages and estimate time
3. **Resume Capability**: Save progress and resume from last page
4. **Rate Limiting**: Respect SERFF server load
5. **Progress Websocket**: Real-time progress updates to UI
6. **Incremental Results**: Stream results as pages are scraped
7. **Page Range Selection**: Scrape specific page ranges (e.g., pages 10-20)

---

## ✅ Summary

✨ **Pagination is fully implemented and tested!**

Users can now:
- ✅ Scrape up to 50 pages of SERFF results
- ✅ See pagination progress and stats
- ✅ Extract hundreds of filings in one search
- ✅ Use the test page to verify functionality
- ✅ Get screenshots for debugging

**Ready to use at**: http://localhost:3000

