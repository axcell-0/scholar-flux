import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { HeroSection } from "@/components/landing/HeroSection";

export default function HomePage() {
  return (
    <>
    <div className="flex justify-center items-center">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40 md:opacity-100">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-surface-container rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center gap-16 md:gap-24">
        <div className="flex-1 space-y-8 max-w-md">
          <HeroSection />
          <FeatureHighlights />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <AuthCard />
        </Suspense>
      </main>

      <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none opacity-50 z-[-1]">
        <svg
          fill="none"
          height="200"
          viewBox="0 0 1440 200"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120C120 100 240 80 480 120C720 160 960 180 1200 140C1320 120 1440 100 1440 100V200H0V120Z"
            fill="#eff4ff"
          />
        </svg>
      </div>
      </div>
    </>
  );
}