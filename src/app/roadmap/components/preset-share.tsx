"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LZString from "lz-string";
import { useQueryClient } from "@tanstack/react-query";

export function PresetShare({ query }: { query: string }) {
  const queryClient = useQueryClient();
  const getURL = () => {
    const mutationCache = queryClient.getMutationCache();

    const data = mutationCache.find({ mutationKey: ["Roadmap", query] }) as any;
    if (data?.data?.tree) {
      const string = JSON.stringify(data?.data?.tree || "{}");
      const compressed = LZString.compressToEncodedURIComponent(string);
      return compressed;
    } else return "";
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share roadmap</h3>
          <p className="text-sm text-muted-foreground">
            Anyone who has this link can view your roadmap.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={"http://localhost:3000?code=" + getURL()}
              readOnly
              className="h-9"
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}