// lib/agents/puppeteer-scraper.ts
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

interface PuppeteerScraperInput {
    state: string;
    insuranceType: string;
    companyName: string;
}

interface PuppeteerScraperResult {
    success: boolean;
    resultCount: number;
    message?: string;
    error?: string;
    filings?: any[];
}

export class PuppeteerSERFFScraper {
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

    async scrapeFilings(input: PuppeteerScraperInput): Promise<PuppeteerScraperResult> {
        console.log('🤖 Starting SERFF scrape with Puppeteer (v2 - with checkboxes)...');
        console.log('📋 Input:', input);

        const stateCode = this.stateCodes[input.state];
        const searchParams = this.insuranceTypeMapping[input.insuranceType];
        
        if (!stateCode || !searchParams) {
            return {
                success: false,
                resultCount: 0,
                error: 'Invalid state or insurance type',
            };
        }

        console.log('🎯 Search params:', searchParams);

        let browser;
        try {
            // Configure for serverless environment (Vercel) or local development
            const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
            
            const launchOptions: any = {
                headless: true,
                args: isProduction 
                    ? [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox']
                    : ['--no-sandbox', '--disable-setuid-sandbox'],
            };
            
            // In production (Vercel), use chromium from @sparticuz/chromium
            if (isProduction) {
                launchOptions.executablePath = await chromium.executablePath();
            }
            // For local development, puppeteer-core will use system Chrome
            // Or install regular 'puppeteer' package for local dev
            
            browser = await puppeteer.launch(launchOptions);

            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(60000);

            // ================================================================
            // STEP 1: Navigate to home page
            // https://filingaccess.serff.com/sfa/home/CA
            // ================================================================
            console.log('\n🏠 STEP 1: Navigate to home page');
            const homeUrl = `https://filingaccess.serff.com/sfa/home/${stateCode}`;
            
            await page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 2000));
            await page.screenshot({ path: 'step1-home.png', fullPage: true });
            
            console.log(`   ✅ URL: ${page.url()}`);
            console.log(`   📸 Screenshot: step1-home.png`);

            // ================================================================
            // STEP 2: Click "Begin Search" button
            // Should go to: https://filingaccess.serff.com/sfa/userAgreement.xhtml
            // ================================================================
            console.log('\n🔘 STEP 2: Click "Begin Search" button');
            
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('a.btn.btn-success')
            ]);
            
            await new Promise(r => setTimeout(r, 2000));
            await page.screenshot({ path: 'step2-terms.png', fullPage: true });
            
            console.log(`   ✅ URL: ${page.url()}`);
            console.log(`   📸 Screenshot: step2-terms.png`);

            // ================================================================
            // STEP 3: Click "Accept" button on terms page
            // Should go to: https://filingaccess.serff.com/sfa/search/filingSearch.xhtml
            // ================================================================
            console.log('\n✅ STEP 3: Click "Accept" button');
            
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('input[type="submit"], button[type="submit"]')
            ]);
            
            await new Promise(r => setTimeout(r, 2000));
            await page.screenshot({ path: 'step3-search-form.png', fullPage: true });
            
            console.log(`   ✅ URL: ${page.url()}`);
            console.log(`   📸 Screenshot: step3-search-form.png`);

            // ================================================================
            // STEP 4: Fill in the form
            // Business Type: Property & Casualty
            // Type of Insurance: 19.0 Personal Auto (CHECKBOX)
            // Company Name: 21st Century Casualty Company
            // ================================================================
            console.log('\n📝 STEP 4: Fill in the search form');
            console.log(`   Business Type: ${searchParams.businessType}`);
            console.log(`   Type of Insurance: ${searchParams.toi}`);
            console.log(`   Company: ${input.companyName}`);

            // Step 4a: Select Business Type
            await page.evaluate((businessType) => {
                const businessSelect = document.querySelector('select[id*="businessType"]') as HTMLSelectElement;
                if (businessSelect) {
                    const options = Array.from(businessSelect.options);
                    const option = options.find(o => o.text.includes('Property') && o.text.includes('Casualty'));
                    if (option) {
                        businessSelect.selectedIndex = options.indexOf(option);
                        businessSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }, searchParams.businessType);

            console.log('   ✅ Business Type selected');

            // Wait for Type of Insurance checkboxes to appear
            console.log('   ⏳ Waiting for Type of Insurance checkboxes...');
            await new Promise(r => setTimeout(r, 3000));

            // Step 4b: Check Type of Insurance checkbox
            const toiChecked = await page.evaluate((toiText) => {
                // Find all checkboxes and their labels
                const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
                const toiCode = toiText.split(' ')[0]; // Get "19.0"
                
                for (const checkbox of checkboxes) {
                    // Look for label or nearby text containing the TOI code
                    const label = document.querySelector(`label[for="${checkbox.id}"]`);
                    const parent = checkbox.parentElement;
                    const text = (label?.textContent || parent?.textContent || '');
                    
                    if (text.includes(toiCode) || text.includes('Personal Auto')) {
                        (checkbox as HTMLInputElement).checked = true;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                        return { found: true, text, id: checkbox.id };
                    }
                }
                
                return { found: false, checkboxCount: checkboxes.length };
            }, searchParams.toi);

            console.log('   Type of Insurance checkbox:', toiChecked);

            // Step 4c: Fill company name (handle autocomplete carefully)
            console.log('   ⏳ Typing company name...');
            
            if (input.companyName) {
                const companyInputSelector = 'input[id*="companyName"]';
                const companyInput = await page.$(companyInputSelector);
                if (!companyInput) {
                    throw new Error('Company name input not found');
                }
                
                // Clear the field completely using JavaScript
                await page.evaluate((selector) => {
                    const input = document.querySelector(selector) as HTMLInputElement;
                    if (input) {
                        input.value = '';
                        input.focus();
                    }
                }, companyInputSelector);
                
                await new Promise(r => setTimeout(r, 500));
                
                // Type the company name slowly to avoid autocomplete issues
                await companyInput.type(input.companyName, { delay: 100 });
                
                // Press Escape to dismiss any autocomplete dropdown
                await page.keyboard.press('Escape');
                await new Promise(r => setTimeout(r, 500));
                
                // Verify what was actually entered
                const actualValue = await page.evaluate((selector) => {
                    const input = document.querySelector(selector) as HTMLInputElement;
                    return input ? input.value : '';
                }, companyInputSelector);
                
                console.log(`   ✅ Company name entered: "${actualValue}" (expected: "${input.companyName}")`);
                
                if (actualValue !== input.companyName) {
                    console.warn(`   ⚠️ Warning: Company name mismatch! Got "${actualValue}" instead of "${input.companyName}"`);
                }
                
                await new Promise(r => setTimeout(r, 1000));
            }

            await page.screenshot({ path: 'step4-form-filled.png', fullPage: true });
            console.log(`   📸 Screenshot: step4-form-filled.png`);

            // ================================================================
            // STEP 5: Submit search
            // Should go to: https://filingaccess.serff.com/sfa/search/filingSearchResults.xhtml
            // ================================================================
            console.log('\n🔍 STEP 5: Click Search button and submit form...');
            
            try {
                // Debug: Find all buttons on the page
                const buttonInfo = await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
                    return buttons.map(b => ({
                        tag: b.tagName,
                        type: (b as HTMLInputElement).type,
                        value: (b as HTMLInputElement).value,
                        text: b.textContent?.trim(),
                        id: b.id,
                        classes: b.className,
                        visible: (b as HTMLElement).offsetParent !== null
                    }));
                });
                console.log('   🔍 Found buttons:', JSON.stringify(buttonInfo, null, 2));
                
                // Try multiple approaches to submit
                console.log('   ⏳ Attempting form submission...');
                
                // Find the Search button (it's a <button>, not <input>!)
                let searchButton = await page.$('#simpleSearch\\:saveBtn');
                
                if (!searchButton) {
                    // Fallback: try to find button with text "Search"
                    console.log('   ⚠️ Primary selector failed, trying fallback...');
                    
                    // Use page.$ with a more generic selector
                    const buttons = await page.$$('button[type="submit"]');
                    for (const button of buttons) {
                        const text = await page.evaluate(el => el.textContent?.trim(), button);
                        if (text === 'Search') {
                            searchButton = button;
                            break;
                        }
                    }
                }
                
                if (!searchButton) {
                    throw new Error('Search button not found on page!');
                }
                
                console.log('   ✅ Search button found, clicking...');
                
                // Start waiting for navigation BEFORE clicking
                const navigationPromise = page.waitForNavigation({ 
                    waitUntil: 'networkidle2', 
                    timeout: 60000 
                });
                
                // Click the button
                await searchButton.click();
                console.log('   ✅ Button clicked, waiting for navigation...');
                
                // Wait for navigation
                await navigationPromise;
                console.log('   ✅ Navigation complete!');
                
                await new Promise(r => setTimeout(r, 3000)); // Extra wait
                await page.screenshot({ path: 'step5-results.png', fullPage: true });
                
                console.log(`   ✅ Final URL: ${page.url()}`);
                console.log(`   📸 Screenshot: step5-results.png`);
                
                // Check if we reached the results page
                if (!page.url().includes('filingSearchResults')) {
                    console.warn(`   ⚠️ Warning: Not on results page. Current URL: ${page.url()}`);
                    
                    // Check for errors on the page
                    const pageText = await page.evaluate(() => document.body.textContent || '');
                    if (pageText.includes('Session Expired')) {
                        throw new Error('SERFF session expired.');
                    }
                    if (pageText.toLowerCase().includes('error') || pageText.toLowerCase().includes('validation')) {
                        console.log('   ⚠️ Possible validation error on page');
                    }
                    
                    throw new Error(`Navigation failed. Still on: ${page.url()}`);
                }
                
                console.log('✅ Successfully reached results page!');
                
            } catch (error: any) {
                console.error(`   ❌ Error: ${error.message}`);
                await page.screenshot({ path: 'step5-error.png', fullPage: true });
                console.log(`   📸 Error screenshot: step5-error.png`);
                throw error;
            }

            // ================================================================
            // STEP 6: Extract real filing data from results table
            // ================================================================
            console.log('\n📊 STEP 6: Extracting filing data from results table...');
            
            // Debug: Find all tables and their structure
            const tableInfo = await page.evaluate(() => {
                const tables = Array.from(document.querySelectorAll('table'));
                return tables.map((table, idx) => ({
                    index: idx,
                    id: table.id,
                    classes: table.className,
                    rowCount: table.querySelectorAll('tbody tr').length,
                    hasData: table.querySelectorAll('tbody tr td').length > 0
                }));
            });
            console.log('   🔍 Found tables:', JSON.stringify(tableInfo, null, 2));
            
            const filings = await page.evaluate(() => {
                // Try multiple selectors to find the results table
                let rows: Element[] = [];
                
                // Try selector 1: PrimeFaces datatable
                rows = Array.from(document.querySelectorAll('table.ui-datatable tbody tr'));
                if (rows.length === 0) {
                    // Try selector 2: Any table with tbody
                    rows = Array.from(document.querySelectorAll('table tbody tr'));
                }
                if (rows.length === 0) {
                    // Try selector 3: Just all tr elements
                    rows = Array.from(document.querySelectorAll('tr'));
                }
                
                console.log(`Found ${rows.length} rows using selector`);
                
                return rows.map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    
                    // Skip rows without enough cells (e.g., header rows, empty rows)
                    if (cells.length < 7) return null;
                    
                    return {
                        companyName: cells[0]?.textContent?.trim() || '',
                        naicNumber: cells[1]?.textContent?.trim() || '',
                        productDescription: cells[2]?.textContent?.trim() || '',
                        typeOfInsurance: cells[3]?.textContent?.trim() || '',
                        filingType: cells[4]?.textContent?.trim() || '', // Rate, Form, Rule
                        status: cells[5]?.textContent?.trim() || '',
                        filingNumber: cells[6]?.textContent?.trim() || '',
                    };
                }).filter(filing => filing !== null && filing.filingNumber); // Remove null entries and empty filings
            });

            console.log(`✅ Extracted ${filings.length} real filings from SERFF!`);
            if (filings.length > 0) {
                console.log('📋 Sample filing:', JSON.stringify(filings[0], null, 2));
                console.log('📋 Total filings:', filings.length);
            }

            return {
                success: true,
                resultCount: filings.length,
                message: `Found ${filings.length} real filings from SERFF!`,
                filings: filings,
            };

        } catch (error) {
            console.error('❌ Error:', error);
            return {
                success: false,
                resultCount: 0,
                error: error instanceof Error ? error.message : String(error),
            };
        } finally {
            if (browser) await browser.close();
        }
    }
}

export const puppeteerScraper = new PuppeteerSERFFScraper();
