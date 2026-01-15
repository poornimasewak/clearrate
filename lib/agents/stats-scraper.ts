// lib/agents/stats-scraper.ts
import puppeteer from 'puppeteer';

interface MonthlyStatsInput {
    state: string;
    insuranceType?: string; // Optional: specific type or 'All'
}

interface MonthlyStatsResult {
    success: boolean;
    totalFilings: number;
    month: string;
    year: number;
    error?: string;
    breakdown?: {
        auto?: number;
        home?: number;
        life?: number;
        health?: number;
    };
}

export class SERFFStatsAgent {
    private stateCodes: Record<string, string> = {
        'California': 'CA',
        'Texas': 'TX',
        'New York': 'NY',
        'Florida': 'FL',
        'Illinois': 'IL',
    };

    private insuranceTypeMapping: Record<string, { businessType: string; toi: string }> = {
        'Auto Insurance': {
            businessType: 'Property & Casualty',
            toi: '19.0 Personal Auto',
        },
        'Home Insurance': {
            businessType: 'Property & Casualty',
            toi: '22.0 Homeowners',
        },
    };

    /**
     * Get total filings for the current month
     */
    async getMonthlyFilingCount(input: MonthlyStatsInput): Promise<MonthlyStatsResult> {
        console.log('📊 Getting monthly filing stats from SERFF...');
        
        const stateCode = this.stateCodes[input.state];
        if (!stateCode) {
            return {
                success: false,
                totalFilings: 0,
                month: '',
                year: 0,
                error: `Invalid state: ${input.state}`,
            };
        }

        // Calculate date range for this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const monthName = startOfMonth.toLocaleDateString('en-US', { month: 'long' });
        const year = startOfMonth.getFullYear();

        console.log(`   📅 Date Range: ${this.formatDateForSERFF(startOfMonth)} to ${this.formatDateForSERFF(endOfMonth)}`);

        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                ],
            });

            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(60000);

            // Navigate through SERFF (same flow as main scraper)
            console.log('   🏠 Step 1: Navigate to home page');
            const homeUrl = `https://filingaccess.serff.com/sfa/home/${stateCode}`;
            await page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 2000));

            console.log('   🔘 Step 2: Click "Begin Search"');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('a.btn.btn-success')
            ]);
            await new Promise(r => setTimeout(r, 2000));

            console.log('   ✅ Step 3: Click "Accept"');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('input[type="submit"], button[type="submit"]')
            ]);
            await new Promise(r => setTimeout(r, 2000));

            // Fill form with date range for this month
            console.log('   📝 Step 4: Fill form for monthly stats');
            
            if (input.insuranceType && input.insuranceType !== 'All') {
                const searchParams = this.insuranceTypeMapping[input.insuranceType];
                if (searchParams) {
                    // Select Business Type
                    await page.evaluate((businessType) => {
                        const businessSelect = document.querySelector('select[id*="businessType"]') as HTMLSelectElement;
                        if (businessSelect) {
                            const options = Array.from(businessSelect.options);
                            const option = options.find(o => o.text.includes('Property') && o.text.includes('Casualty'));
                            if (option) {
                                businessSelect.value = option.value;
                                businessSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                    }, searchParams.businessType);
                    await new Promise(r => setTimeout(r, 1000));

                    // Check Type of Insurance checkbox
                    await page.evaluate((toiCode) => {
                        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"][id*="availableTois"]'));
                        for (const checkbox of checkboxes) {
                            const label = document.querySelector(`label[for="${checkbox.id}"]`);
                            const text = (label?.textContent || checkbox.parentElement?.textContent || '');
                            if (text.includes(toiCode) || text.includes('Personal Auto')) {
                                (checkbox as HTMLInputElement).checked = true;
                                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                                break;
                            }
                        }
                    }, searchParams.toi.split(' ')[0]);
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            // Set date range (start of month to today)
            await page.evaluate((startDate, endDate) => {
                const startInput = document.querySelector('input[id*="submissionStartDate"]') as HTMLInputElement;
                const endInput = document.querySelector('input[id*="submissionEndDate"]') as HTMLInputElement;
                
                if (startInput) {
                    startInput.value = startDate;
                    startInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                if (endInput) {
                    endInput.value = endDate;
                    endInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, this.formatDateForSERFF(startOfMonth), this.formatDateForSERFF(endOfMonth));

            await new Promise(r => setTimeout(r, 2000));

            console.log('   🔍 Step 5: Search');
            const buttons = await page.$$('button[type="submit"]');
            for (const button of buttons) {
                const text = await page.evaluate(el => el.textContent?.trim(), button);
                if (text === 'Search') {
                    const navigationPromise = page.waitForNavigation({ 
                        waitUntil: 'networkidle2', 
                        timeout: 60000 
                    });
                    await button.click();
                    await navigationPromise;
                    break;
                }
            }

            await new Promise(r => setTimeout(r, 3000));

            // Count total filings from results
            console.log('   📊 Step 6: Count filings');
            const totalCount = await page.evaluate(() => {
                // Try to find result count in UI
                const resultText = document.body.textContent || '';
                
                // Look for patterns like "Showing 1-25 of 456 results"
                const match = resultText.match(/of\s+(\d+)\s+(result|filing|record)/i);
                if (match) {
                    return parseInt(match[1]);
                }
                
                // Count rows in table
                const rows = Array.from(document.querySelectorAll('table.ui-datatable tbody tr, table tbody tr'));
                const validRows = rows.filter(row => {
                    const cells = row.querySelectorAll('td');
                    return cells.length >= 7; // Valid filing row
                });
                
                return validRows.length;
            });

            console.log(`   ✅ Found ${totalCount} filings for ${monthName} ${year}`);

            await page.screenshot({ path: 'stats-monthly-count.png', fullPage: true });

            return {
                success: true,
                totalFilings: totalCount,
                month: monthName,
                year: year,
            };

        } catch (error) {
            console.error('❌ Error getting monthly stats:', error);
            return {
                success: false,
                totalFilings: 0,
                month: '',
                year: 0,
                error: error instanceof Error ? error.message : String(error),
            };
        } finally {
            if (browser) await browser.close();
        }
    }

    private formatDateForSERFF(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }
}

export const serffStatsAgent = new SERFFStatsAgent();

