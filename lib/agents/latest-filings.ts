// lib/agents/latest-filings.ts
import puppeteer from 'puppeteer';

interface LatestFilingsInput {
    state: string;
    insuranceType?: string;
    limit?: number; // Number of filings to fetch (default: 5)
}

interface FilingDocument {
    name: string;
    type: string;
    size?: string;
    url?: string;
}

interface FilingWithDocs {
    companyName: string;
    naicNumber: string;
    productDescription: string;
    typeOfInsurance: string;
    filingType: string;
    status: string;
    filingNumber: string;
    documents: FilingDocument[];
    documentCount: number;
}

interface LatestFilingsResult {
    success: boolean;
    filings: FilingWithDocs[];
    error?: string;
}

export class LatestFilingsAgent {
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
     * Get latest N filings with their document lists
     */
    async getLatestFilingsWithDocs(input: LatestFilingsInput): Promise<LatestFilingsResult> {
        console.log('📰 Fetching latest filings with documents from SERFF...');
        
        const stateCode = this.stateCodes[input.state];
        const limit = input.limit || 5;
        
        if (!stateCode) {
            return {
                success: false,
                filings: [],
                error: `Invalid state: ${input.state}`,
            };
        }

        const searchParams = input.insuranceType && input.insuranceType !== 'All' 
            ? this.insuranceTypeMapping[input.insuranceType]
            : null;

        // Use yesterday's date to get recent filings
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

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

            // STEP 1-5: Navigate to SERFF and get results (same as main scraper)
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

            // STEP 4: Fill form
            console.log('   📝 Step 4: Fill search form');
            
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

            // Set start date to yesterday for recent filings
            await page.evaluate((date) => {
                const startInput = document.querySelector('input[id*="submissionStartDate"]') as HTMLInputElement;
                if (startInput) {
                    startInput.value = date;
                    startInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, this.formatDateForSERFF(yesterday));

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

            // STEP 6: Extract first N filings
            console.log(`   📊 Step 6: Extract top ${limit} filings`);
            const filings = await page.evaluate((maxFilings) => {
                const rows = Array.from(document.querySelectorAll('table.ui-datatable tbody tr, table tbody tr'));
                
                return rows.slice(0, maxFilings).map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    if (cells.length < 7) return null;
                    
                    return {
                        companyName: cells[0]?.textContent?.trim() || '',
                        naicNumber: cells[1]?.textContent?.trim() || '',
                        productDescription: cells[2]?.textContent?.trim() || '',
                        typeOfInsurance: cells[3]?.textContent?.trim() || '',
                        filingType: cells[4]?.textContent?.trim() || '',
                        status: cells[5]?.textContent?.trim() || '',
                        filingNumber: cells[6]?.textContent?.trim() || '',
                    };
                }).filter(f => f !== null && f.filingNumber);
            }, limit);

            console.log(`   ✅ Found ${filings.length} recent filings`);

            // STEP 7: For each filing, click and get document list
            const filingsWithDocs: FilingWithDocs[] = [];

            for (let i = 0; i < filings.length; i++) {
                const filing = filings[i];
                console.log(`   📄 Step 7.${i + 1}: Getting documents for filing ${filing.filingNumber}...`);

                try {
                    // Click on the filing number link
                    const clicked = await page.evaluate((filingNumber) => {
                        const links = Array.from(document.querySelectorAll('a'));
                        const link = links.find(l => l.textContent?.trim() === filingNumber);
                        if (link) {
                            (link as HTMLElement).click();
                            return true;
                        }
                        return false;
                    }, filing.filingNumber);

                    if (!clicked) {
                        console.log(`      ⚠️ Could not find link for ${filing.filingNumber}`);
                        filingsWithDocs.push({
                            ...filing,
                            documents: [],
                            documentCount: 0,
                        });
                        continue;
                    }

                    // Wait for detail page to load
                    await new Promise(r => setTimeout(r, 3000));

                    // Extract documents
                    const documents = await page.evaluate(() => {
                        const docs: any[] = [];
                        
                        // Look for document links
                        const docLinks = Array.from(document.querySelectorAll('a[href*="pdf"], a[href*="doc"], a[href*="file"]'));
                        docLinks.forEach(link => {
                            const name = link.textContent?.trim() || '';
                            const href = (link as HTMLAnchorElement).href || '';
                            if (name && href) {
                                docs.push({
                                    name,
                                    type: href.includes('.pdf') ? 'PDF' : 'Document',
                                    url: href,
                                });
                            }
                        });

                        // Look for file listings
                        const fileRows = Array.from(document.querySelectorAll('tr'));
                        fileRows.forEach(row => {
                            const cells = Array.from(row.querySelectorAll('td'));
                            if (cells.length >= 2) {
                                const fileName = cells[0]?.textContent?.trim();
                                const fileSize = cells[1]?.textContent?.trim();
                                if (fileName && fileName.includes('.')) {
                                    const existing = docs.find(d => d.name === fileName);
                                    if (!existing) {
                                        docs.push({
                                            name: fileName,
                                            type: fileName.endsWith('.pdf') ? 'PDF' : 'Document',
                                            size: fileSize,
                                        });
                                    }
                                }
                            }
                        });

                        return docs;
                    });

                    console.log(`      ✅ Found ${documents.length} documents`);

                    filingsWithDocs.push({
                        ...filing,
                        documents,
                        documentCount: documents.length,
                    });

                    // Go back to results
                    await page.goBack();
                    await new Promise(r => setTimeout(r, 2000));

                } catch (error) {
                    console.error(`      ❌ Error getting docs for ${filing.filingNumber}:`, error);
                    filingsWithDocs.push({
                        ...filing,
                        documents: [],
                        documentCount: 0,
                    });
                    
                    // Try to go back to results
                    try {
                        await page.goBack();
                        await new Promise(r => setTimeout(r, 2000));
                    } catch (e) {
                        // If goBack fails, we might need to re-search
                        break;
                    }
                }
            }

            await page.screenshot({ path: 'latest-filings-with-docs.png', fullPage: true });

            return {
                success: true,
                filings: filingsWithDocs,
            };

        } catch (error) {
            console.error('❌ Error:', error);
            return {
                success: false,
                filings: [],
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

export const latestFilingsAgent = new LatestFilingsAgent();

