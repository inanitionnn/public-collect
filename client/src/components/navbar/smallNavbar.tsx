import { LanguageToggle } from './languageToggle';
import { ThemeToggle } from './themeToggle';
import SmallNavbarLink from './smallNavbarLink';
import {
  BarChart2,
  Dices,
  Folders,
  LayoutGrid,
  PlusCircle,
  Search,
} from 'lucide-react';

const SmallNavbar = () => {
  return (
    <div className='fixed left-0 top-0 z-30 flex h-full min-h-screen w-16 flex-col items-center justify-between border-r border-border px-2 py-4'>
      <div></div>
      <div className='flex flex-col items-center gap-4'>
        <SmallNavbarLink pathname='/'>
          <LayoutGrid className='h-6 w-6 stroke-[1.5px]' />
        </SmallNavbarLink>
        <SmallNavbarLink pathname='/collections'>
          <Folders className='h-6 w-6 stroke-[1.5px]' />
        </SmallNavbarLink>
        <SmallNavbarLink pathname='/search'>
          <Search className='h-6 w-6 stroke-[1.5px]' />
        </SmallNavbarLink>
        <SmallNavbarLink pathname='/create'>
          <PlusCircle className='h-6 w-6 stroke-[1.5px]' />
        </SmallNavbarLink>
        <SmallNavbarLink pathname='/random'>
          <Dices className='h-6 w-6 stroke-[1.5px]' />
        </SmallNavbarLink>
        <SmallNavbarLink pathname='/stats'>
          <BarChart2 className='h-6 w-6 stroke-[1.5px]' />
        </SmallNavbarLink>
      </div>
      <div className='flex flex-col gap-2'>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SmallNavbar;
