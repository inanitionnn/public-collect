export default async function Collection({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <h1>Collection</h1>
      </div>
    </main>
  );
}
