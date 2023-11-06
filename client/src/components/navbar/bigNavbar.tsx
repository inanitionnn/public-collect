import { LanguageToggle } from './languageToggle';
import { ThemeToggle } from './themeToggle';
import BigNavbarLink from './bigNavbarLink';
import {
  BarChart2,
  Dices,
  Folders,
  LayoutGrid,
  PlusCircle,
  Search,
} from 'lucide-react';

const BigNavbar = () => {
  return (
    <div className='fixed left-0 top-0 z-30 flex h-full min-h-screen w-40 flex-col items-center justify-between border-r border-border px-2 py-4'>
      <div></div>
      <div className='flex flex-col items-center gap-4'>
        <BigNavbarLink header='Home' pathname='/'>
          <LayoutGrid className='h-6 w-6 stroke-[1.5px]' />
        </BigNavbarLink>
        <BigNavbarLink header='Collections' pathname='/collections'>
          <Folders className='h-6 w-6 stroke-[1.5px]' />
        </BigNavbarLink>
        <BigNavbarLink header='Search' pathname='/search'>
          <Search className='h-6 w-6 stroke-[1.5px]' />
        </BigNavbarLink>
        <BigNavbarLink header='Random' pathname='/random'>
          <Dices className='h-6 w-6 stroke-[1.5px]' />
        </BigNavbarLink>
        <BigNavbarLink header='Create' pathname='/create'>
          <PlusCircle className='h-6 w-6 stroke-[1.5px]' />
        </BigNavbarLink>
        <BigNavbarLink header='Stats' pathname='/stats'>
          <BarChart2 className='h-6 w-6 stroke-[1.5px]' />
        </BigNavbarLink>
      </div>
      <div className='flex gap-2'>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default BigNavbar;
