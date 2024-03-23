"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/queries";
import { timeFromNow } from "@/lib/utils";
import { useEffect, useState } from "react";
import { EmptyAlert } from "../alerts/EmptyAlert";
import RoadmapCard from "./roadmap-card";
import { Loader2 } from "lucide-react";

export const Search = () => {
  const [search, setSearch] = useState("");

  const {
    data: searchData,
    mutate: searchMutate,
    isPending: isSearchPending,
  } = useSearch(search);

  const onSearch = () => {
    searchMutate({ body: { query: search } });
  };

  useEffect(() => {
    onSearch();
  }, [search]);

  return (
    <>
      <div className="flex flex-row">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={onSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-10">
        {searchData?.data.map((roadmap: any) => (
          <RoadmapCard
            key={roadmap.id}
            title={roadmap.title}
            views="2 views"
            timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
            slug={roadmap.id}
          />
        ))}
      </div>
    </>
  );
};