import { Background } from "@/components/layout/Background";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Transformation } from "@/components/sections/Transformation";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { ExampleFlow } from "@/components/sections/ExampleFlow";
import { RevealSequence } from "@/components/sections/RevealSequence";
import { WhyGeniriFlow } from "@/components/sections/WhyGeniriFlow";
import { FounderStory } from "@/components/sections/FounderStory";
import { Process } from "@/components/sections/Process";
import { AuditCTA } from "@/components/sections/AuditCTA";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="relative">
        {/* 1 */} <Hero />
        {/* 2 */} <Problem />
        {/* 3 */} <Transformation />
        {/* 4 */} <WhatWeBuild />
        {/* 5 */} <ExampleFlow />
        {/* — */} <RevealSequence />
        {/* 6 */} <WhyGeniriFlow />
        {/* — */} <FounderStory />
        {/* 7 */} <Process />
        {/* 8 */} <AuditCTA />
        {/* 9 */} <Contact />
      </main>
      {/* 10 */}
      <Footer />
    </>
  );
}
