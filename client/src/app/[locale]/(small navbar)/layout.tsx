import SmallNavbar from '@/components/navbar/smallNavbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmallNavbar />
      <div className='ml-16'>{children}</div>
    </>
  );
}
