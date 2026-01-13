// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
        About ClearRate
      </h1>
      <p className="text-2xl text-slate-600 mb-16 leading-relaxed">
        We're making insurance rate data accessible, understandable, and actionable for everyone.
      </p>

      {/* Mission */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-5">🎯 Our Mission</h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          Insurance rate filings are public information, but they're buried in complex PDFs across 
          50 different state websites. ClearRate monitors these filings automatically, uses AI to 
          summarize them in plain English, and presents the data in a way that actually helps people 
          make informed decisions.
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-5">🔍 How It Works</h2>
        <ol className="space-y-3 text-slate-600 leading-relaxed text-lg list-decimal list-inside">
          <li>We monitor SERFF (System for Electronic Rate & Form Filing) portals daily across multiple states</li>
          <li>Our AI agents automatically download and parse new filings as they're submitted</li>
          <li>Claude AI generates plain-English summaries of complex rate justifications (often 50+ pages)</li>
          <li>We aggregate data to show trends, comparisons, and market insights</li>
          <li>You get clear, actionable information before rate changes hit your wallet</li>
        </ol>
      </div>

      {/* Technology Stack */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">💻 Technology Stack</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Frontend:</strong>
            <span className="text-slate-600">Next.js 14, React, Tailwind CSS</span>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Agent Orchestration:</strong>
            <span className="text-slate-600">Agno Platform</span>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Database:</strong>
            <span className="text-slate-600">Supabase (PostgreSQL)</span>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">AI:</strong>
            <span className="text-slate-600">Claude API by Anthropic</span>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Hosting:</strong>
            <span className="text-slate-600">Vercel Edge Network</span>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Data Processing:</strong>
            <span className="text-slate-600">Python, Playwright, pdfplumber</span>
          </div>
        </div>
      </div>

      {/* About This Project */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl border-2 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">📬 About This Project</h2>
        <p className="text-blue-900 leading-relaxed text-lg mb-5">
          ClearRate is a portfolio project built to demonstrate modern web development practices, 
          AI agent orchestration, and data visualization skills. It showcases the ability to work with 
          real-world data, build production-ready UIs, and create meaningful tools that solve actual problems.
        </p>
        <p className="text-blue-900 text-lg">
          <strong>Built by [Your Name]</strong><br />
          <a href="#" className="text-blue-600 font-semibold hover:underline">GitHub</a> • 
          <a href="#" className="text-blue-600 font-semibold hover:underline ml-2">LinkedIn</a> • 
          <a href="#" className="text-blue-600 font-semibold hover:underline ml-2">Portfolio</a>
        </p>
      </div>
    </div>
  );
}
