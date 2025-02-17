"use client";

import { getArtRequirements } from "@cobuild/libs/revolution/artRequirements";
import Markdown from "@cobuild/ui/atoms/Markdown";
import { useRevolution } from "app/libs/useRevolution";

export const Flagged = () => {
  const { cultureIndex } = useRevolution();

  return (
    <div className="rounded-2xl bg-red-100 p-5">
      <h3 className="text-balance text-lg font-semibold">{cultureIndex?.name || "Art Race"}</h3>
      <p className="mt-2.5 text-balance text-sm">
        This creation has been flagged for not meeting the requirements.
      </p>
      {cultureIndex && (
        <Markdown
          options={{
            overrides: {
              ul: { props: { className: "mt-4 list-disc list-inside space-y-0.5 text-sm" } },
            },
          }}
        >
          {getArtRequirements(cultureIndex)}
        </Markdown>
      )}
    </div>
  );
};
