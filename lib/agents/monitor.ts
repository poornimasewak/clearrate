// lib/agents/monitor.ts
import { PuppeteerSERFFScraper } from './puppeteer-scraper';

interface MonitorConfig {
    states: string[];
    insuranceTypes: string[];
    companies?: string[];
}

interface MonitorResult {
    success: boolean;
    timestamp: string;
    totalFilings: number;
    newFilings: number;
    errors: string[];
    summary: {
        state: string;
        insuranceType: string;
        company?: string;
        filingsFound: number;
    }[];
}

export class SERFFMonitorAgent {
    private scraper: PuppeteerSERFFScraper;
    private lastCheckedFilings: Set<string> = new Set();

    constructor() {
        this.scraper = new PuppeteerSERFFScraper();
    }

    /**
     * Monitor SERFF for new filings across multiple states and insurance types
     */
    async monitorFilings(config: MonitorConfig): Promise<MonitorResult> {
        console.log('🤖 SERFF Monitor Agent: Starting daily check...');
        console.log(`📅 Timestamp: ${new Date().toISOString()}`);
        console.log(`📊 Monitoring: ${config.states.length} states, ${config.insuranceTypes.length} insurance types`);

        const result: MonitorResult = {
            success: true,
            timestamp: new Date().toISOString(),
            totalFilings: 0,
            newFilings: 0,
            errors: [],
            summary: [],
        };

        // Iterate through each state and insurance type combination
        for (const state of config.states) {
            for (const insuranceType of config.insuranceTypes) {
                // If specific companies are provided, search for each
                // Otherwise, search without company filter (all companies)
                const companies = config.companies && config.companies.length > 0
                    ? config.companies
                    : [''];

                for (const company of companies) {
                    try {
                        console.log(`\n🔍 Checking: ${state} - ${insuranceType}${company ? ` - ${company}` : ' (All Companies)'}`);

                        const scrapeResult = await this.scraper.scrapeFilings({
                            state,
                            insuranceType,
                            companyName: company,
                        });

                        if (scrapeResult.success && scrapeResult.filings) {
                            const filingsFound = scrapeResult.filings.length;
                            result.totalFilings += filingsFound;

                            // Check for new filings (not seen before)
                            const newFilings = scrapeResult.filings.filter(
                                filing => !this.lastCheckedFilings.has(filing.filingNumber)
                            );

                            result.newFilings += newFilings.length;

                            // Update the set of seen filings
                            scrapeResult.filings.forEach(filing =>
                                this.lastCheckedFilings.add(filing.filingNumber)
                            );

                            result.summary.push({
                                state,
                                insuranceType,
                                company: company || undefined,
                                filingsFound,
                            });

                            console.log(`   ✅ Found ${filingsFound} filings (${newFilings.length} new)`);

                            // TODO: Store new filings in Supabase
                            if (newFilings.length > 0) {
                                await this.storeFilings(newFilings);
                            }
                        } else {
                            const error = `Failed to scrape ${state} - ${insuranceType}: ${scrapeResult.error}`;
                            console.error(`   ❌ ${error}`);
                            result.errors.push(error);
                        }

                        // Add delay between searches to avoid rate limiting
                        await this.delay(5000); // 5 second delay

                    } catch (error) {
                        const errorMsg = `Error checking ${state} - ${insuranceType}: ${error instanceof Error ? error.message : String(error)}`;
                        console.error(`   ❌ ${errorMsg}`);
                        result.errors.push(errorMsg);
                        result.success = false;
                    }
                }
            }
        }

        console.log('\n📊 Monitor Agent Summary:');
        console.log(`   Total Filings Found: ${result.totalFilings}`);
        console.log(`   New Filings: ${result.newFilings}`);
        console.log(`   Errors: ${result.errors.length}`);

        return result;
    }

    /**
     * Store filings in Supabase database
     */
    private async storeFilings(filings: any[]): Promise<void> {
        console.log(`   💾 Storing ${filings.length} new filings in database...`);

        // TODO: Implement Supabase storage
        // For now, just log the filings
        for (const filing of filings) {
            console.log(`      📄 ${filing.filingNumber} - ${filing.companyName}`);
        }

        // Example Supabase implementation (uncomment when ready):
        /*
        import { createClient } from '@supabase/supabase-js';
        
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side
        );

        const { data, error } = await supabase
            .from('filings')
            .upsert(
                filings.map(filing => ({
                    filing_number: filing.filingNumber,
                    company_name: filing.companyName,
                    naic_number: filing.naicNumber,
                    product_description: filing.productDescription,
                    type_of_insurance: filing.typeOfInsurance,
                    filing_type: filing.filingType,
                    status: filing.status,
                    discovered_at: new Date().toISOString(),
                })),
                { onConflict: 'filing_number' }
            );

        if (error) {
            console.error('   ❌ Error storing filings:', error);
            throw error;
        }

        console.log('   ✅ Filings stored successfully');
        */
    }

    /**
     * Quick check for specific high-priority filings
     */
    async quickCheck(state: string, insuranceType: string): Promise<MonitorResult> {
        return this.monitorFilings({
            states: [state],
            insuranceTypes: [insuranceType],
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const monitorAgent = new SERFFMonitorAgent();

