import Link from 'next/link';
import { siteContent } from '@/content/site';
import { CopyField } from '@/components/CopyField';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 2c-5.523 0-10 4.477-10 10 0 1.77.464 3.489 1.346 5.005L2 22l5.13-1.345A9.96 9.96 0 0 0 12.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.166a8.14 8.14 0 0 1-4.15-1.135l-.298-.177-3.045.799.813-2.968-.194-.305a8.16 8.16 0 0 1-1.256-4.38c0-4.514 3.673-8.187 8.187-8.187 4.514 0 8.187 3.673 8.187 8.187 0 4.514-3.673 8.166-8.187 8.166z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ContactsSection() {
  const { contacts } = siteContent;

  return (
    <section
      id="contacts"
      className="space-y-6 bg-brand-blue px-4 py-10 text-white"
    >
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
            className="flex flex-col items-center gap-1 rounded-2xl bg-brand-blue px-3 py-4 text-center text-white"
          >
            <WhatsAppIcon />
            <div className="font-semibold">{contacts.whatsapp.label}</div>
            <div className="text-sm opacity-90">{contacts.whatsapp.value}</div>
          </a>
          <a
            href={contacts.instagram.href}
            className="flex flex-col items-center gap-1 rounded-2xl bg-brand-blue px-3 py-4 text-center text-white"
          >
            <InstagramIcon />
            <div className="font-semibold">{contacts.instagram.label}</div>
            <div className="text-xs break-all opacity-90">
              {contacts.instagram.value}
            </div>
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
        className="block rounded-full bg-brand-orange px-4 py-4 text-center font-body font-semibold text-base uppercase"
      >
        {contacts.finalCtaLabel}
      </Link>
    </section>
  );
}
