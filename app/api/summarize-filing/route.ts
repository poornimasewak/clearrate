// app/api/summarize-filing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { summarizerAgent } from '@/lib/agents/summarizer';

/**
 * API endpoint to generate AI summaries for insurance filings
 * 
 * POST /api/summarize-filing
 * Body: { filing: { companyName, naicNumber, ... } }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { filing, filings } = body;

        // Validate input
        if (!filing && !filings) {
            return NextResponse.json(
                { error: 'Missing required field: filing or filings' },
                { status: 400 }
            );
        }

        // Single filing summary
        if (filing) {
            console.log(`🤖 Generating AI summary for filing: ${filing.filingNumber}`);
            
            const summary = await summarizerAgent.summarizeFiling(filing);
            
            return NextResponse.json({
                success: true,
                summary,
            });
        }

        // Batch summarization
        if (filings && Array.isArray(filings)) {
            console.log(`🤖 Batch summarizing ${filings.length} filings...`);
            
            const summaries = await summarizerAgent.summarizeFilings(filings);
            
            return NextResponse.json({
                success: true,
                count: summaries.length,
                summaries,
            });
        }

        return NextResponse.json(
            { error: 'Invalid request format' },
            { status: 400 }
        );

    } catch (error) {
        console.error('❌ Summarizer API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for batch processing

