"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  size: number;
  setSize: (newSize: number) => void;
  isLoading: boolean;
  isValidating: boolean;
  hasMore: boolean;
  autoload?: boolean;
}

export const LoadMoreButton = (props: Props) => {
  const { hasMore, isLoading, isValidating, size, setSize, autoload } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "400px 0px" });

  useEffect(() => {
    if (autoload && isInView && !isLoading && !isValidating && hasMore) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoload, isInView]);

  return (
    <div className="flex justify-center pt-4" ref={ref}>
      <Button
        onClick={() => setSize(size + 1)}
        disabled={isLoading || isValidating || !hasMore}
        color="primary"
        type="button"
      >
        {isLoading || isValidating ? "Loading..." : "Show more"}
      </Button>
    </div>
  );
};
