import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { ModelsStrip } from '@/components/marketing/ModelsStrip';
import { Quickstart } from '@/components/marketing/Quickstart';
import { WhySection } from '@/components/marketing/MarketingNav';
import { DocsTeaser } from '@/components/marketing/DocsTeaser';
import { Footer } from '@/components/marketing/Footer';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import type { ModelInfo } from '@/lib/types';

export const metadata: Metadata = {
  title: 'SeedofCode AI — LLM Inference API for Developers',
  description:
    'Plant a prompt. Watch it grow into code. An OpenAI-compatible LLM inference API ' +
    'with API keys, usage analytics, and pay-per-token pricing.',
  openGraph: {
    title: 'SeedofCode AI — LLM Inference API for Developers',
    description:
      'OpenAI-compatible LLM inference powered by Ollama. API keys, usage analytics, pay-per-token.',
    type: 'website',
  },
};

/**
 * ISR revalidation — rebuild the models strip every 5 minutes.
 * If the API is unreachable at build/revalidation time the static fallback
 * in ModelsStrip is used transparently.
 */
export const revalidate = 300;

async function fetchModels(): Promise<ModelInfo[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return [];

  try {
    const res = await fetch(`${apiBase}/models`, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Backend wraps in { success, data, ... }
    const models = json?.data ?? json;
    return Array.isArray(models) ? (models as ModelInfo[]) : [];
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const models = await fetchModels();

  return (
    <>
      <MarketingNav />
      <main id="main-content">
        <Hero />
        <ModelsStrip models={models} />
        <Quickstart />
        <WhySection />
        <DocsTeaser />
      </main>
      <Footer />
    </>
  );
}
