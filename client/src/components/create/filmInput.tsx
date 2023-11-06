import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Dispatch, SetStateAction } from 'react';
import { FilmWiki } from '@/types/film/filmWiki';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FilmType } from '@/types/film/film.type';
import { Textarea } from '../ui/textarea';

export interface HeadingProps extends React.HTMLProps<HTMLDivElement> {
  film: FilmWiki;
  setFilm: Dispatch<SetStateAction<FilmWiki | undefined>>;
}

const FilmInput = (props: HeadingProps) => {
  const { className, film, setFilm } = props;
  return (
    <>
      <Table className={cn(className)}>
        <TableBody>
          <TableRow>
            <TableCell className='w-28 font-medium'>Title</TableCell>
            <TableCell>
              <Input
                value={film?.title}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, title: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Type</TableCell>
            <TableCell>
              <Select
                value={film.type}
                onValueChange={(value: FilmType) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, type: value };
                  })
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select film type' />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='movie'>Movie</SelectItem>
                    <SelectItem value='anime'>Anime</SelectItem>
                    <SelectItem value='animated'>Animated</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Year</TableCell>
            <TableCell>
              <Input
                type='number'
                value={film?.year}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, year: Number(event.target.value) };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Country</TableCell>
            <TableCell>
              <Textarea
                rows={1}
                className='min-h-[42.5px]'
                value={film?.country}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, country: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Directed by</TableCell>
            <TableCell>
              <Textarea
                rows={1}
                className='min-h-[42.5px]'
                value={film?.directedBy}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, directedBy: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Starring</TableCell>
            <TableCell>
              <Textarea
                rows={2}
                className='min-h-[42.5px]'
                value={film?.starring}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, starring: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Language</TableCell>
            <TableCell>
              <Textarea
                rows={1}
                className='min-h-[42.5px]'
                value={film?.language}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, language: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Run time (min)</TableCell>
            <TableCell>
              <Input
                type='number'
                value={film?.runTime}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, runTime: Number(event.target.value) };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Box office</TableCell>
            <TableCell>
              <Input
                value={film?.boxOffice}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, boxOffice: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Budget</TableCell>
            <TableCell>
              <Input
                value={film?.budget}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, budget: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Genres</TableCell>
            <TableCell>
              <Textarea
                rows={2}
                className='min-h-[42.5px]'
                value={film?.genres}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, genres: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Tags</TableCell>
            <TableCell>
              <Textarea
                rows={2}
                className='min-h-[42.5px]'
                value={film?.tags}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, tags: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Description</TableCell>
            <TableCell>
              <Textarea
                rows={10}
                value={film?.description}
                onChange={(event) =>
                  setFilm((prev) => {
                    if (!prev) return prev;
                    return { ...prev, description: event.target.value };
                  })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default FilmInput;
