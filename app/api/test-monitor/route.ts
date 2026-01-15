// app/api/test-monitor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { monitorAgent } from '@/lib/agents/monitor';

/**
 * Test endpoint for Monitor Agent
 * This is for development/testing only
 * 
 * Usage: POST /api/test-monitor
 * Body: { "state": "California", "insuranceType": "Auto Insurance" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { state, insuranceType, company } = body;

        // Validate input
        if (!state || !insuranceType) {
            return NextResponse.json(
                { error: 'Missing required fields: state, insuranceType' },
                { status: 400 }
            );
        }

        console.log('🧪 Testing Monitor Agent...');
        console.log(`   State: ${state}`);
        console.log(`   Insurance Type: ${insuranceType}`);
        if (company) console.log(`   Company: ${company}`);

        // Run a quick check for the specified parameters
        const result = await monitorAgent.monitorFilings({
            states: [state],
            insuranceTypes: [insuranceType],
            companies: company ? [company] : undefined,
        });

        return NextResponse.json({
            success: true,
            message: 'Monitor test completed',
            result,
        });

    } catch (error) {
        console.error('❌ Test Monitor Error:', error);
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
export const maxDuration = 300; // 5 minutes




