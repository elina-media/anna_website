'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteContent } from '@/content/site';

export function StickyDonateButton() {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setPastThreshold(window.scrollY > 400);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById('contacts');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  const isPayPage = pathname?.startsWith('/pay') ?? false;
  const visible = pastThreshold && !nearFooter && !isPayPage;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 px-4 transition-all duration-300 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <Link
        href="/pay"
        className="block rounded-full bg-brand-orange px-4 py-4 text-center font-body font-semibold uppercase text-white shadow-xl"
      >
        {siteContent.pay.headingPrefix} {siteContent.pay.recipientName}
      </Link>
    </div>
  );
}
