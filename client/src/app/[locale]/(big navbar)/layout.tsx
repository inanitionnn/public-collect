import BigNavbar from '@/components/navbar/bigNavbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BigNavbar />
      <div className='ml-40'>{children}</div>
    </>
  );
}
