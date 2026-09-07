import Link from 'next/link';
import { siteContent } from '@/content/site';
import { CopyField } from '@/components/CopyField';

export function ContactsSection() {
  const { contacts } = siteContent;

  return (
    <section className="space-y-6 bg-brand-blue px-4 py-10 text-white">
      <h2 className="text-center font-heading text-2xl uppercase">
        {contacts.heading}
      </h2>

      <div className="space-y-4 rounded-3xl bg-white p-6 text-brand-blue">
        <div className="text-center">
          <div className="text-sm opacity-70">{contacts.responsibleLabel}</div>
          <div className="font-heading text-2xl">{contacts.responsibleName}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={contacts.whatsapp.href}
            className="rounded-2xl bg-brand-blue px-3 py-4 text-center text-white"
          >
            <div className="font-semibold">{contacts.whatsapp.label}</div>
            <div className="text-sm opacity-90">{contacts.whatsapp.value}</div>
          </a>
          <a
            href={contacts.instagram.href}
            className="rounded-2xl bg-brand-blue px-3 py-4 text-center text-white"
          >
            <div className="font-semibold">{contacts.instagram.label}</div>
            <div className="text-sm opacity-90">{contacts.instagram.value}</div>
          </a>
        </div>
        <p className="text-center text-sm font-semibold uppercase leading-relaxed">
          {contacts.antiFraudNote}
        </p>
      </div>

      <div className="rounded-3xl bg-brand-orange p-6 text-center font-heading uppercase leading-relaxed">
        {contacts.trustNote}
      </div>

      <div className="space-y-3">
        {contacts.requisites.map((row) => (
          <CopyField key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      <Link
        href="/pay"
        className="block rounded-full bg-brand-orange px-4 py-4 text-center font-heading text-lg uppercase"
      >
        {contacts.finalCtaLabel}
      </Link>
    </section>
  );
}
