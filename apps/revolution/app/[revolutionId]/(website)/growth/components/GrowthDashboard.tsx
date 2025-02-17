"use client";

import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { useEffect, useState } from "react";

export default function GrowthDashboard({ revolutionId }: { revolutionId: string }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const { plausibleEmbedAuthToken, url, darkMode } = getRevolutionConfig(revolutionId);
  const [height, setHeight] = useState(2000);
  const isMobile = useIsMobile();

  const plausibleUrl = `https://plausible.io/share/${encodeURIComponent(url)}?auth=${plausibleEmbedAuthToken}&embed=true&theme=${darkMode ? "dark" : "light"}&background=transparent`;

  useEffect(() => {
    setHeight(isMobile ? 2900 : 1800);
  }, [isMobile]);

  useEffect(() => {
    fetch(plausibleUrl)
      .then(response => {
        if (!response.ok) {
          setIsBlocked(true);
        }
      })
      .catch(() => {
        setIsBlocked(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      {isBlocked ? (
        <div>
          There was an error loading the analytics dashboard. Please disable your adblocker if you
          have one enabled.
        </div>
      ) : (
        <iframe
          plausible-embed="true"
          src={plausibleUrl}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          style={{
            width: "100%",
            minWidth: "100%",
            height,
          }}
        />
      )}
    </div>
  );
}
