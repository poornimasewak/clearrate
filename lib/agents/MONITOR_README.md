# SERFF Monitor Agent

## Overview
The Monitor Agent automatically checks SERFF portals daily for new insurance rate filings.

## Features
- ✅ **Scheduled Daily Checks** - Runs every day at 6:00 AM UTC
- 🔍 **Multi-State Monitoring** - Check multiple states simultaneously
- 🏢 **Company Tracking** - Monitor specific companies or all companies
- 💾 **Database Integration** - Stores new filings in Supabase
- 🔔 **New Filing Alerts** - Detects and reports new filings

## Setup

### 1. Environment Variables
Add to your `.env.local` and Vercel environment variables:

```bash
# Generate a secure random secret for cron authentication
CRON_SECRET=your_random_secret_here

# Supabase service role key (for server-side database writes)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

To generate a secure CRON_SECRET:
```bash
openssl rand -base64 32
```

### 2. Vercel Cron Configuration
The `vercel.json` file configures the cron schedule:
```json
{
  "crons": [
    {
      "path": "/api/cron/monitor-filings",
      "schedule": "0 6 * * *"
    }
  ]
}
```

**Schedule format**: `minute hour day month dayOfWeek`
- `0 6 * * *` = Every day at 6:00 AM UTC
- `0 */6 * * *` = Every 6 hours
- `0 0 * * 0` = Every Sunday at midnight

### 3. Configure Monitoring
Edit `app/api/cron/monitor-filings/route.ts` to set which states and insurance types to monitor:

```typescript
const monitorConfig = {
    states: [
        'California',
        'Texas',
        'New York',
        'Florida',
    ],
    insuranceTypes: [
        'Auto Insurance',
        'Home Insurance',
    ],
    // Optional: Monitor specific companies
    companies: [
        '21st Century Casualty Company',
        'State Farm',
    ],
};
```

## Usage

### Automatic (Scheduled)
Once deployed to Vercel, the cron job runs automatically at 6:00 AM daily.

### Manual Trigger (Testing)
You can manually trigger the monitor for testing:

```bash
# Using curl (replace with your CRON_SECRET)
curl -X POST https://your-domain.vercel.app/api/cron/monitor-filings \
  -H "Authorization: Bearer your_cron_secret_here"
```

Or via the Vercel dashboard:
1. Go to your project on Vercel
2. Navigate to "Cron Jobs"
3. Click "Run" next to the monitor job

### Quick Check (Single Search)
Use the quick check method for testing a specific state/type:

```typescript
import { monitorAgent } from '@/lib/agents/monitor';

const result = await monitorAgent.quickCheck('California', 'Auto Insurance');
```

## How It Works

1. **Daily Trigger**: Vercel Cron triggers the endpoint at 6:00 AM
2. **Authentication**: Request is verified using CRON_SECRET
3. **Scraping**: Agent scrapes configured states/types using Puppeteer
4. **Change Detection**: Compares filings to previous check
5. **Storage**: New filings are stored in Supabase
6. **Notification**: Logs alert if new filings found (TODO: email/slack)

## Database Schema

The monitor stores filings in Supabase with this structure:

```sql
CREATE TABLE filings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filing_number TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    naic_number TEXT,
    product_description TEXT,
    type_of_insurance TEXT,
    filing_type TEXT,
    status TEXT,
    discovered_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_filings_number ON filings(filing_number);
CREATE INDEX idx_filings_discovered ON filings(discovered_at);
```

## API Response

```json
{
  "success": true,
  "message": "Monitor completed. Found 5 new filings out of 127 total.",
  "timestamp": "2025-01-13T06:00:00.000Z",
  "data": {
    "totalFilings": 127,
    "newFilings": 5,
    "errors": [],
    "summary": [
      {
        "state": "California",
        "insuranceType": "Auto Insurance",
        "filingsFound": 50
      }
    ]
  }
}
```

## Monitoring & Logs

View cron job logs in Vercel:
1. Project Dashboard → Functions → Cron Jobs
2. Click on the specific execution to see logs
3. Check for errors, new filings, and execution time

## Error Handling

The monitor is resilient to errors:
- ✅ Continues even if one state/type fails
- ✅ Logs all errors for debugging
- ✅ Returns partial success with error details
- ✅ 5-minute timeout prevents hanging

## Next Steps (TODO)

- [ ] Implement Supabase storage (currently just logs)
- [ ] Add email notifications for new filings
- [ ] Add Slack/Discord webhook notifications
- [ ] Track rate changes over time
- [ ] Generate AI summaries for new filings
- [ ] Build dashboard to view monitoring history

## Troubleshooting

**Cron not running?**
- Check Vercel environment variables are set
- Verify `vercel.json` is in the project root
- Check cron job is enabled in Vercel dashboard

**Getting 401 Unauthorized?**
- Verify CRON_SECRET matches in Vercel environment variables
- Check Authorization header format: `Bearer YOUR_SECRET`

**Timeout errors?**
- Reduce number of states/types to monitor
- Increase `maxDuration` in route.ts (max 300s on Pro plan)
- Consider running multiple smaller cron jobs

**No new filings detected?**
- First run will mark all as "new"
- Subsequent runs compare against previous check
- Check `lastCheckedFilings` is persisting correctly




