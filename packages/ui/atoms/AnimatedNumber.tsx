"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type Props = {
  value: number;
  className?: string;
  format?: (value: string) => string;
};

export const AnimatedNumber = (props: Props) => {
  const { value, className = "", format = x => x } = props;
  const spring = useSpring(value, { bounce: 0 });
  const display = useTransform(() => format(spring.get().toString()));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};
