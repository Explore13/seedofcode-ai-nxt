import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <div className="mx-auto flex max-w-5xl flex-col px-6 md:flex-row md:items-start md:gap-12 lg:gap-16">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-border py-8 md:sticky md:top-14 md:w-64 md:border-b-0 md:py-12">
          <DocsSidebar />
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 py-12 md:py-16">
          <article className="max-w-none text-base">
            {children}
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}
