import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GrowthAnalytics.ai - AI-Powered Customer Insights',
  description: 'Upload your customer data and get instant segmentation, personas, and churn predictions in seconds. Used by 500+ companies worldwide.',
  keywords: 'customer segmentation, ai analytics, churn prediction, customer personas, marketing analytics',
  authors: [{ name: 'GrowthAnalytics' }],
  openGraph: {
    title: 'GrowthAnalytics.ai - AI-Powered Customer Insights',
    description: 'Upload your customer data and get instant AI-powered insights',
    url: 'https://growthanalytics.ai',
    siteName: 'GrowthAnalytics.ai',
    images: [
      {
        url: 'https://growthanalytics.ai/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}