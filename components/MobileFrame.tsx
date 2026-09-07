export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-brand-cream shadow-2xl">
      {children}
    </div>
  );
}
