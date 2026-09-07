import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { MobileFrame } from '@/components/MobileFrame';

const drukWide = localFont({
  src: '../fonts/DrukWideCyrillic-Bold.otf',
  weight: '700',
  variable: '--font-druk',
});

const onest = localFont({
  src: [
    { path: '../fonts/onest/Onest-Thin.ttf', weight: '100', style: 'normal' },
    { path: '../fonts/onest/Onest-ExtraLight.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/onest/Onest-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/onest/Onest-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/onest/Onest-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/onest/Onest-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/onest/Onest-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/onest/Onest-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../fonts/onest/Onest-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-onest',
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
      <body className={`${drukWide.variable} ${onest.variable} font-body`}>
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
