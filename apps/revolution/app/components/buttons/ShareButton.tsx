"use client";

import { useBrowserLayoutEffect } from "@cobuild/libs/hooks/useLayoutEffect";
import { isBrowser } from "@cobuild/libs/utils/dom";
import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import PaperClip from "@cobuild/ui/icons/PaperClip";
import Twitter from "@cobuild/ui/icons/Twitter";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { ReactNode, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {
  url?: string;
  title?: string;
  text?: string;
  children: ReactNode;
  className?: string;
};

export function shareOnTwitter(url: string, title: string, text?: string) {
  const shareText = `${text || title} ${url}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
}

export const ShareButton = (props: Props) => {
  const { text, children, className = "" } = props;
  const [url, setUrl] = useState(props.url);
  const [title, setTitle] = useState(props.title);
  const [supportsWebApiShare, setSupportsWebApiShare] = useState(false);

  useEffect(() => {
    setSupportsWebApiShare(isBrowser() && !!navigator.share);
  }, []);

  useBrowserLayoutEffect(() => {
    if (!url) setUrl(document.location.href);
    if (!title) setTitle(document.title);
  }, []);

  if (supportsWebApiShare) {
    return (
      <div
        onClick={() => {
          navigator
            .share({ url, title, text })
            .then(() => toast.success("Thank you for sharing!"))
            .catch(e => console.debug(e));
        }}
        className={`cursor-pointer ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <Dropdown button={children} className={className}>
      <CopyToClipboard text={url || ""} onCopy={() => toast.success("Link copied!")}>
        <Dropdown.Item icon={PaperClip}>Copy link to clipboard</Dropdown.Item>
      </CopyToClipboard>
      <Dropdown.Item icon={Twitter} onClick={() => shareOnTwitter(url || "", title || "", text)}>
        Share via Twitter
      </Dropdown.Item>
    </Dropdown>
  );
};
