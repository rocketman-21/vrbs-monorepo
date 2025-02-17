"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import { Button } from "@cobuild/ui/atoms/Button";
import { Votes, formatVotes } from "app/components/Votes";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import { useRevolution } from "app/libs/useRevolution";
import classNames from "classnames";

interface Props {
  images: string[];
  tokenName: string;
  creationsGrid: ReactNode;
  revolutionId: string;
  earnings: {
    points: number;
    eth: number;
  } | null;
  creatorPercentage: number;
  pointsName: string;
}

export const About = (props: Props) => {
  const {
    images,
    tokenName,
    revolutionId,
    earnings,
    creatorPercentage,
    pointsName,
    creationsGrid,
  } = props;

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const isMobile = useIsMobile();
  const { addresses, config, votingPower } = useRevolution();
  const { aboutBackgroundPattern, aboutTagline } = config;

  return (
    <section className="bg-secondary-100 relative">
      {aboutBackgroundPattern && (
        <Image
          src={aboutBackgroundPattern}
          alt=""
          width="288"
          height="400"
          className={classNames(
            "pointer-events-none absolute inset-0 h-full w-full select-none object-cover",
            {
              "opacity-50": revolutionId === "characters",
              "opacity-[0.042]": revolutionId !== "characters",
            },
          )}
        />
      )}
      <div className="relative flex w-full overflow-hidden md:h-screen md:max-h-[620px]" ref={ref}>
        <div className="mx-auto flex max-w-screen-2xl grow items-center px-4 lg:px-6">
          <div className="flex flex-col space-y-5 py-8 lg:w-1/2 lg:pl-8">
            <h1 className="text-lead-900 text-3xl font-extrabold lg:text-6xl">
              {aboutTagline || <>One {tokenName}, Every Day, Forever</>}
            </h1>
            <ul className="text-lead-900 mt-6 space-y-4 text-pretty text-lg lg:text-xl">
              <li>
                Every day, the community picks their favorite {tokenName} to auction. Each{" "}
                {tokenName} is worth{" "}
                {formatVotes(votingPower?.tokenVoteWeight || 1e3, "revolution")} votes.
              </li>
              <li>
                Anyone can create the next {tokenName}. The artist earns a {creatorPercentage}% cut
                of the auction proceeds in the form of ETH and {pointsName}.
              </li>
              {earnings && (earnings.eth > 0 || earnings.points > 0) && (
                <li>
                  Artists have earned{" "}
                  <strong className="font-bold">{earnings.eth.toFixed(3)} ETH</strong> and{" "}
                  <strong className="font-bold">
                    <Votes>{earnings.points}</Votes> votes
                  </strong>{" "}
                  so far.
                </li>
              )}
            </ul>
            {addresses && <div className="mt-8 block md:hidden">{creationsGrid}</div>}

            <div className="flex flex-col space-y-1 md:flex-row md:space-x-2 md:space-y-0">
              <Link
                className="order-last sm:order-first"
                href={`/${revolutionId}/creations?create=true`}
              >
                <Button size="lg" className="mt-4 w-full sm:w-auto">
                  Create the next {tokenName}
                </Button>
              </Link>
              <Link className="order-first sm:order-last" href={`/${revolutionId}/creations`}>
                <Button
                  size="lg"
                  className="mt-4 w-full sm:w-auto dark:text-black"
                  color={isMobile ? "outline" : "transparent"}
                >
                  Pick the next {tokenName}
                </Button>
              </Link>
            </div>
          </div>
          <motion.div
            className={classNames(
              "pointer-events-none absolute bottom-0 right-0 top-0 hidden h-full max-w-2xl gap-2.5 lg:grid",
              {
                "grid-cols-7": images.length > 60,
                "grid-cols-6": images.length > 50 && images.length <= 60,
                "grid-cols-5": images.length > 40 && images.length <= 50,
                "grid-cols-4": images.length > 30 && images.length <= 40,
                "grid-cols-3": images.length > 20 && images.length <= 30,
                "grid-cols-2": images.length <= 20,
              },
            )}
            style={{
              transformStyle: "preserve-3d",
              y,
              x: "10vw",
              rotateX: "20deg",
              rotateZ: "5deg",
            }}
            transition={{ ease: "circInOut" }}
          >
            {images.map((image, index) => (
              <div key={index + image.charAt(0)} className="bg-lead-700 rounded-lg">
                <Image
                  src={image}
                  alt=""
                  width={217}
                  height={217}
                  quality={60}
                  loading="eager"
                  className="aspect-square h-full w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
