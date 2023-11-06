import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/queryProvider';
import { ThemeProvider } from '@/providers/themeProvider';

const font = Roboto({
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <QueryProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='bg-background text-foreground'>{children}</div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}