import type { NeedItem } from '@/content/site';

export function NeedsList({ items }: { items: NeedItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2 text-base leading-relaxed">
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
