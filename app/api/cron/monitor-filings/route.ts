// app/api/cron/monitor-filings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { monitorAgent } from '@/lib/agents/monitor';

/**
 * Cron job endpoint to monitor SERFF for new filings
 * This runs daily at 6:00 AM (configured in vercel.json)
 * 
 * Can also be triggered manually via:
 * POST /api/cron/monitor-filings
 * Header: Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
    return handleMonitor(request);
}

export async function POST(request: NextRequest) {
    return handleMonitor(request);
}

async function handleMonitor(request: NextRequest) {
    try {
        // Verify the request is from Vercel Cron or has the correct secret
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            console.error('❌ Unauthorized cron request');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('🚀 Starting SERFF Monitor Agent...');

        // Configure which states and insurance types to monitor
        const monitorConfig = {
            states: [
                'California',
                'Texas',
                'New York',
                'Florida',
                // Add more states as needed
            ],
            insuranceTypes: [
                'Auto Insurance',
                // 'Home Insurance', // Uncomment to add more types
                // 'Life Insurance',
            ],
            // Optional: Monitor specific companies
            // companies: [
            //     '21st Century Casualty Company',
            //     'State Farm',
            // ],
        };

        // Run the monitor
        const result = await monitorAgent.monitorFilings(monitorConfig);

        // Log summary
        console.log('\n✅ Monitor Agent Complete');
        console.log(`   Total Filings: ${result.totalFilings}`);
        console.log(`   New Filings: ${result.newFilings}`);
        console.log(`   Errors: ${result.errors.length}`);

        // TODO: Send notification if new filings found
        if (result.newFilings > 0) {
            console.log(`\n🔔 Alert: ${result.newFilings} new filings detected!`);
            // await sendNotification(result);
        }

        return NextResponse.json({
            success: result.success,
            message: `Monitor completed. Found ${result.newFilings} new filings out of ${result.totalFilings} total.`,
            timestamp: result.timestamp,
            data: result,
        });

    } catch (error) {
        console.error('❌ Monitor Agent Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

/**
 * Manual trigger endpoint for testing
 * Usage: POST /api/cron/monitor-filings/test
 */
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max execution time




