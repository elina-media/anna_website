import type { StoryCardVariant } from '@/content/site';

const variantClasses: Record<StoryCardVariant, string> = {
  blue: 'bg-brand-blue text-white',
  orange: 'bg-brand-orange text-white',
  white: 'bg-white text-brand-blue',
};

export function StoryCard({
  variant,
  heading,
  paragraphs,
}: {
  variant: StoryCardVariant;
  heading?: string;
  paragraphs: string[];
}) {
  return (
    <div className={`rounded-3xl p-6 ${variantClasses[variant]}`}>
      {heading ? (
        <h3 className="mb-3 font-heading text-lg uppercase leading-tight">
          {heading}
        </h3>
      ) : null}
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="mb-3 whitespace-pre-line text-base leading-relaxed last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
