// components/layout/Navbar.tsx
import Link from 'next/link';
import { Logo } from '../ui/Logo';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-2xl font-bold text-blue-900">ClearRate</span>
          </Link>
          
          <ul className="flex gap-8">
            <li>
              <Link 
                href="/" 
                className="text-slate-600 hover:text-blue-500 font-medium transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/compare" 
                className="text-slate-600 hover:text-blue-500 font-medium transition-colors"
              >
                Compare
              </Link>
            </li>
            <li>
              <Link 
                href="/trends" 
                className="text-slate-600 hover:text-blue-500 font-medium transition-colors"
              >
                Trends
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="text-slate-600 hover:text-blue-500 font-medium transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

