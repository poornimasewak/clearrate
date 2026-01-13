// lib/agents/summarizer.ts
import { anthropic, CLAUDE_CONFIG } from '@/lib/agno/client';

interface FilingSummaryInput {
    companyName: string;
    naicNumber: string;
    productDescription: string;
    typeOfInsurance: string;
    filingType: string;
    status: string;
    filingNumber: string;
}

interface FilingSummary {
    filingNumber: string;
    summary: string;
    keyPoints: string[];
    estimatedImpact: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    consumerAdvice: string;
}

export class AISummarizerAgent {
    /**
     * Generate AI summary for a filing using Claude Sonnet 3.5
     */
    async summarizeFiling(filing: FilingSummaryInput): Promise<FilingSummary> {
        console.log(`🤖 AI Agent: Summarizing filing ${filing.filingNumber}...`);

        const prompt = this.buildPrompt(filing);

        try {
            const response = await anthropic.messages.create({
                model: CLAUDE_CONFIG.SONNET,
                max_tokens: CLAUDE_CONFIG.MAX_TOKENS.ANALYSIS,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            const content = response.content[0];
            const text = content.type === 'text' ? content.text : '';

            // Parse the AI response
            const summary = this.parseAIResponse(text, filing);

            console.log(`✅ AI Agent: Summary generated for ${filing.filingNumber}`);
            return summary;

        } catch (error) {
            console.error('❌ AI Agent Error:', error);
            throw new Error(`Failed to generate AI summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Batch summarize multiple filings
     */
    async summarizeFilings(filings: FilingSummaryInput[]): Promise<FilingSummary[]> {
        console.log(`🤖 AI Agent: Batch summarizing ${filings.length} filings...`);

        const summaries: FilingSummary[] = [];

        for (const filing of filings) {
            try {
                const summary = await this.summarizeFiling(filing);
                summaries.push(summary);

                // Add delay to avoid rate limiting
                await this.delay(1000); // 1 second between requests

            } catch (error) {
                console.error(`❌ Failed to summarize ${filing.filingNumber}:`, error);
                // Continue with other filings
            }
        }

        return summaries;
    }

    /**
     * Analyze rate changes and consumer impact
     */
    async analyzeRateImpact(filings: FilingSummaryInput[]): Promise<string> {
        console.log(`🤖 AI Agent: Analyzing rate impact across ${filings.length} filings...`);

        const prompt = `
You are an insurance industry analyst. Analyze these recent insurance rate filings and provide insights:

${filings.map((f, i) => `
Filing ${i + 1}:
- Company: ${f.companyName}
- Type: ${f.typeOfInsurance}
- Filing Type: ${f.filingType}
- Status: ${f.status}
- Product: ${f.productDescription}
`).join('\n')}

Provide:
1. Overall market trends
2. Companies with most activity
3. Predicted consumer impact
4. Recommendations for consumers

Keep your response concise and actionable.
`;

        try {
            const response = await anthropic.messages.create({
                model: CLAUDE_CONFIG.SONNET,
                max_tokens: CLAUDE_CONFIG.MAX_TOKENS.DETAILED,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : 'Unable to generate analysis';

        } catch (error) {
            console.error('❌ AI Agent Error:', error);
            throw error;
        }
    }

    private buildPrompt(filing: FilingSummaryInput): string {
        return `
You are an insurance analyst specializing in rate filings. Analyze this insurance filing:

Company: ${filing.companyName}
NAIC Number: ${filing.naicNumber}
Product: ${filing.productDescription}
Insurance Type: ${filing.typeOfInsurance}
Filing Type: ${filing.filingType}
Status: ${filing.status}
Filing Number: ${filing.filingNumber}

Provide a structured analysis in the following format:

SUMMARY:
[A 2-3 sentence overview of what this filing means]

KEY POINTS:
- [Point 1]
- [Point 2]
- [Point 3]

ESTIMATED IMPACT:
[How this might affect consumers - rate increase/decrease, coverage changes, etc.]

RISK LEVEL:
[Low/Medium/High - based on how significant this filing is for consumers]

CONSUMER ADVICE:
[1-2 sentences of actionable advice for consumers]

Keep your response clear, concise, and focused on consumer impact.
`;
    }

    private parseAIResponse(text: string, filing: FilingSummaryInput): FilingSummary {
        // Simple parsing - extract sections
        const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/i);
        const keyPointsMatch = text.match(/KEY POINTS:\s*([\s\S]*?)(?=ESTIMATED IMPACT:|$)/i);
        const impactMatch = text.match(/ESTIMATED IMPACT:\s*([\s\S]*?)(?=RISK LEVEL:|$)/i);
        const riskMatch = text.match(/RISK LEVEL:\s*(\w+)/i);
        const adviceMatch = text.match(/CONSUMER ADVICE:\s*([\s\S]*?)$/i);

        // Extract key points as array
        const keyPointsText = keyPointsMatch ? keyPointsMatch[1] : '';
        const keyPoints = keyPointsText
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^-\s*/, '').trim())
            .filter(point => point.length > 0);

        // Determine risk level
        const riskText = riskMatch ? riskMatch[1].toLowerCase() : 'medium';
        let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
        if (riskText.includes('low')) riskLevel = 'Low';
        else if (riskText.includes('high')) riskLevel = 'High';

        return {
            filingNumber: filing.filingNumber,
            summary: summaryMatch ? summaryMatch[1].trim() : text.substring(0, 200),
            keyPoints: keyPoints.length > 0 ? keyPoints : ['Analysis in progress'],
            estimatedImpact: impactMatch ? impactMatch[1].trim() : 'Impact under review',
            riskLevel,
            consumerAdvice: adviceMatch ? adviceMatch[1].trim() : 'Monitor this filing for updates',
        };
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const summarizerAgent = new AISummarizerAgent();

