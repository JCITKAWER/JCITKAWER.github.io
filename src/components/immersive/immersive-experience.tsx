'use client';

import { SmoothScroll } from './smooth-scroll';
import { Preloader } from './preloader';
import { CustomCursor } from './effects/blob-cursor';
import { ScrollProgress } from './effects/scroll-progress';
import { NoiseOverlay } from './effects/noise-overlay';
import { SceneIntro } from './scene-intro';
import { SceneStory } from './scene-story';
import { SceneGallery } from './scene-gallery';
import { SceneTickets } from './scene-tickets';
import { SceneCta } from './scene-cta';
import { SceneFooter } from './scene-footer';

export function ImmersiveExperience() {
  return (
    <>
      <Preloader />
      <SmoothScroll>
        <main className="relative">
          <CustomCursor />
          <ScrollProgress />
          <NoiseOverlay />
          <SceneIntro />
          <SceneStory />
          <SceneGallery />
          <SceneTickets />
          <SceneCta />
          <SceneFooter />
        </main>
      </SmoothScroll>
    </>
  );
}
