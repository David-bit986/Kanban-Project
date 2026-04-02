'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import AppNav from "@/components/ui/app-nav";
interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  pricePeriod: string | null;
  description: string;
  features: PricingFeature[];
  rdirect: string;
  buttonText: string;
  isPopular: boolean;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-rose-500 mr-2.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const TimesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-zinc-700 mr-2.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    pricePeriod: '',
    description: 'Perfect for individuals starting out with personal Kanban boards.',
    features: [
      { text: 'Up to 3 boards', included: true },
      { text: 'Team collaboration', included: false },
    ],
    rdirect: '/register',
    buttonText: 'Get Started',
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$1',
    pricePeriod: '/lifetime',
    description: 'For growing teams that need real-time power and premium features.',
    features: [
      { text: 'Unlimited boards', included: true },
      { text: 'Team collaboration', included: true },
    ],
    rdirect: '/registerPro',
    buttonText: 'Start Free Trial',
    isPopular: true,
  },
];

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const router = useRouter();
  const cardClasses = `
    pricing-card bg-[#0a0a0a] backdrop-blur-xl relative
    border rounded-[16px] p-6 lg:p-7 flex flex-col transition-all duration-500
    hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-900/20 z-10 overflow-hidden
    ${plan.isPopular
      ? 'border border-rose-500/50 shadow-md shadow-rose-900/10'
      : 'border-white/10 hover:border-white/20 shadow-md shadow-black/50'
    }
  `;

  const buttonClasses = `
    cursor-pointer w-full py-2.5 px-5 rounded-full font-medium text-[14px] mt-auto transition-all duration-300 shadow-sm flex items-center justify-center
    ${plan.isPopular
      ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.03] active:scale-95'
      : 'bg-white/10 text-white hover:bg-white/20 border border-white/5 hover:scale-[1.03] active:scale-95'
    }
  `;

  return (

    <div className={cardClasses}>
      {plan.isPopular && (
        <div className="absolute top-0 right-5 bg-rose-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-b-sm shadow-md">
          Most Popular
        </div>
      )}

      {plan.isPopular && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-orange-400" />}

      <h3 className="text-lg font-bold text-white mb-3">{plan.name}</h3>
      <p className="text-white text-4xl font-bold mb-1 tracking-tight">
        {plan.price}
        {plan.pricePeriod && (
          <span className="text-[15px] text-zinc-500 font-medium ml-1 tracking-normal">{plan.pricePeriod}</span>
        )}
      </p>
      <p className="text-zinc-400 mb-6 text-[13px] h-10 leading-relaxed max-w-[95%]">{plan.description}</p>

      <div className="w-full h-[1px] bg-white/10 mb-6"></div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature: PricingFeature, index: number) => (
          <li
            key={index}
            className={`flex items-center text-[13.5px] ${feature.included ? 'text-zinc-200' : 'text-zinc-600'
              }`}
          >
            {feature.included ? <CheckIcon /> : <TimesIcon />}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push(plan.rdirect)} className={buttonClasses}>
        {plan.buttonText}
      </button>
    </div>
  );
};

export default function PricingSection() {
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

      <div className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-8 max-w-4xl mx-auto flex-1 w-full mt-[-3rem] animate-fade-in-up">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
            Simple, Transparent <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-rose-400 via-red-500 to-orange-400 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-[15px] md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Choose the perfect plan for your project. No hidden fees. <br className="hidden sm:block" /> Start building for free and scale smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full max-w-3xl mx-auto">
          {pricingPlans.map((plan: PricingPlan, index: number) => (
            <PricingCard key={index} plan={plan} />
          ))}
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
  );
}