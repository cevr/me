import { useState } from 'react';
import { useNavigate } from 'react-router';



import { Button } from '~/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import hymnsData from '~/routes/hymns/hymns.json';





type Hymn = {
  title: string;
  number: string;
  reference: string;
  lines: Array<Array<{ lyric: string; chord: string }>>;
};

interface HymnComboboxProps {
  selectedHymnNumber?: string;
  className?: string;
}

export function HymnCombobox({
  selectedHymnNumber,
  className,
}: HymnComboboxProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSelect = (hymnNumber: string) => {
    setOpen(false);
    void navigate(`/hymns/${hymnNumber}`);
  };

  const selectedHymn = selectedHymnNumber
    ? (hymnsData as Hymn[]).find((hymn) => hymn.number === selectedHymnNumber)
    : null;

  return (
    <div className={className}>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-mono border-b"
          >
            <span className="truncate">
              {selectedHymn
                ? `${selectedHymn.number}. ${selectedHymn.title}`
                : 'Search hymns...'}
            </span>
            <svg
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput
              placeholder="Search hymns..."
              className="font-mono"
            />
            <CommandList>
              <CommandEmpty>No hymn found.</CommandEmpty>
              <CommandGroup>
                {(hymnsData as Hymn[]).map((hymn) => (
                  <CommandItem
                    key={hymn.number}
                    value={`${hymn.number} ${hymn.title}`}
                    onSelect={() => handleSelect(hymn.number)}
                    className="font-mono"
                  >
                    <span className="shrink-0 font-mono">{hymn.number}.</span>
                    <span className="ml-2 truncate">{hymn.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}