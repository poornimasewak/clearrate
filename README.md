# ClearRate - Insurance Rates, Made Clear

A modern Next.js application for tracking insurance rate filings across the US with AI-powered summaries.

## 🚀 Features

- **Real-time Rate Tracking**: Monitor insurance rate filings as they're submitted
- **AI-Powered Summaries**: Claude AI generates plain-English summaries of complex rate justifications
- **Interactive Filtering**: Filter by state, insurance type, and company
- **Comprehensive Comparisons**: Compare rates across multiple companies and states
- **Market Insights**: View trends and analytics on rate changes
- **Beautiful UI**: Modern, responsive design built with Tailwind CSS

## 📦 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: React 19.2.3
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript 5.x
- **AI**: Claude API by Anthropic
- **Agent Orchestration**: Agno Platform
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel Edge Network

## 🏗️ Project Structure

```
clearrate/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with recent filings
│   ├── compare/           # Compare rates page
│   ├── trends/            # Market trends page
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Main navigation bar
│   ├── Hero.tsx          # Hero section
│   ├── Filters.tsx       # Filter controls
│   ├── StatsGrid.tsx     # Statistics cards
│   ├── FilingCard.tsx    # Individual filing card
│   ├── Modal.tsx         # Modal component
│   ├── Footer.tsx        # Footer component
│   └── Logo.tsx          # Logo component
└── public/               # Static assets
```

## 🎨 Components

### Navigation
- Sticky navigation bar with active route highlighting
- Responsive design
- Logo with custom magnifying glass icon

### Hero Section
- Gradient background with animated pattern
- Live badge with pulse animation
- Clear call-to-action messaging

### Filters
- State selection
- Insurance type filtering
- Company search
- Real-time updates

### Stats Grid
- Key metrics display
- Hover animations
- Responsive grid layout

### Filing Cards
- Company information
- Rate change visualization
- Status badges
- Action buttons
- Modal integration for detailed views

### Modal
- AI-generated summaries
- Consumer impact analysis
- Market comparisons
- Detailed filing information

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd clearrate
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Pages

### Home (`/`)
- Recent insurance rate filings
- Interactive filing cards
- Quick stats overview
- AI-powered summaries in modals

### Compare (`/compare`)
- Side-by-side rate comparisons
- Interactive charts (placeholder)
- Sortable table of all filings

### Trends (`/trends`)
- Market insights and analytics
- Time-series data visualization (placeholder)
- Key market indicators

### About (`/about`)
- Project information
- Technology stack details
- How it works explanation

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Responsive**: Works beautifully on desktop, tablet, and mobile
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance**: Optimized with Next.js 16 and Turbopack
- **Color Scheme**: Blue gradient theme with status-based color coding

## 🔮 Future Enhancements

- Real data integration with SERFF portals
- Interactive data visualization charts
- User authentication and saved searches
- Email alerts for new filings
- API for third-party integrations
- Advanced filtering and sorting options

## 📄 License

This is a portfolio project for demonstration purposes.

## 👨‍💻 Author

Built with ❤️ using Next.js, React, and Claude AI

---

**Note**: This is a demonstration project. The data shown is sample data for illustration purposes.
