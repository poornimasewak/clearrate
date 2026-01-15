// app/api/latest-filings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { latestFilingsAgent } from '@/lib/agents/latest-filings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'California';
    const insuranceType = searchParams.get('insuranceType') || 'All';
    const limit = parseInt(searchParams.get('limit') || '5');

    console.log('🚀 API: Getting latest filings with documents...');
    console.log(`   State: ${state}, Type: ${insuranceType}, Limit: ${limit}`);

    const result = await latestFilingsAgent.getLatestFilingsWithDocs({
      state,
      insuranceType,
      limit,
    });

    console.log('✅ API: Latest filings retrieved:', result.filings.length);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        success: false,
        filings: [],
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, insuranceType, limit } = body;

    console.log('🚀 API: Getting latest filings (POST)...');

    const result = await latestFilingsAgent.getLatestFilingsWithDocs({
      state: state || 'California',
      insuranceType: insuranceType || 'All',
      limit: limit || 5,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        success: false,
        filings: [],
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

