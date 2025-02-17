/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState } from "react";

export const Vrbie = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [animationCount, setAnimationCount] = useState(0);
  const segments = useSelectedLayoutSegments();
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(getDuckText(segments));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationCount]);

  return (
    <motion.div
      initial={{ y: "45%" }} // 45% part shows only noggles
      animate={{ y: ["0%", "45%"] }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 0.75,
        repeatDelay: Math.floor(Math.random() * 10) + 5, // change animation every 5-15s
      }}
      whileHover={{ y: "0%" }}
      onUpdate={latest => {
        const shouldShow = latest.y === "0%";
        setShowBubble(shouldShow);
        if (shouldShow) setAnimationCount(animationCount + 1);
      }}
      className="flex items-center space-x-2.5"
    >
      <img
        className="h-28 select-none lg:h-36"
        height={144}
        src="/images/vrbs/duck.svg"
        alt="Duck"
      />
      <Bubble show={showBubble} message={message} />
    </motion.div>
  );
};

const Bubble = (props: { show: boolean; message: string }) => {
  const { show, message } = props;

  return (
    <motion.div
      variants={{
        visible: { x: 0, opacity: 1, scale: 1 },
        hidden: { x: -50, opacity: 0, scale: 0.5 },
      }}
      transition={{ duration: 0.3, delay: 0.25 }}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      className="flex items-center justify-start"
    >
      <div className="w-3 select-none overflow-hidden">
        <div className="h-4 origin-bottom-right rotate-45 transform rounded-sm bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium dark:border-zinc-600 dark:bg-zinc-800">
        {message}
      </div>
    </motion.div>
  );
};

function getDuckText(urlSegments: string[]) {
  const segment = urlSegments[0];
  const hours = new Date().getHours();

  const messages = [
    "quack quack",
    "to Vrb or not to Vrb...",
    "now we're Vrbin",
    "duck yeah!",
    "will call you back later",
    "quackie quackie doooo!",
    "that would be great, yeah",
    "they call me Vrbie",
    "all your base are belong to us",
    "pssst...",
  ];

  if (hours >= 5 && hours < 12) {
    messages.push("gm! quack quack", "morning coffee vibes!", "gm ser!", "gm");
  }

  if (hours >= 12 && hours < 18) {
    messages.push("how's your day going?");
  }

  if (hours >= 18 && hours < 24) {
    messages.push("good evening!", "hope you had a good day!");
  }

  if (hours >= 0 && hours < 5) {
    messages.push(
      "shouldn't you be sleeping?",
      "hey devs add dark mode!",
      "seriously... gn!",
      "why are you still up?",
      "night still young?",
      "need sleep so badly",
    );
  }

  if (segment === "build") messages.push("build something nice!", "what will you build?");
  if (segment === "grants") messages.push("grants are vrbs superpower!");
  if (segment === "faq") messages.push("we all have questions!");

  return messages[Math.floor(Math.random() * messages.length)];
}
