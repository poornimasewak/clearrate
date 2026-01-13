// lib/agents/scraper.ts
import FirecrawlApp from '@mendable/firecrawl-js';

interface ScraperInput {
    state: string;
    insuranceType: string;
    companyName: string;
}

interface ScraperResult {
    success: boolean;
    resultCount: number;
    message?: string;
    error?: string;
    filings?: any[]; // Array of scraped filing data
}

export class SERFFScraper {
    private firecrawl: FirecrawlApp;

    // Map state names to their SERFF state codes
    private stateCodes: Record<string, string> = {
        'California': 'CA',
        'Texas': 'TX',
        'New York': 'NY',
        'Florida': 'FL',
        'Illinois': 'IL',
        'Pennsylvania': 'PA',
        'Ohio': 'OH',
        'Michigan': 'MI',
        'Georgia': 'GA',
        'North Carolina': 'NC',
    };

    // Map friendly insurance type names to SERFF values
    private insuranceTypeMapping: Record<string, { businessType: string; toi: string }> = {
        'Auto Insurance': {
            businessType: 'Property & Casualty',
            toi: '19.0 Personal Auto',
        },
        'Home Insurance': {
            businessType: 'Property & Casualty',
            toi: '22.0 Homeowners',
        },
        'Life Insurance': {
            businessType: 'Life and Accident & Health',
            toi: '10.0 Life',
        },
        'Health Insurance': {
            businessType: 'Life and Accident & Health',
            toi: '40.0 Health',
        },
        'All Types': {
            businessType: 'Property & Casualty',
            toi: '', // Empty for all types
        },
    };

