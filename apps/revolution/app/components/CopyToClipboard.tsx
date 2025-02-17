"use client";

import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { PropsWithChildren } from "react";
import CopyText from "react-copy-to-clipboard";

interface Props {
  onCopy?: () => void;
  text: string;
}

export const CopyToClipboard = (props: PropsWithChildren<Props>) => {
  const { onCopy = () => toast.success("Copied"), children, text } = props;

  return (
    <Tooltip subtitle="Copy to clipboard" className="max-w-full cursor-pointer">
      <CopyText onCopy={onCopy} text={text}>
        {children}
      </CopyText>
    </Tooltip>
  );
};
