/** Auth pages have no sidebar or header chrome — clean centered layout. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4">
      {children}
    </div>
  );
}
