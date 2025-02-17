"use client";

import HorizontalScroll from "@cobuild/ui/atoms/HorizontalScroll/HorizontalScroll";
import { IRevolution, Serialized } from "@cobuild/database/types";
import classNames from "classnames";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FaqItem, IFaqItem, IFaqType } from "./FaqItem";
import { revolutionFaq } from "./custom-faqs/revolution-faq";
import atx from "./atx_grid.png";

interface Props {
  revolutionId: string;
  revolution: Serialized<IRevolution>;
  className?: string;
}

export const Faq = (props: Props) => {
  const { revolutionId, className = "", revolution } = props;

  const faq = revolutionFaq(revolution);

  const { config } = revolution;

  const { faqBackgroundPattern } = config;

  // Grouping FAQ items by type
  const groupedFaqItems = useMemo(
    () =>
      faq.reduce(
        (acc, item) => {
          const type = item.type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(item);
          return acc;
        },
        {} as Record<IFaqType, IFaqItem[]>,
      ),
    [faq],
  );

  const [activeSection, setActiveSection] = useState<IFaqType>("summary");

  return (
    <section className={`bg-secondary-200 relative overflow-hidden ${className}`}>
      {faqBackgroundPattern && (
        <Image
          width="288"
          height="400"
          className="pointer-events-none absolute inset-0 inset-x-0 w-full select-none object-cover"
          src={faqBackgroundPattern}
          alt=" "
        />
      )}
      {revolutionId === "atxdao" && (
        <Image
          width="2000"
          height="4000"
          className="pointer-events-none absolute inset-0 inset-x-0 -top-96 left-12 w-full -rotate-[30deg] transform select-none bg-repeat-y object-cover"
          src={atx}
          alt=" "
        />
      )}
      <section className="relative mx-auto max-w-screen-2xl px-4 lg:px-6">
        <HorizontalScroll className="mb-4 mt-8 flex flex-grow flex-row justify-start space-x-2 md:space-x-4 lg:mt-20">
          {Object.keys(groupedFaqItems).map(type => (
            <button
              key={type}
              className={classNames(
                "text-nowrap rounded-lg px-5 py-4 text-sm capitalize md:px-10 md:py-4 md:text-xl",
                {
                  "bg-lead-400 font-bold text-black": activeSection === type,
                  "bg-lead-200 font-semibold text-black": activeSection !== type,
                },
              )}
              onClick={() => setActiveSection(type as IFaqType)}
              type="button"
            >
              <span className="whitespace-nowrap">
                {renderFaqTypeLabel(
                  type as IFaqType,
                  revolution.name,
                  revolution.cultureIndex?.name,
                )}
              </span>
            </button>
          ))}
        </HorizontalScroll>
        <section className="py-4 md:columns-2 md:gap-x-12">
          {groupedFaqItems[activeSection]?.map((item: IFaqItem) => (
            <div key={item.question}>
              <div className="my-4 inline-block w-full" key={item.question}>
                <FaqItem {...item} />
              </div>
            </div>
          ))}
        </section>
      </section>
    </section>
  );
};

const renderFaqTypeLabel = (
  type: IFaqType,
  revolutionName: string,
  artRaceName?: string,
): string => {
  switch (type) {
    case "art-race":
      return artRaceName || `Art Race`;
    case "dao":
      return `${revolutionName} ${revolutionName.toLowerCase().endsWith("dao") ? "" : "DAO"}`;
    default:
      return type;
  }
};
