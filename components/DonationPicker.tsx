'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { formatTenge } from '@/lib/format';

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 21s-7.5-4.6-10.2-9.3C.3 8.9 1.4 5.4 4.6 4.3c2-.7 4.1 0 5.4 1.7C11.3 4.3 13.4 3.6 15.4 4.3c3.2 1.1 4.3 4.6 2.8 7.4C15.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function DonationPicker() {
  const { hero, pay } = siteContent;
  const [amount, setAmount] = useState<number>(hero.quickAmounts[0]);
  const [customValue, setCustomValue] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  function handlePreset(preset: number) {
    setAmount(preset);
    setCustomValue('');
    setShowCustom(false);
  }

  function handleCustomChange(value: string) {
    setCustomValue(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setAmount(Math.round(parsed));
    }
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-1.5">
        {hero.quickAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePreset(preset)}
            className={`rounded-full border-2 px-1 py-2.5 text-center text-xs font-semibold whitespace-nowrap ${
              amount === preset && !showCustom
                ? 'border-brand-orange bg-brand-orange text-white'
                : 'border-white text-white'
            }`}
          >
            {formatTenge(preset)}₸
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className={`rounded-full border-2 px-1 py-2.5 text-center text-xs leading-tight font-semibold ${
            showCustom
              ? 'border-brand-orange bg-brand-orange text-white'
              : 'border-white text-white'
          }`}
        >
          {pay.customAmountPlaceholder}
        </button>
      </div>

      {showCustom ? (
        <input
          type="number"
          min={100}
          inputMode="numeric"
          placeholder={pay.customAmountPlaceholder}
          value={customValue}
          onChange={(event) => handleCustomChange(event.target.value)}
          autoFocus
          className="mt-2 w-full rounded-full border-2 border-white bg-transparent px-4 py-3 text-center text-white placeholder-white/70"
        />
      ) : null}

      <Link
        href={`/pay?amount=${amount}`}
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-orange px-4 py-4 text-center font-body font-semibold text-base uppercase text-white"
      >
        <HeartIcon />
        {pay.headingPrefix} {pay.recipientName} · {formatTenge(amount)}₸
      </Link>
    </div>
  );
}
