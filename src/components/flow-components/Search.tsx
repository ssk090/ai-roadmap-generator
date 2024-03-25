"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getPublicRoadmaps } from "@/actions/roadmaps";
import RoadmapCard from "./roadmap-card";
import { SearchAlert } from "../alerts/SearchAlert";
import { Input } from "../ui/input";
import { timeFromNow } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { EmptyAlert } from "../alerts/EmptyAlert";

const formSchema = z.object({
  query: z.string().min(1, { message: "Please enter a query to search" }),
});

const Search = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["public-roadmaps"],
    queryFn: async () => {
      const roadmaps = await getPublicRoadmaps();
      return roadmaps;
    },
  });

  const [filteredRoadmaps, setFilteredRoadmaps] = useState<typeof roadmaps>([]);

  useEffect(() => {
    if (roadmaps) {
      setFilteredRoadmaps(roadmaps);
    }
  }, [roadmaps]);

  console.log("roadmaps", filteredRoadmaps);

  if (!roadmaps && !filteredRoadmaps) {
    return <EmptyAlert description="No roadmaps found" />;
  }

  return (
    <div>
      <div className="flex gap-4 items-center justify-between">
        <Input
          className="input"
          type="text"
          placeholder="Start typing to search..."
          value={form.getValues().query}
          onChange={(e) => {
            form.setValue("query", e.target.value);
            setFilteredRoadmaps(
              roadmaps?.filter((roadmap) =>
                roadmap.title
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()),
              ),
            );
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-10">
        {" "}
        {isLoading ? (
          <div className="w-[80vw] h-[70vh] flex justify-center items-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : filteredRoadmaps!.length > 0 ? (
          filteredRoadmaps!.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              views="2 views"
              timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
              slug={roadmap.id}
            />
          ))
        ) : (
          <SearchAlert />
        )}
      </div>
    </div>
  );
};

export default Search;
