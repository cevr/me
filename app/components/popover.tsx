import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "~/lib/utils/cn";

const Popover = PopoverPrimitive.Root as typeof PopoverPrimitive.Root & {
  Trigger: typeof PopoverPrimitive.Trigger;
  Content: typeof PopoverContent;
  Anchor: typeof PopoverAnchor;
};

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 z-50 w-72 rounded-md border border-neutral-100  bg-[var(--bg)] p-4 shadow-md outline-none dark:border-neutral-800",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Anchor = PopoverAnchor;
export { Popover };
