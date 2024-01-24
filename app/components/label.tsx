import * as ReactAria from "react-aria-components";

import { cn } from "~/lib/utils";

export const Label = ({ className, ...props }: ReactAria.LabelProps) => {
  return (
    <ReactAria.Label
      className={cn(
        "mb-2 mr-3 block font-medium text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-40 dark:text-white",
        className,
      )}
      {...props}
    />
  );
};
