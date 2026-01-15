// app/api/stats/monthly-filings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serffStatsAgent } from '@/lib/agents/stats-scraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'California';
    const insuranceType = searchParams.get('insuranceType') || 'All';

    console.log('🚀 API: Getting monthly filing stats...');
    console.log(`   State: ${state}`);
    console.log(`   Insurance Type: ${insuranceType}`);

    // Get monthly stats from SERFF
    const result = await serffStatsAgent.getMonthlyFilingCount({
      state,
      insuranceType,
    });

    console.log('✅ API: Stats retrieved:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        success: false,
        totalFilings: 0,
        month: '',
        year: 0,
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, insuranceType } = body;

    console.log('🚀 API: Getting monthly filing stats (POST)...');

    const result = await serffStatsAgent.getMonthlyFilingCount({
      state: state || 'California',
      insuranceType: insuranceType || 'All',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        success: false,
        totalFilings: 0,
        month: '',
        year: 0,
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

