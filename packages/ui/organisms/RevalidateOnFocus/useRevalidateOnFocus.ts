"use client";

import throttle from "lodash/throttle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRevalidateOnFocus() {
  const router = useRouter();

  useEffect(() => {
    const refresh = throttle(() => router.refresh(), 5000);

    const revalidate = () => {
      if (document.visibilityState === "hidden") return;
      refresh();
    };

    window.addEventListener("visibilitychange", revalidate);

    return () => {
      refresh.cancel();
      window.removeEventListener("visibilitychange", revalidate);
    };
  }, [router]);
}
