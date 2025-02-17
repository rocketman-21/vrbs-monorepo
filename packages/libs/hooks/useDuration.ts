"use client";

import { intervalToDuration } from "date-fns/intervalToDuration";
import { isBefore } from "date-fns/isBefore";
import { parseISO } from "date-fns/parseISO";
import { useEffect, useMemo, useRef, useState } from "react";

const MAX_UNIX_TIMESTAMP = 2147483646;

type Duration = {
  years?: number | undefined;
  months?: number | undefined;
  weeks?: number | undefined;
  days?: number | undefined;
  hours?: number | undefined;
  minutes?: number | undefined;
  seconds?: number | undefined;
};

export const useDuration = (targetTime: string, onExpire?: () => void) => {
  const [start, setStart] = useState(new Date());

  const [end, setEnd] = useState(() => {
    try {
      return parseISO(targetTime);
    } catch (e) {
      return new Date(targetTime);
    }
  });

  useEffect(() => {
    try {
      setEnd(parseISO(targetTime));
    } catch (e) {}
  }, [targetTime]);

  const [duration, setDuration] = useState<Duration>(() => intervalToDuration({ start, end }));
  const [isExpired, setIsExpired] = useState(isBefore(end, start));

  const hasExpiredFired = useRef(false);

  const isForever = useMemo(() => {
    const seconds = new Date(targetTime).getTime() / 1e3;
    return seconds > MAX_UNIX_TIMESTAMP * 0.99 && seconds < MAX_UNIX_TIMESTAMP * 1.01;
  }, [targetTime]);

  useEffect(() => {
    if (isForever || isExpired) return;

    if (isBefore(start, end)) {
      const newDuration = intervalToDuration({ start, end });
      setDuration(
        newDuration && Object.keys(newDuration).length > 0 ? newDuration : { seconds: 0 },
      );
      setIsExpired(false);
      return;
    }

    setDuration({ seconds: 0 });
    setIsExpired(true);

    if (onExpire && !hasExpiredFired.current) {
      onExpire();
      hasExpiredFired.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  useEffect(() => {
    if (isExpired || isForever) return;

    const interval = setInterval(() => setStart(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isExpired, isForever, targetTime]);

  return { duration: duration, isExpired, isForever };
};
