import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRemember } from '@/api/getRemember';

export interface HeadingProps extends React.HTMLProps<HTMLDivElement> {
  setYear: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
}

const Remember = (props: HeadingProps) => {
  const { className, setTitle, setYear } = props;
  const [query, setQuery] = useState('');
  const { data, refetch } = useQuery({
    queryKey: ['remeber'],
    queryFn: () => getRemember(query),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    setTitle(data?.title || '');
    setYear(data?.year.toString() || '');
  }, [data, setTitle, setYear]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Remember title</CardTitle>
        <CardDescription>
          GPT chat guesses the media based on your description and returns its
          title
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Cartoon about green ogr and donkey'
          rows={4}
        />
      </CardContent>
      <CardFooter>
        <Button className='w-48' onClick={() => refetch()}>
          Get Title
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Remember;
