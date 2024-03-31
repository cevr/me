import { cva } from "cva";
import type { VariantProps } from "cva";
import * as ReactAria from "react-aria-components";

import { cn } from "~/lib/utils";

export const buttonVariants = cva({
  base: [
    "inline-flex items-center justify-center rounded-md font-semibold outline-none transition-colors",
    // Focus
    "focus:ring-2 focus:ring-salmon-400 focus:ring-offset-2 dark:focus:ring-salmon-400 dark:focus:ring-offset-salmon-900",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  variants: {
    variant: {
      solid:
        "bg-neutral-900 text-white open:bg-neutral-100 hover:bg-neutral-700 dark:bg-neutral-50 dark:text-neutral-900 dark:open:bg-neutral-800 dark:hover:bg-neutral-200",
      destructive: "bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700",
      outline:
        "border border-neutral-200 bg-transparent hover:bg-neutral-100 focus:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
      subtle:
        "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
      ghost:
        "bg-transparent open:bg-transparent hover:bg-neutral-100 focus:bg-neutral-100 dark:text-neutral-100 dark:open:bg-transparent dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus:bg-neutral-800 dark:focus:text-neutral-100",
      link: "bg-transparent text-neutral-900 underline-offset-4 hover:bg-transparent hover:underline focus:bg-transparent focus:underline dark:bg-transparent dark:text-neutral-100 dark:hover:bg-transparent dark:focus:bg-transparent",
    },
    size: {
      lg: "h-12 px-6 text-lg",
      md: "h-10 px-4 text-base",
      sm: "h-8 px-3 text-sm",
      xs: "h-6 px-2 text-xs",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

export interface ButtonProps extends ReactAria.ButtonProps, VariantProps<typeof buttonVariants> {
  className?: string;
}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <ReactAria.Button
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
};
