'use client';
import { getImages } from '@/api/getImages';
import { getWikiParse } from '@/api/getWikiParse';
import FilmInput from '@/components/create/filmInput';
import FilmTable from '@/components/create/filmTable';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FilmWiki } from '@/types/film/filmWiki';
import { FilmWikiType } from '@/types/film/filmWiki.type';
import { MediaType } from '@/types/media/media.type';
import { WatchedType } from '@/types/progress/watched.type';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const rateNames = [
  'Terrible',
  'Very Bad',
  'Bad',
  'Below Average',
  'Average',
  'Above Average',
  'Good',
  'Very Good',
  'Excellent',
  'Masterpiece',
];

export default function Parse({
  params: { link, mediaType },
}: {
  params: { link: string; mediaType: MediaType };
}) {
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: ['wikiParse', mediaType, link],
    queryFn: () => getWikiParse(link, mediaType),
    retry: false,
  });

  const {
    data: imagesData,
    error: imagesError,
    isError: imagesIsError,
    isLoading: imagesIsLoading,
    refetch: imagesRefetch,
  } = useQuery({
    queryKey: ['images', mediaType, data?.media.title || ''],
    queryFn: () => getImages(data?.media.title || '', 20, mediaType),
    enabled: data?.media.title !== undefined,
    retry: false,
  });

  const [note, setNote] = useState('');
  const [watched, setWatched] = useState<WatchedType>('planned');
  const [finishedAt, setFinishedAt] = useState('');
  const [rate, setRate] = useState<number>(5);
  const [selectedImage, setSelectedImage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [film, setFilm] = useState<FilmWiki>();

  useEffect(() => {
    if (data) {
      switch (mediaType) {
        case 'film': {
          const dtoFilm = data.media as FilmWikiType;
          setFilm(new FilmWiki(dtoFilm));
          setSelectedImage(data.media.image || '');
          break;
        }
      }
    }
  }, [data, mediaType]);

  return (
    <>
      <Card className='w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>Cover select</CardTitle>
        </CardHeader>
        {imagesData ? (
          <CardContent className='grid grid-cols-6 items-center justify-items-center gap-4 p-4'>
            {[data?.media.image || '', ...imagesData.links].map((link) => (
              <AspectRatio key={link} ratio={2 / 3}>
                <Image
                  src={link}
                  alt='cover'
                  width={200}
                  height={300}
                  className={cn({
                    'h-full w-full rounded-md border border-border object-cover':
                      true,
                    'ring-4 ring-ring': selectedImage === link,
                  })}
                  onClick={() => setSelectedImage(link)}
                />
              </AspectRatio>
            ))}
          </CardContent>
        ) : null}
        <CardFooter className='flex  gap-4'></CardFooter>
      </Card>
      <Card className='w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>Viewing progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={watched}
            onValueChange={(value: WatchedType) => setWatched(value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='view progress' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='planned' className='focus:bg-purple-300'>
                  planned
                </SelectItem>
                <SelectItem value='viewing' className='focus:bg-green-300'>
                  viewing
                </SelectItem>
                <SelectItem value='reviewing' className='focus:bg-green-300'>
                  reviewing
                </SelectItem>
                <SelectItem value='completed' className='focus:bg-green-300'>
                  completed
                </SelectItem>
                <SelectItem value='paused' className='focus:bg-yellow-300'>
                  paused
                </SelectItem>
                <SelectItem value='abandoned' className='focus:bg-red-300'>
                  abandoned
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className='w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>Information edit</CardTitle>
        </CardHeader>
        {data ? (
          <>
            {isEdit ? (
              <CardContent>
                {film ? <FilmInput film={film} setFilm={setFilm} /> : null}
              </CardContent>
            ) : (
              <CardContent>
                {film ? <FilmTable film={film} /> : null}
              </CardContent>
            )}
            <CardFooter className='flex  gap-4'>
              <Button
                className='w-48'
                onClick={() => setIsEdit((prev) => !prev)}
              >
                {isEdit ? 'Back' : 'Edit'}
              </Button>
              {isEdit ? null : (
                <>
                  <Button>Gpt 3</Button>
                  <Button>Gpt 4</Button>
                </>
              )}
            </CardFooter>{' '}
          </>
        ) : null}
      </Card>

      {watched !== 'planned' ? (
        <Card className='w-full max-w-3xl'>
          <CardHeader>
            <CardTitle>Rate</CardTitle>
            {mediaType === 'serie' ? (
              <CardDescription>
                The total score is automatically recalculated when evaluating
                any season (as an average)
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className='flex items-center gap-8'>
            <div className='flex max-w-xs flex-col gap-1'>
              <div className='flex gap-3'>
                {Array(rate)
                  .fill(null)
                  .map((_, index) => (
                    <Star
                      key={index}
                      className='stroke-primary'
                      onClick={() => setRate(index + 1)}
                    />
                  ))}
                {Array(10 - rate)
                  .fill(null)
                  .map((_, index) => (
                    <Star
                      key={index}
                      className='stroke-accent'
                      onClick={() => setRate(rate + index + 1)}
                    />
                  ))}
              </div>
              <Slider
                value={[rate]}
                onValueChange={(val) => setRate(val[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <Heading variant={'h5'}>{rateNames[rate - 1]}</Heading>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ) : null}

      <Card className='w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder='Some note..'
          />
        </CardContent>
      </Card>

      {!(['planned', 'completed'] as WatchedType[]).includes(watched) ? (
        <Card className='w-full max-w-3xl'>
          <CardHeader>
            <CardTitle>Finished at</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={finishedAt}
              onChange={(event) => setFinishedAt(event.target.value)}
              placeholder='25 min / 135 page / 5 volume / 4 seson 6 serie '
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className='w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>View order</CardTitle>
        </CardHeader>
        {/* TODO */}
      </Card>

      <Card className='w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>Add to collections</CardTitle>
        </CardHeader>
        {/* TODO */}
      </Card>

      <div className='flex justify-center gap-4'>
        <Button className='w-48'>Create</Button>
      </div>

      {isError ? (
        <span>Error: {error.message}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : null}
    </>
  );
}
