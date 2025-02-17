"use client";

import { getArtRequirements } from "@cobuild/libs/revolution/artRequirements";
import { convertIpfsToHttp } from "@cobuild/libs/web3/utils";
import { Button } from "@cobuild/ui/atoms/Button";
import Markdown from "@cobuild/ui/atoms/Markdown";
import { Icon } from "@cobuild/ui/atoms/types";
import SvgRequirements from "@cobuild/ui/pixel-icons/CheckDouble";
import SvgDownload from "@cobuild/ui/pixel-icons/Download";
import { useRevolution } from "app/libs/useRevolution";
import Image from "next/image";
import { usePostCreation } from "./PostCreationProvider";

export type Guideline = {
  name: string;
  description: string;
  icon: Icon;
};

export const Guidelines = () => {
  const { config } = useRevolution();
  const { cultureIndex } = usePostCreation();

  const { name, description, template } = cultureIndex;

  const requirements = getArtRequirements(cultureIndex);

  return (
    <aside>
      <section>
        <h1 className="flex items-center text-balance font-medium text-zinc-900 dark:text-white">
          {config.logoUrl && (
            <Image
              src={config.logoUrl}
              width={64}
              height={64}
              alt={config.name}
              className="mr-2.5 size-8"
            />
          )}
          {name}
        </h1>
        <div className="mt-2.5 text-balance text-sm text-zinc-500 dark:text-zinc-400">
          <Markdown>{description}</Markdown>
        </div>
      </section>

      {requirements && (
        <section className="mt-8">
          <h1 className="flex items-center text-balance font-medium text-zinc-900 dark:text-white">
            <div className="bg-lead-300 mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-full p-2">
              <SvgRequirements className="h-full w-full text-black" aria-hidden="true" />
            </div>
            Requirements
          </h1>
          <div className="mt-2.5 whitespace-pre-line text-sm text-zinc-500 dark:text-zinc-400">
            <Markdown
              options={{
                overrides: {
                  ul: { props: { className: "list-disc list-inside space-y-0.5" } },
                },
              }}
            >
              {requirements}
            </Markdown>
          </div>
        </section>
      )}

      {template && (
        <section className="mt-4">
          <a href={convertIpfsToHttp(cultureIndex.template)} target="_blank">
            <Button size="sm" color="outline">
              Download Template <SvgDownload className="ml-1.5 size-3" />
            </Button>
          </a>
        </section>
      )}

      {cultureIndex.requiresSvg && (
        <div className="mt-6 text-sm text-yellow-500">
          Please{" "}
          <a
            className="underline"
            href="https://docs.google.com/document/u/2/d/1tdBHyPhUiVNToPy3JRSGITbru2bNLaM1QDmSGNmzGCU/edit?usp=sharing"
            target="_blank"
          >
            compress your SVG!
          </a>{" "}
        </div>
      )}
    </aside>
  );
};
