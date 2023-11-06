'use client';

import { useChangeLocale, useCurrentLocale } from '@/locales/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Heading } from '../ui/heading';
export function LanguageToggle() {
  // Uncomment to preserve the search params. Don't forget to also uncomment the Suspense in the layout
  const changeLocale = useChangeLocale(/* { preserveSearchParams: true } */);
  const currentLocale = useCurrentLocale();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Heading variant={'h6'}>
              {currentLocale === 'en' ? 'En' : 'Uk'}
            </Heading>
            <span className='sr-only'>Toggle locale</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => changeLocale('en')}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLocale('uk')}>
            Українська
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
