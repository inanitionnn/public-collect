import { FilmWiki } from '@/types/film/filmWiki';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLProps<HTMLDivElement> {
  film: FilmWiki;
}

const FilmTable = (props: HeadingProps) => {
  const { className, film } = props;
  return (
    <>
      <Table className={cn(className)}>
        <TableBody>
          <TableRow>
            <TableCell className='font-medium'>Title</TableCell>
            <TableCell>{film?.title}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Type</TableCell>
            <TableCell>{film?.type}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Year</TableCell>
            <TableCell>{film?.year}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Country</TableCell>
            <TableCell>{film?.country}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Directed by</TableCell>
            <TableCell>{film?.directedBy}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Starring</TableCell>
            <TableCell>{film?.starring}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Language</TableCell>
            <TableCell>{film?.language}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Run time</TableCell>
            <TableCell>{film?.runTime} minutes</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Box office</TableCell>
            <TableCell>{film?.boxOffice}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Budget</TableCell>
            <TableCell>{film?.budget}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Genres</TableCell>
            <TableCell>{film?.genres}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Tags</TableCell>
            <TableCell>{film?.tags}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Description</TableCell>
            <TableCell>
              <span className='line-clamp-6'>{film?.description}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default FilmTable;
