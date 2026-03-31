
"use client"
import React from 'react';
import AppNav from "@/components/ui/app-nav";

const mail = "tanasescudavid@gmail.com"

const SocialLink: React.FC<{ href: string; ariaLabel: string; children: React.ReactNode }> = ({ href, ariaLabel, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="bg-white/5 border border-white/10 p-3 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm"
  >
    {children}
  </a>
);

// Main Hero Component
const HeroSection: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Dark mode burgundy radial background MUST be first */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(125% 125% at 50% 100%, #250101ff 0%, #000000 60%)",
        }}
      />
      
      {/* Nav with higher z-index so it isn't hidden by the background */}
      <div className="relative z-50">
        <AppNav />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto flex-1 mt-[-4rem] animate-fade-in-up">

        {/* Avatar Section */}
        <div className="relative mb-8">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 p-[3px] shadow-2xl shadow-rose-900/50 hover:scale-105 transition-transform duration-300">
            <img
              src="https://avatars.githubusercontent.com/u/75855764?s=400&u=c77dfff61b4be70f47c7e362b56620db69ff0a80&v=4"
              alt="Developer Avatar"
              className="w-full h-full rounded-full object-cover border-[4px] border-[#000000]"
            />
          </div>
          <div className="absolute bottom-2 -right-2 text-4xl animate-wave">
             <span>👋</span>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-5xl text-white leading-tight font-light tracking-tight">
          <span className="font-bold bg-gradient-to-r from-rose-400 via-red-500 to-orange-400 bg-clip-text text-transparent">TaskSync</span> is built with{' '}
          <span className="font-semibold text-white">Next.js 15</span>,{' '}
          <span className="font-semibold text-white">Neon Postgres</span>, and{' '}
          <span className="font-semibold text-white">Better Auth</span>.
        </h1>
        
        <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed">
          A real-time Kanban application leveraging drag-and-drop and optimistic UI updates for an enterprise-grade experience.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-10">
          <button
            onClick={handleCopyEmail}
            className="flex items-center justify-center min-w-[140px] gap-2 bg-white text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-zinc-200 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Contact
              </>
            )}
          </button>          <SocialLink href="https://github.com/David-bit986" ariaLabel="GitHub Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
          </SocialLink>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes wave {
            0%, 60%, 100% { transform: rotate(0deg); }
            10%, 30% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
          }
          .animate-wave {
            transform-origin: 70% 70%;
            display: inline-block;
            animation: wave 2.5s infinite;
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `
      }} />
    </main>
  );
};

export default function InfoPage() {
  return <HeroSection />;
}
