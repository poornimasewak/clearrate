// components/sections/Hero.tsx
export function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 text-white py-20 px-8 text-center relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-5 py-2.5 rounded-full text-sm mb-8 border border-white/30 font-semibold">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50" />
          LIVE: 3 new rate filings today
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Insurance Rates,<br />Made Clear
        </h1>
        
        <p className="text-xl md:text-2xl opacity-95 mb-10 max-w-3xl mx-auto font-normal">
          Track insurance rate filings across the US with AI-powered summaries. 
          Know about rate changes before they hit your wallet.
        </p>
      </div>
    </div>
  );
}




