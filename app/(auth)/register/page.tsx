import React from "react";
import { SignupForm } from "@/components/ui/signup-form"
import AppNav from "@/components/ui/app-nav";

export default function Page() {
    return (
        <main className="min-h-screen bg-[#000000] text-white flex flex-col relative overflow-hidden font-sans">
            {/* Dark mode burgundy radial background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(125% 125% at 50% 100%, #170101ff 0%, #000000 60%)",
                }}
            />

            {/* Nav with higher z-index positioned at top */}
            <div className="absolute top-0 left-0 w-full z-50">
                <AppNav />
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-10 pt-20 md:pt-20 animate-fade-in-up">
                <div className="w-full max-w-sm">
                    <SignupForm />
                </div>
            </div>

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
    )
}
