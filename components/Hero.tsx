import Image from 'next/image';
import { siteContent } from '@/content/site';
import { formatTenge } from '@/lib/format';
import { DonationPicker } from '@/components/DonationPicker';

export function Hero() {
  const { hero } = siteContent;
  const progressPercent = Math.min(
    100,
    Math.round((hero.raisedTenge / hero.goalTenge) * 100)
  );

  return (
    <section className="bg-brand-blue px-4 pb-8 pt-6 text-white">
      <div className="overflow-hidden rounded-3xl">
        <Image
          src={hero.photo}
          alt="Анна на фоне сгоревшего дома"
          width={430}
          height={430}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <h1 className="mt-6 font-heading text-3xl uppercase leading-tight text-brand-orange">
        {hero.kicker}
      </h1>
      <p className="font-heading text-3xl uppercase leading-tight text-white">
        {hero.headline}
      </p>
      <p className="mt-3 text-base leading-relaxed">{hero.subtext}</p>

      <div className="mt-6 rounded-3xl bg-white p-4 text-brand-blue">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm uppercase opacity-70">{hero.raisedLabel}</div>
            <div className="font-heading text-xl">
              {formatTenge(hero.raisedTenge)}₸
            </div>
          </div>
          <div className="text-sm opacity-70">{hero.date}</div>
        </div>
        <div className="mt-2 text-sm uppercase opacity-70">
          {hero.goalLabel} {formatTenge(hero.goalTenge)}₸
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-brand-cream">
          <div
            className="h-full rounded-full bg-brand-orange"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed">{hero.progressCaption}</p>
      </div>

      <DonationPicker />
    </section>
  );
}
