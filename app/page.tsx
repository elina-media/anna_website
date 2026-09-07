import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { StoryCard } from '@/components/StoryCard';
import { NeedsList } from '@/components/NeedsList';
import { siteContent } from '@/content/site';

export default function HomePage() {
  const { about, fireNews, newShelter, fundsBreakdown } = siteContent;

  return (
    <main>
      <Hero />

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <h2 className="text-center font-heading text-2xl uppercase text-brand-blue">
          Обо мне
        </h2>
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={about.photo1}
            alt="Анна с чёрной собакой"
            width={430}
            height={430}
            className="h-auto w-full object-cover"
          />
        </div>
        <StoryCard {...about.card1} />
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={about.photo2}
            alt="Анна со щенком в ветклинике"
            width={430}
            height={430}
            className="h-auto w-full object-cover"
          />
        </div>
        <StoryCard {...about.card2} />
      </section>

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <video
          className="w-full rounded-3xl"
          controls
          playsInline
          src={fireNews.video}
        />
        <StoryCard {...fireNews.card1} />
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={fireNews.photo}
            alt="Анна на фоне сгоревшей стены"
            width={430}
            height={430}
            className="h-auto w-full object-cover"
          />
        </div>
        <StoryCard {...fireNews.card2} />
      </section>

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <h2 className="text-center font-heading text-2xl uppercase text-brand-blue">
          {newShelter.heading}
        </h2>
        <video
          className="w-full rounded-3xl"
          controls
          playsInline
          src={newShelter.video}
        />
        <StoryCard {...newShelter.card1} />
        <div className="rounded-3xl bg-white p-6 text-brand-blue">
          <h3 className="mb-3 font-heading text-xl uppercase leading-tight">
            {newShelter.needsHeading}
          </h3>
          <NeedsList items={newShelter.needs} />
          <p className="mt-4 font-semibold">{newShelter.needsGoalText}</p>
        </div>
        <StoryCard {...newShelter.card2} />
      </section>

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <h2 className="text-center font-heading text-2xl uppercase text-brand-blue">
          {fundsBreakdown.heading}
        </h2>
        <StoryCard {...fundsBreakdown.card} />
      </section>
    </main>
  );
}
