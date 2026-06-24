"use client";

import { useRef } from "react";
import { ScrollFrameSequence } from "@/components/media/ScrollFrameSequence";
import { FLOW_FRAMES } from "@/lib/content";

/**
 * Standalone, full-width cinematic reveal. The frames2 sequence plays on its
 * own as a pinned, scroll-scrubbed full-bleed section — no overlaid content.
 * A long scroll track makes the animation play over a generous scroll distance.
 */
export function RevealSequence() {
  const trackRef = useRef<HTMLElement>(null);

  // Mobile: one-screen auto-playing reveal. Desktop (md+): tall sticky track.
  return (
    <section
      ref={trackRef}
      aria-hidden="true"
      className="relative h-[100svh] w-full md:h-[800vh]"
    >
      <div className="relative h-[100svh] w-full overflow-hidden md:sticky md:top-0 md:h-screen">
        <ScrollFrameSequence
          framesPath={FLOW_FRAMES.path}
          frameCount={FLOW_FRAMES.count}
          poster={FLOW_FRAMES.poster}
          pad={FLOW_FRAMES.pad}
          ext={FLOW_FRAMES.ext}
          trackRef={trackRef}
          mode="track"
          className="absolute inset-0"
        />
        {/* subtle cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_55%,rgba(5,6,15,0.55)_100%)]" />
        {/* blend into the sections above/below */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>
    </section>
  );
}
