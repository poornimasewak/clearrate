// components/layout/Footer.tsx
import Link from 'next/link';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <div className="w-9 h-9 border-3 border-white rounded-full relative flex items-center justify-center">
                  <span className="text-white font-bold text-base">$</span>
                  <div className="absolute w-0.5 h-3.5 bg-white -bottom-3 -right-1 rotate-45 rounded" />
                </div>
              </div>
              <span className="text-2xl font-bold">ClearRate</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Making insurance rate data accessible, understandable, and actionable. 
              Track filings, understand changes, make informed decisions.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-lg font-bold mb-5">Navigate</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-slate-400 hover:text-white transition-colors">
                  Compare Rates
                </Link>
              </li>
              <li>
                <Link href="/trends" className="text-slate-400 hover:text-white transition-colors">
                  Market Trends
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About ClearRate
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-5">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-700 text-center text-slate-400">
          <p>
            © 2025 ClearRate. Insurance rates, made clear. Built with Next.js, Agno, and Claude AI.
          </p>
        </div>
      </div>
    </footer>
  );
}




