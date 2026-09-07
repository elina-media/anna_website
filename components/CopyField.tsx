'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/clipboard';

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-brand-blue">
      <div>
        <div className="text-sm opacity-70">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full bg-brand-blue px-3 py-2 text-sm text-white"
        aria-label={`Скопировать ${label}`}
      >
        {copied ? 'Скопировано' : 'Копировать'}
      </button>
    </div>
  );
}
