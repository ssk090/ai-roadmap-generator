"use client";

import ExpandCollapse from "@/app/flow-components/expand-collapse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoaderCircle, Wand } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PresetActions } from "./components/preset-actions";
import { PresetShare } from "./components/preset-share";
import ModelSelect from "../flow-components/model-select";
import { useShallow } from "zustand/react/shallow";
import { useUIStore } from "../stores/useUI";
import LZString from "lz-string";
import { flushSync } from "react-dom";
import { Node } from "../shared/types/common";
import { useSearchParams } from "next/navigation";

import { toPng } from "html-to-image";
import {
  Panel,
  getRectOfNodes,
  getTransformForBounds,
  useReactFlow,
} from "reactflow";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 4096;
const imageHeight = 3048;

export default function Roadmap() {
  const [query, setQuery] = useState("");
  const [mainQuery, setMainQuery] = useState("");
  const { model } = useUIStore(
    useShallow((state) => ({
      model: state.model,
    }))
  );
  const { data, mutate, isPending, isError, isSuccess } = useMutation<
    any,
    AxiosError,
    { query: string }
  >({
    mutationFn: (variables) =>
      axios.post(`/api/v1/${model}/roadmap/`, { query: variables.query }),
    mutationKey: ["Roadmap", mainQuery],
  });

  const onSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      flushSync(() => {
        setMainQuery(query);
      });
      mutate({ query });
    } catch (e) {
      console.log(e);
    }
  };
  const params = useSearchParams();

  const decodeFromURL = (): Node[] => {
    let array = [];
    const code = params.get("code");
    if (code) {
      const uncompressed = LZString.decompressFromEncodedURIComponent(code);
      try {
        array = JSON.parse(uncompressed);
      } catch (e) {}
    }
    return array;
  };
  const { getNodes } = useReactFlow();

  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const [x, y, scale] = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      2,
      2
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#ffffff",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${x}px, ${y}px) scale(3)`,
      },
    }).then(downloadImage);
  };

  return (
    <>
      <div className="h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <Link
            className="hidden sm:inline text-lg font-semibold mr-4"
            href="/"
          >
            RoadmapAI
          </Link>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <Input
              type="text"
              placeholder="e.g. Try searching for Frontend or Backend"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="hidden sm:flex">
              <ModelSelect />
            </div>
            <Button onClick={onSubmit} disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  <span className="ml-2 hidden sm:inline">Generating</span>
                </>
              ) : (
                <>
                  <Wand size={20} />
                  <span className="ml-2 hidden sm:inline">Generate</span>
                </>
              )}
            </Button>
            <div className="hidden space-x-2 md:flex">
              {(decodeFromURL()?.[0]?.name || data?.data?.tree[0]?.name) && (
                <PresetShare
                  query={mainQuery}
                  key={
                    data?.data?.tree?.[0]?.name || decodeFromURL()?.[0]?.name
                  }
                />
              )}
              <Panel position="top-right">
                <button className="download-btn" onClick={onClick}>
                  Download Image
                </button>
              </Panel>
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
      </div>
      {/* <ExpandCollapse key={tempData[0].name} data={tempData} /> */}
      {/* {isSuccess && ( */}
      {(decodeFromURL()?.[0]?.name || data?.data?.tree?.[0]?.name) && (
        <ExpandCollapse
          key={data?.data?.tree[0]?.name || decodeFromURL()?.[0]?.name}
          data={data?.data?.tree || decodeFromURL()}
        />
      )}
      {/* )} */}
    </>
  );
}