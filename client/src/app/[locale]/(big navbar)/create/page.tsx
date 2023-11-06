'use client';
import Remember from '@/components/create/remember';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

export default function Create({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  return (
    <main className='flex min-h-screen flex-col items-center gap-8 p-24'>
      <Heading variant={'h1'}>Create</Heading>

      <div className='flex max-w-3xl flex-col gap-8'>
        <Input
          value={title}
          onChange={(event) => {
            setYear('');
            setTitle(event.target.value);
          }}
          type='text'
          placeholder='Title'
        />
        <div className='grid auto-rows-fr gap-8 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Wiki Parse</CardTitle>
              <CardDescription>
                The parser automatically fills in the media fields based on the
                specified title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/create/search/${encodeURIComponent(
                  `${title} ${year}`
                )}`}
              >
                <Button className='w-full'>Create</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Create</CardTitle>
              <CardDescription>
                You fill in all the media fields yourself
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full'>Create</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search by title</CardTitle>
              <CardDescription>
                Allows you to check if you already have a similar movie in your
                collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full'>Search</Button>
            </CardContent>
          </Card>
        </div>

        <Remember setTitle={setTitle} setYear={setYear} className='w-full' />
      </div>
    </main>
  );
}
