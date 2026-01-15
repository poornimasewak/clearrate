# Agno + Claude Sonnet 3.5 Integration

## Overview
This project uses **Agno** for AI agent orchestration with **Claude Sonnet 3.5** (also known as Sonnet 4.5) for intelligent analysis of insurance rate filings.

## Setup

### 1. Install Dependencies
```bash
npm install @antipopp/agno-client @antipopp/agno-types @anthropic-ai/sdk
```

### 2. Environment Variables
Add to your `.env.local`:
```bash
# Anthropic API Key (for Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# Or use:
# CLAUDE_API_KEY=your_claude_api_key_here
```

Get your API key from: https://console.anthropic.com/

### 3. Configure Agno Client
See `lib/agno/client.ts` for the Agno configuration.

## Available Agents

### 1. **Summarizer Agent** (`lib/agents/summarizer.ts`)
Uses Claude Sonnet 3.5 to analyze insurance rate filings.

**Features:**
- ✅ Generates plain-English summaries
- ✅ Extracts key points
- ✅ Estimates consumer impact
- ✅ Assesses risk level (Low/Medium/High)
- ✅ Provides actionable advice

**Usage:**
```typescript
import { summarizerAgent } from '@/lib/agents/summarizer';

const filing = {
  companyName: '21st Century Casualty Company',
  naicNumber: '36404',
  productDescription: 'Private Passenger Auto',
  typeOfInsurance: '19.0001 Private Passenger Auto (PPA)',
  filingType: 'Rate',
  status: 'Closed - Approved',
  filingNumber: 'AGMK-132215191',
};

const summary = await summarizerAgent.summarizeFiling(filing);

console.log(summary.summary);
console.log(summary.keyPoints);
console.log(summary.riskLevel); // Low, Medium, or High
```

**Batch Processing:**
```typescript
const summaries = await summarizerAgent.summarizeFilings([filing1, filing2, filing3]);
```

**Market Analysis:**
```typescript
const analysis = await summarizerAgent.analyzeRateImpact(allFilings);
```

## Claude Models

### Sonnet 3.5 (Default)
- **Model ID:** `claude-sonnet-4-20250514`
- **Best for:** General analysis, summaries
- **Max tokens:** 2048-8192

### Haiku (Fast & Cheap)
- **Model ID:** `claude-3-5-haiku-20241022`
- **Best for:** Quick summaries, simple tasks

### Opus (Most Powerful)
- **Model ID:** `claude-3-opus-20240229`
- **Best for:** Complex reasoning, detailed analysis

## API Endpoints

### `/api/summarize-filing`
Generate AI summary for a single filing or batch.

**Request:**
```json
POST /api/summarize-filing
{
  "filing": {
    "companyName": "21st Century Casualty Company",
    "naicNumber": "36404",
    "productDescription": "Private Passenger Auto",
    "typeOfInsurance": "19.0001 Private Passenger Auto (PPA)",
    "filingType": "Rate",
    "status": "Closed - Approved",
    "filingNumber": "AGMK-132215191"
  }
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "filingNumber": "AGMK-132215191",
    "summary": "This filing represents a rate adjustment...",
    "keyPoints": [
      "Rate increase of 5-7% for auto insurance",
      "Affects private passenger vehicles only",
      "Changes effective Q2 2025"
    ],
    "estimatedImpact": "Consumers may see $50-100 annual increase",
    "riskLevel": "Medium",
    "consumerAdvice": "Compare rates before renewal"
  }
}
```

**Batch Request:**
```json
POST /api/summarize-filing
{
  "filings": [filing1, filing2, filing3]
}
```

## Test Pages

### AI Summarizer Test
Visit: `http://localhost:3000/test-ai`

- Test the AI summarizer with sample filings
- See Claude Sonnet 3.5 in action
- View structured analysis results

## Integration with Monitor Agent

The Monitor Agent can automatically generate AI summaries for new filings:

```typescript
// In lib/agents/monitor.ts (TODO)
import { summarizerAgent } from './summarizer';

// After detecting new filings:
if (newFilings.length > 0) {
  const summaries = await summarizerAgent.summarizeFilings(newFilings);
  await storeFilingsWithSummaries(newFilings, summaries);
}
```

## Cost Estimation

### Claude Sonnet 3.5 Pricing (as of Jan 2026)
- **Input:** ~$3 per million tokens
- **Output:** ~$15 per million tokens

### Example Costs
- Single filing summary (~2000 tokens): **~$0.03**
- 100 filings batch: **~$3.00**
- Daily monitor (50 new filings): **~$1.50/day** or **~$45/month**

## Best Practices

### 1. Rate Limiting
```typescript
// Add delays between requests
await this.delay(1000); // 1 second between summaries
```

### 2. Error Handling
```typescript
try {
  const summary = await summarizerAgent.summarizeFiling(filing);
} catch (error) {
  console.error('AI summary failed:', error);
  // Continue with other filings
}
```

### 3. Caching
Cache summaries in Supabase to avoid re-generating:
```typescript
// Check cache first
const cached = await supabase
  .from('filing_summaries')
  .select('*')
  .eq('filing_number', filing.filingNumber)
  .single();

if (cached) return cached;

// Generate if not cached
const summary = await summarizerAgent.summarizeFiling(filing);
await supabase.from('filing_summaries').insert(summary);
```

### 4. Batch Processing
Process multiple filings in parallel with rate limiting:
```typescript
const BATCH_SIZE = 10;
for (let i = 0; i < filings.length; i += BATCH_SIZE) {
  const batch = filings.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(f => summarizeFiling(f)));
  await delay(5000); // 5 second delay between batches
}
```

## Troubleshooting

### Error: "API key not found"
- Check `ANTHROPIC_API_KEY` is set in `.env.local`
- Restart the dev server after adding the key

### Error: "Rate limit exceeded"
- Add delays between requests
- Reduce batch sizes
- Upgrade your Anthropic plan

### Error: "Context length exceeded"
- Reduce `max_tokens` in the request
- Simplify your prompt
- Split large filings into chunks

## Advanced Usage

### Custom Prompts
Modify `buildPrompt()` in `summarizer.ts` to customize the AI's instructions.

### Different Models
Switch between models based on task:
```typescript
// For quick summaries
const response = await anthropic.messages.create({
  model: CLAUDE_CONFIG.HAIKU,
  max_tokens: 1024,
  // ...
});

// For detailed analysis
const response = await anthropic.messages.create({
  model: CLAUDE_CONFIG.OPUS,
  max_tokens: 8192,
  // ...
});
```

### Streaming Responses
For real-time streaming (coming soon with Agno):
```typescript
const stream = await anthropic.messages.stream({
  model: CLAUDE_CONFIG.SONNET,
  messages: [{ role: 'user', content: prompt }],
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

## Next Steps

- [ ] Integrate with Monitor Agent for automatic summarization
- [ ] Store summaries in Supabase
- [ ] Add email notifications with AI summaries
- [ ] Build dashboard to view all summaries
- [ ] Add comparison tool to compare multiple filings
- [ ] Implement caching to reduce API costs
- [ ] Add user feedback loop to improve prompts

## Resources

- **Agno Docs:** https://docs.agno.dev
- **Anthropic API:** https://docs.anthropic.com
- **Claude Models:** https://docs.anthropic.com/en/docs/models-overview
- **Prompt Engineering:** https://docs.anthropic.com/en/docs/prompt-engineering




