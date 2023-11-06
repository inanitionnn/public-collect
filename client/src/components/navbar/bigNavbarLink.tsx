'use client';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heading } from '../ui/heading';

interface NavbarLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pathname: string;
  header: string;
}

const BigNavbarLink = forwardRef<HTMLButtonElement, NavbarLinkProps>(
  ({ children, pathname, header, ...props }, ref) => {
    const currentPathname = usePathname();
    return (
      <Link href={pathname} className='w-full'>
        <Button
          variant={'ghost'}
          size={'default'}
          className={cn({
            'bg-secondary': currentPathname === pathname,
            'w-full': true,
          })}
          ref={ref}
          {...props}
        >
          <div className='flex w-full items-center justify-start gap-2'>
            {children}
            <Heading variant={'h6'}>{header}</Heading>
          </div>
        </Button>
      </Link>
    );
  }
);

BigNavbarLink.displayName = 'BigNavbarLink';

export default BigNavbarLink;
