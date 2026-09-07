import { siteContent } from '@/content/site';
import { CopyField } from '@/components/CopyField';

export default function RequisitesPage() {
  const { requisitesPage } = siteContent;

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="rounded-3xl bg-white p-6 text-brand-blue">
        <h1 className="text-center font-heading text-2xl uppercase">
          {requisitesPage.heading}
        </h1>
        <p className="mt-2 text-center text-sm opacity-70">
          {requisitesPage.subheading}
        </p>
        <div className="mt-6 space-y-3">
          {requisitesPage.rows.map((row) => (
            <CopyField key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </main>
  );
}
