import Image from 'next/image';
import { siteContent } from '@/content/site';
import { PayForm } from '@/components/PayForm';

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const { amount } = await searchParams;
  const parsedAmount = Number(amount);
  const initialAmount =
    Number.isFinite(parsedAmount) && parsedAmount > 0
      ? Math.round(parsedAmount)
      : siteContent.pay.defaultAmount;

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="rounded-3xl bg-white p-6 text-brand-blue">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={siteContent.pay.recipientPhoto}
              alt={siteContent.pay.recipientName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-heading text-xl uppercase">
              {siteContent.pay.headingPrefix} {siteContent.pay.recipientName}
            </h1>
            <p className="text-sm leading-snug opacity-70">
              {siteContent.pay.description}
            </p>
          </div>
        </div>
        <hr className="my-4 border-brand-cream" />
        <PayForm initialAmount={initialAmount} />
      </div>
    </main>
  );
}
