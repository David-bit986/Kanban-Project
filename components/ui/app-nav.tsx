'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, X } from 'lucide-react';

export default function AppNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 bg-[#000000] text-white font-sans border-b border-white/5">
      {/* Left Menu / Logo */}
      <Link href="/" className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 100 100"
          className="text-white"
          fill="none"
        >
          <clipPath id="circle-clip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          <circle cx="50" cy="50" r="48" fill="transparent" stroke="currentColor" strokeWidth="4" />
          <g clipPath="url(#circle-clip)">
            <path d="M -10 110 L 110 -10 M -10 85 L 110 -35 M -10 60 L 110 -60 M -10 35 L 110 -85 M -10 10 L 110 -110 M -10 135 L 110 15" stroke="currentColor" strokeWidth="8" />
          </g>
        </svg>
        <span className="text-[17px] font-semibold tracking-tight ml-1">TaskSync</span>
      </Link>

      {/* Middle Links (Desktop) */}
      <div className="hidden md:flex items-center gap-7 text-[14px] font-medium">
        <Link href="/" className={`transition-colors hover:text-zinc-100 ${pathname === '/' ? 'text-zinc-100' : 'text-zinc-400'}`}>
          Home
        </Link>
        <Link href="/info" className={`transition-colors hover:text-zinc-100 ${pathname === '/info' ? 'text-zinc-100' : 'text-zinc-400'}`}>
          Project Info
        </Link>
        <Link href="/pricing" className={`transition-colors hover:text-zinc-100 ${pathname === '/pricing' ? 'text-zinc-100' : 'text-zinc-400'}`}>
          Pricing
        </Link>
        <div className="flex items-center gap-6">
          <div className="w-[1px] h-4 bg-zinc-800"></div>
          <Link href="/login" className="text-[14px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-[#EEEEEE] hover:bg-white text-black text-[14px] font-medium px-4 py-1.5 rounded-[6px] transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#000000] border-b border-white/5 py-6 px-6 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium ${pathname === '/' ? 'text-white' : 'text-zinc-400'}`}
          >
            Home
          </Link>
          <Link 
            href="/info" 
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium ${pathname === '/info' ? 'text-white' : 'text-zinc-400'}`}
          >
            Project Info
          </Link>
          <Link 
            href="/pricing" 
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium ${pathname === '/pricing' ? 'text-white' : 'text-zinc-400'}`}
          >
            Pricing
          </Link>
          <div className="h-[1px] bg-white/5 w-full my-2"></div>
          <Link 
            href="/login" 
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-zinc-400"
          >
            Log in
          </Link>
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="bg-white text-black text-center text-lg font-bold py-3 rounded-xl"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}
