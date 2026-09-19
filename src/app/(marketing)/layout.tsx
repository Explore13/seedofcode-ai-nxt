/**
 * Marketing layout — public pages (/, /docs).
 * SSR/ISR-rendered, fully indexable.
 * Nav and footer are self-contained in each page component.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
