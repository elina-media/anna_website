import type { Metadata } from 'next';
import { Oswald, Nunito } from 'next/font/google';
import './globals.css';
import { MobileFrame } from '@/components/MobileFrame';

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700'],
  variable: '--font-oswald',
});

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Анна — сбор на восстановление приюта для животных',
  description:
    'Благотворительный сбор на восстановление дома и приюта для животных после пожара.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${oswald.variable} ${nunito.variable} font-body`}>
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
