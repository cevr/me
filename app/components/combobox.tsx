import { Check } from 'lucide-react';
import * as ReactAria from 'react-aria-components';

import { cn } from '~/lib/utils';

import type { InputProps } from './input';
import { Input } from './input';

export const ComboBox = <T extends object>({
  className,
  ...props
}: ReactAria.ComboBoxProps<T>) => {
  return (
    <ReactAria.ComboBox
      className={cn('group w-full', className)}
      {...props}
    />
  );
};

export const ComboBoxInput = (props: InputProps) => {
  return <Input {...props} />;
};

export const ComboBoxPopover = ({
  className,
  ...props
}: ReactAria.PopoverProps) => {
  return (
    <ReactAria.Popover
      className={cn(
        'min-w-[--trigger-width] max-w-[--trigger-width] overflow-auto rounded-md border border-neutral-200 bg-white p-1 shadow-md dark:border-neutral-700 dark:bg-neutral-800',
        className,
      )}
      {...props}
    />
  );
};

export const ComboBoxContent = <T extends object>({
  className,
  ...props
}: ReactAria.ListBoxProps<T>) => {
  return (
    <ReactAria.ListBox
      className={cn('outline-none', className)}
      {...props}
    />
  );
};

export interface ListBoxItemProps extends ReactAria.ListBoxItemProps {}

export const ComboBoxItem = ({
  className,
  children,
  ...props
}: ListBoxItemProps) => {
  return (
    <ReactAria.ListBoxItem
      className={cn(
        'group',
        'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-black outline-none transition-colors dark:text-white',
        // Focus
        'focus:bg-salmon-100 dark:focus:bg-salmon-700',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent',
        className,
      )}
      {...props}
    >
      <>
        <Check
          aria-hidden="true"
          strokeWidth="3"
          className="invisible size-4 group-selected:visible"
        />
        {children}
      </>
    </ReactAria.ListBoxItem>
  );
};

export const ComboBoxButton = ({
  className,
  ...props
}: ReactAria.ButtonProps) => {
  return (
    <ReactAria.Button
      className={cn(className)}
      {...props}
    />
  );
};
