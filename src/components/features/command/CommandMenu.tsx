"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCommandMenu } from "@/context/CommandMenuContext";
import { mockCommunities } from "@/libs/mock-data";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Home, MessageSquarePlus, Moon, Settings, Sun, Users } from "lucide-react";

export default function CommandMenu() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useCommandMenu();
  const { setTheme } = useTheme();

  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  return (
    <CommandDialog open={ isOpen } onOpenChange={ setIsOpen }>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="General">
          <CommandItem onSelect={ () => runCommand(() => router.push("/")) }>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={ () => runCommand(() => router.push("/submit")) }>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>Create Post</span>
          </CommandItem>
          <CommandItem onSelect={ () => runCommand(() => router.push("/settings")) }>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Theme">
          <CommandItem onSelect={ () => runCommand(() => setTheme("light")) }>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={ () => runCommand(() => setTheme("dark")) }>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Mode</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Communities">
          { mockCommunities.map(community => (
            <CommandItem
              key={ community.id }
              onSelect={ () => runCommand(() => router.push(`/c/${community.slug}`)) }
            >
              <Users className="mr-2 h-4 w-4" />
              <span>c/{ community.slug }</span>
            </CommandItem>
          )) }
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
