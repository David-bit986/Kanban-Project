import Image from "next/image";
import AppNav from "@/components/ui/app-nav";

const DotIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill="currentColor"/>
  </svg>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-white flex flex-col">
      <AppNav />
      
      <section className="flex-1 w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Dark mode Azure Depths background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 100%, #170101ff 0%, #000000 60%)",
          }}
        />

        {/* Main Content Container */}
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex flex-col gap-6 items-center text-center animate-fade-in-up md:px-12">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-gray-300 backdrop-blur-sm cursor-default">
              <DotIcon />
              Welcome to the App
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-4">
              A modern, real-time <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-rose-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                Kanban Project Manager
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
              TaskSync helps you organize workflows with seamless drag-and-drop boards, optimistic UI updates. Effortlessly scale your tasks.
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="px-8 py-3.5 bg-white text-black hover:bg-zinc-200 rounded-[6px] font-medium text-[15px] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                Get Started
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Embedded Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
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
}
