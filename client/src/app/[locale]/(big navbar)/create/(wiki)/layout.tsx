import BigNavbar from '@/components/navbar/bigNavbar';
import { Heading } from '@/components/ui/heading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className='flex min-h-screen flex-col items-center gap-8 p-24'>
        <Heading variant={'h1'}>Wiki Parse</Heading>
        {children}
      </main>
    </>
  );
}
