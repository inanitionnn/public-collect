'use client';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pathname: string;
}

const SmallNavbarLink = forwardRef<HTMLButtonElement, NavbarLinkProps>(
  ({ className, children, pathname, ...props }, ref) => {
    const currentPathname = usePathname();
    return (
      <Link href={pathname}>
        <Button
          variant={'ghost'}
          size={'icon'}
          className={cn({ 'bg-secondary': currentPathname === pathname })}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </Link>
    );
  }
);

SmallNavbarLink.displayName = 'SmallNavbarLink';

export default SmallNavbarLink;