    constructor() {
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
            throw new Error('FIRECRAWL_API_KEY is not set in environment variables');
        }
        this.firecrawl = new FirecrawlApp({ apiKey });
    }

    /**
     * Gets the SERFF home URL for a specific state
     */
    private getStateHomeUrl(state: string): string {
        const stateCode = this.stateCodes[state];
        if (!stateCode) {
            throw new Error(`State code not found for: ${state}`);
        }
        return `https://filingaccess.serff.com/sfa/home/${stateCode}`;
    }

    /**
     * Gets the search parameters for the given input
     */
    private getSearchParams(input: ScraperInput): { businessType: string; toi: string } {
        const mapping = this.insuranceTypeMapping[input.insuranceType];
        if (!mapping) {
            console.warn(`⚠️ Unknown insurance type: ${input.insuranceType}, using Auto Insurance`);
            return this.insuranceTypeMapping['Auto Insurance'];
        }
        return mapping;
    }

    /**
     * Scrapes SERFF for insurance filings and returns the count of results on page 1
     * 
     * Flow:
     * 1. Start at state home page
     * 2. Navigate to search page
     * 3. Fill in search form with Business Type and TOI
     * 4. Submit and scrape results
     */
    async scrapeFilings(input: ScraperInput): Promise<ScraperResult> {
        try {
            console.log('🔍 Starting SERFF scrape with input:', input);

            // Get search parameters
            const searchParams = this.getSearchParams(input);
            console.log('📋 Search parameters:', {
                businessType: searchParams.businessType,
                toi: searchParams.toi,
                companyName: input.companyName || '(all companies)',
                state: input.state,
            });

            // Get the state home URL
            const stateHomeUrl = this.getStateHomeUrl(input.state);
            console.log('📍 State home URL:', stateHomeUrl);

            console.log('🌐 Step 1: Crawling SERFF starting from home page...');

            try {
                // Check if crawl method exists (API might have different method names)
                if (typeof this.firecrawl.crawl === 'function') {
                    console.log('🕷️ Using crawl() method...');
                    const crawlResponse = await this.firecrawl.crawl(stateHomeUrl, {
                        limit: 10,
                        scrapeOptions: {
                            formats: ['markdown', 'html'],
                        },
                    }) as any; // Type assertion needed for Firecrawl API compatibility

                    console.log('📥 FULL Crawl response:', JSON.stringify(crawlResponse, null, 2));

                    if (crawlResponse?.success && crawlResponse?.data) {
                        console.log(`📊 Crawled ${crawlResponse.data.length} pages`);

                        for (let i = 0; i < crawlResponse.data.length; i++) {
                            const page = crawlResponse.data[i];
                            console.log(`\n📄 Page ${i + 1}/${crawlResponse.data.length}:`);
                            console.log(`  URL: ${page.metadata?.url || 'unknown'}`);
                            console.log(`  Title: ${page.metadata?.title || 'unknown'}`);
                            console.log(`  Content preview: ${(page.markdown || '').substring(0, 200)}`);

                            if ((page.markdown?.includes('Filing Search') ||
                                page.metadata?.url?.includes('filingSearch'))) {
                                console.log('✅ This looks like the search page!');
                                console.log('📄 Full page content:');
                                console.log(page.markdown?.substring(0, 1500));

                                const resultCount = this.parseResultCount(page);
                                if (resultCount > 0) {
                                    return {
                                        success: true,
                                        resultCount,
                                        message: `Found ${resultCount} ${searchParams.toi || 'P&C'} filings in ${input.state}`,
                                        filings: [page],
                                    };
                                }
                            }
                        }
                    }
                } else {
                    console.warn('⚠️ Crawl method not available in this Firecrawl version');
                }
            } catch (crawlError) {
                console.warn('⚠️ Crawl failed:', crawlError);
            }

            // Step 2: Try to use Firecrawl's map feature to extract structured data
            console.log('🗺️  Step 2: Attempting to extract structured filing data...');

            try {
                // Try map feature if available
                if (typeof this.firecrawl.map === 'function') {
                    console.log('🗺️  Using map() to extract filing data...');

                    const mapResponse = await this.firecrawl.map(stateHomeUrl, {
                        search: `${searchParams.toi} filings ${input.companyName || ''}`.trim(),
                        limit: 20,
                    }) as any; // Type assertion needed for Firecrawl API compatibility

                    console.log('📥 FULL Map response:', JSON.stringify(mapResponse, null, 2));

                    if (mapResponse?.success && mapResponse?.data && mapResponse.data.length > 0) {
                        const resultCount = mapResponse.data.length;
                        console.log(`\n✅ ========== EXTRACTED ${resultCount} FILINGS ==========`);

                        // Log each filing in detail
                        mapResponse.data.forEach((filing: any, index: number) => {
                            console.log(`\n📄 Filing #${index + 1}:`);
                            console.log(JSON.stringify(filing, null, 2));
                        });

                        console.log(`\n========================================\n`);

                        return {
                            success: true,
                            resultCount,
                            message: `Found ${resultCount} ${searchParams.toi} filings in ${input.state}`,
                            filings: mapResponse.data,
                        };
                    }
                } else {
                    console.warn('⚠️ Map method not available');
                }
            } catch (mapError) {
                console.warn('⚠️ Map extraction failed:', mapError);
            }

            // Step 3: Try to access the results page directly
            console.log('🌐 Step 3: Attempting to access results page...');
            const resultsPageUrl = `https://filingaccess.serff.com/sfa/search/filingSearchResults.xhtml`;

            const resultsPageResult = await this.firecrawl.scrape(resultsPageUrl) as any; // Type assertion needed for Firecrawl API compatibility

            console.log('📥 Results page response:', JSON.stringify(resultsPageResult, null, 2));

            if (resultsPageResult?.success && !resultsPageResult.markdown?.includes('Session Expired')) {
                console.log('✅ Results page accessed!');
                console.log('📄 Full results content:');
                console.log(resultsPageResult.markdown);

                const resultCount = this.parseResultCount(resultsPageResult);

                if (resultCount > 0) {
                    return {
                        success: true,
                        resultCount,
                        message: `Found ${resultCount} filings on results page`,
                        filings: [resultsPageResult],
                    };
                }
            } else {
                console.warn('⚠️ Results page returned Session Expired');
            }

            // Step 4: Need form submission with browser automation
            console.warn('⚠️ SERFF requires form submission to access filingSearchResults.xhtml');
            console.warn('⚠️ Form parameters needed:');
            console.warn(`   - Business Type: ${searchParams.businessType}`);
            console.warn(`   - TOI: ${searchParams.toi}`);
            console.warn(`   - Company: ${input.companyName || '(all)'}`);
            console.warn('⚠️ This requires Firecrawl browser actions or Puppeteer/Playwright');

            return this.getMockData(input);

        } catch (error) {
            console.error('❌ Scraper error:', error);
            return this.getMockData(input);
        }
    }

    /**
     * Returns mock data when SERFF is not accessible
     * This simulates what real data would look like
     */
    private getMockData(input: ScraperInput): ScraperResult {
        const searchParams = this.getSearchParams(input);
        const mockCount = Math.floor(Math.random() * 15) + 5; // Random 5-20 results

        const criteria = [];
        criteria.push(`Business Type: ${searchParams.businessType}`);
        if (searchParams.toi) criteria.push(`TOI: ${searchParams.toi}`);
        if (input.companyName) criteria.push(`Company: ${input.companyName}`);

        return {
            success: true,
            resultCount: mockCount,
            message: `[DEMO] Found ${mockCount} results for ${input.state}. Search criteria: ${criteria.join(', ')}. (Note: Form submission requires browser automation - showing demo data)`,
        };
    }

    /**
     * Parses the scraped HTML/markdown to extract result count and filing details
     */
    private parseResultCount(scrapeResult: any): number {
        // V4 API returns data in a different structure
        const markdown = scrapeResult.data?.markdown || scrapeResult.markdown || '';
        const html = scrapeResult.data?.html || scrapeResult.html || '';

        console.log('📄 Parsing results from:', scrapeResult.metadata?.url || 'unknown URL');
        console.log('📄 Content preview:', markdown.substring(0, 300));

        // SERFF-specific patterns
        // Pattern 1: "X results found" or "X total results"
        const patterns = [
            /(\d+)\s+(?:total\s+)?results?(?:\s+found)?/i,
            /(?:showing|displaying)\s+(\d+)\s+(?:of\s+)?(\d+)/i,
            /(?:found|retrieved)\s+(\d+)\s+filings?/i,
            /(\d+)\s+filings?\s+(?:match|found)/i,
        ];

        for (const pattern of patterns) {
            const match = markdown.match(pattern);
            if (match) {
                const count = parseInt(match[1], 10);
                console.log('✅ Found result count via pattern:', count);
                return count;
            }
        }

        // Pattern 2: Count table rows (SERFF uses tables for results)
        if (html) {
            // Look for data tables specifically
            const tableMatches = html.match(/<table[^>]*class="[^"]*(?:data|result|filing)[^"]*"[^>]*>[\s\S]*?<\/table>/gi);
            if (tableMatches) {
                const rowMatches = tableMatches[0].match(/<tr[^>]*>/gi);
                if (rowMatches && rowMatches.length > 1) {
                    const count = rowMatches.length - 1; // Subtract header row
                    console.log('✅ Found result count via table rows:', count);
                    return count;
                }
            }
        }

        // Pattern 3: Look for filing entries in markdown (bulleted lists, headers, etc.)
        const filingPatterns = [
            /^[-*]\s+.+(?:Filing|SERR-\d+|[A-Z]{2}-\d{4})/gim,
            /^#{2,3}\s+.+Filing/gim,
        ];

        for (const pattern of filingPatterns) {
            const matches = markdown.match(pattern);
            if (matches && matches.length > 0) {
                console.log('✅ Found result count via filing patterns:', matches.length);
                return matches.length;
            }
        }

        console.log('⚠️ No results found in content');
        return 0;
    }
}

// Export a singleton instance
export const serffScraper = new SERFFScraper();

