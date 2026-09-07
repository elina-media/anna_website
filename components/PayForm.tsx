'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { formatTenge } from '@/lib/format';
import { createKaspiPayLink } from '@/lib/payment';

export function PayForm({ initialAmount }: { initialAmount: number }) {
  const [amount, setAmount] = useState(initialAmount);
  const [customValue, setCustomValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function handlePreset(preset: number) {
    setAmount(preset);
    setCustomValue('');
    setNotice(null);
  }

  function handleCustomChange(value: string) {
    setCustomValue(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setAmount(Math.round(parsed));
      setNotice(null);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setNotice(null);
    try {
      const url = await createKaspiPayLink(amount);
      if (url) {
        window.location.href = url;
        return;
      }
      setNotice(
        'Оплата через Kaspi пока настраивается. Переведите, пожалуйста, по реквизитам ниже.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase opacity-70">
        Сумма пожертвования
      </p>
      <div className="grid grid-cols-2 gap-3">
        {siteContent.pay.presetAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePreset(preset)}
            className={`rounded-2xl border-2 px-3 py-4 text-center font-semibold ${
              amount === preset && customValue === ''
                ? 'border-brand-orange bg-brand-orange text-white'
                : 'border-brand-blue/20 text-brand-blue'
            }`}
          >
            {formatTenge(preset)}₸
          </button>
        ))}
      </div>
      <input
        type="number"
        min={100}
        inputMode="numeric"
        placeholder="Другая сумма"
        value={customValue}
        onChange={(event) => handleCustomChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border-2 border-brand-blue/20 px-4 py-3 text-brand-blue"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || amount <= 0}
        className="mt-4 w-full rounded-full bg-brand-orange px-4 py-4 text-center font-heading text-lg uppercase text-white disabled:opacity-60"
      >
        Помочь на {formatTenge(amount)}₸
      </button>
      {notice ? (
        <p className="mt-3 text-sm leading-relaxed text-brand-blue">{notice}</p>
      ) : null}
      <Link
        href="/requisites"
        className="mt-3 block text-center text-sm font-semibold text-brand-blue underline"
      >
        {siteContent.pay.noKaspiText}
      </Link>
    </div>
  );
}
