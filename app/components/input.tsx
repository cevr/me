import { cva } from "cva";
import type { VariantProps } from "cva";
import * as ReactAria from "react-aria-components";

import { cn } from "~/lib/utils";

const inputVariants = cva({
  base: [
    "flex w-full border border-neutral-300 bg-transparent placeholder:text-neutral-400",
    // Focus
    "focus:outline-none focus:ring-2 focus:ring-salmon-400 focus:ring-offset-2",
    // Dark
    "dark:border-neutral-700 dark:text-neutral-50 dark:focus:ring-salmon-400 dark:focus:ring-offset-salmon-900",
    // Disabled
    "disabled:cursor-not-allowed disabled:opacity-40",
    // Invalid
    "invalid:border-red-600 dark:invalid:border-red-400",
  ],
  variants: {
    size: {
      lg: "h-12 rounded-lg px-4 text-lg",
      md: "h-10 rounded-md px-4 text-base",
      sm: "h-8 rounded px-3 text-sm",
      xs: "h-6 rounded px-2 text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type InputProps = Omit<ReactAria.InputProps, "size"> & VariantProps<typeof inputVariants>;

export const Input = ({ className, size, ...props }: InputProps) => {
  return (
    <ReactAria.Input
      className={cn(
        inputVariants({
          size,
          className,
        }),
      )}
      {...props}
    />
  );
};
