// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { puppeteerScraper } from '@/lib/agents/puppeteer-scraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, insuranceType, companyName, maxPages } = body;

    // Validate input
    if (!state || !insuranceType) {
      return NextResponse.json(
        { error: 'Missing required fields: state, insuranceType' },
        { status: 400 }
      );
    }

    console.log('🚀 API: Starting Puppeteer scrape...');
    console.log(`📄 Max pages: ${maxPages || 50}`);

    // Run the Puppeteer scraper (real browser automation)
    const result = await puppeteerScraper.scrapeFilings({
      state,
      insuranceType,
      companyName: companyName || '',
      maxPages: maxPages || 50, // Default to 50 pages
    });

    console.log('✅ API: Scrape complete:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

