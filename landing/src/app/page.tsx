import { AmbientOrbs } from '@/components/AmbientOrbs';
import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { DocsSection } from '@/components/sections/DocsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { IntroSection } from '@/components/sections/IntroSection';
import { TeamSection } from '@/components/sections/TeamSection';

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <AmbientOrbs />
      <Header />
      <main className="relative">
        <Hero />
        <IntroSection />
        <FeaturesSection />
        <DocsSection />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
