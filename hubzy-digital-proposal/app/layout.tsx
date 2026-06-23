import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Hubzy Digital - Proposta Comercial',
  description: 'Proposta Comercial Personalizada para Centro Automotivo São Paulo',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} font-sans`}>
      <body suppressHydrationWarning className="bg-background text-on-surface antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
