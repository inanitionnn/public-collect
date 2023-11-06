'use client';
import { getWikiSearch } from '@/api/getWikiSearch';
import Remember from '@/components/create/remember';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MediaType } from '@/types/media/media.type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Create({
  params: { title },
}: {
  params: { title: string };
}) {
  const [query, setQuery] = useState(decodeURIComponent(title));
  const [mediaType, setMediaType] = useState<MediaType>('film');
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: ['wikiSearch'],
    queryFn: () => getWikiSearch(query, mediaType, 6),
    enabled: false,
    retry: false,
  });
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Wiki Search</CardTitle>
          <CardDescription>
            Select a media type and start searching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={mediaType}
            onValueChange={(val) => setMediaType(val as MediaType)}
            className='flex items-center gap-4'
          >
            <div className='flex items-center gap-1'>
              <RadioGroupItem value='film' id='r1' />
              <Label htmlFor='r1' className='text-base'>
                Film
              </Label>
            </div>
            <div className='flex items-center gap-1'>
              <RadioGroupItem value='serie' id='r2' />
              <Label htmlFor='r2' className='text-base'>
                Serie
              </Label>
            </div>
            <div className='flex items-center gap-1'>
              <RadioGroupItem value='comic' id='r3' />
              <Label htmlFor='r3' className='text-base'>
                Comic
              </Label>
            </div>
            <div className='flex items-center gap-1'>
              <RadioGroupItem value='book' id='r4' />
              <Label htmlFor='r4' className='text-base'>
                Book
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className='flex flex-col items-start gap-8'>
          <div className='flex w-full items-center gap-2'>
            <p className='capitalize'>{mediaType}</p>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type='text'
              placeholder='title'
              className='w-96'
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  console.log('enter press here! ');
                  refetch();
                }
              }}
            />
          </div>

          <Button className='w-48' onClick={() => refetch()}>
            Search
          </Button>
        </CardFooter>
      </Card>

      {data ? (
        <>
          <div className='flex flex-wrap justify-center gap-8'>
            {data.map((media) => (
              <Card key={media.link} className='w-[400px]'>
                <div className='flex items-center'>
                  <CardHeader>
                    <CardTitle>{media.title}</CardTitle>
                    <CardDescription>{media.description}</CardDescription>
                  </CardHeader>
                  {media.image ? (
                    <AspectRatio ratio={2 / 3}>
                      <Image
                        src={media.image}
                        alt='cover'
                        className='h-26 m-4 rounded-md border border-border object-cover'
                        width={128}
                        height={192}
                      />
                    </AspectRatio>
                  ) : null}
                </div>
                <CardFooter className='flex justify-center gap-4'>
                  <Link
                    href={`/create/parse/${mediaType}/${media.link
                      .split('/')
                      .at(-1)}`}
                  >
                    <Button
                      className='w-36'
                      onClick={() => console.log(media.link)}
                    >
                      Create
                    </Button>
                  </Link>
                  <a
                    target='_blank'
                    href={media.link}
                    rel='noopener noreferrer'
                  >
                    <Button variant={'link'}>Link</Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>Not ready ...</span>
      )}
    </>
  );
}
