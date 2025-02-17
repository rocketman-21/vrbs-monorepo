import { Button } from "@cobuild/ui/atoms/Button";
import { IframeVideoPlayer } from "@cobuild/ui/molecules/IframeVideoPlayer/IframeVideoPlayer";
import { AspectRatioTypeEnum } from "@cobuild/libs/media/AspectRatio";

import Link from "next/link";
import { ReactNode } from "react";

export type IFaqType = "summary" | "auction" | "dao" | "voting" | "building" | "art-race";

export interface IFaqItem {
  question: string;
  answer?: ReactNode;
  embedUrl?: string;
  type: IFaqType;
  cta?: { url: string; text: string };
}

type Props = IFaqItem;

export const FaqItem = (props: Props) => {
  const { question, answer, cta, embedUrl } = props;

  return (
    <article key={question} className="rounded-xl bg-white p-4 lg:p-8">
      <h1 className="text-lead-800 mb-4 text-xl font-bold lg:mb-6 lg:text-3xl">{question}</h1>

      {answer && (
        <div className="prose prose-sm lg:prose-lg">
          <>{answer}</>
        </div>
      )}

      {embedUrl && (
        <IframeVideoPlayer embedUrl={embedUrl} aspectRatio={AspectRatioTypeEnum.Horizontal} />
      )}

      {cta && (
        <Link href={cta.url} className="mt-6 inline-block">
          <Button color="outline" size="md">
            {cta.text}
          </Button>
        </Link>
      )}
    </article>
  );
};
