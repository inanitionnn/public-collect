import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
        h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
        h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
        h5: 'scroll-m-20 text-lg font-medium tracking-tight',
        h6: 'scroll-m-20 text-base font-normal tracking-tight',
      },
    },
    defaultVariants: {
      variant: 'h6',
    },
  }
);

export interface HeadingProps
  extends React.HTMLProps<HTMLHeadingElement>,
    VariantProps<typeof headerVariants> {
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    switch (variant) {
      case 'h1': {
        return (
          <h1
            className={cn(headerVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        );
      }
      case 'h2': {
        return (
          <h2
            className={cn(headerVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        );
      }
      case 'h3': {
        return (
          <h3
            className={cn(headerVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        );
      }
      case 'h4': {
        return (
          <h4
            className={cn(headerVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        );
      }
      case 'h5': {
        return (
          <h5
            className={cn(headerVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        );
      }
      case 'h6': {
        return (
          <h6
            className={cn(headerVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        );
      }
    }
  }
);
Heading.displayName = 'heading';

export { Heading, headerVariants };
