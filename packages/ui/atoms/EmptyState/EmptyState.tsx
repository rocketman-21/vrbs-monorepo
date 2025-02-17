import cx from "classnames";
import Image from "next/image";
import { ReactNode } from "react";
import Lost from "./illustrations/lost.svg";
import Options from "./illustrations/options.svg";
import Researching from "./illustrations/researching.svg";
import Settings from "./illustrations/settings.svg";

const illustrations = {
  lost: Lost,
  settings: Settings,
  researching: Researching,
  options: Options,
} as const;

/* eslint-disable @next/next/no-img-element */
interface Props {
  children?: ReactNode;
  className?: string;
  text?: string;
  illustration?: keyof typeof illustrations;
  size?: "sm" | "base";
  imageSize?: number;
}

export const EmptyState = (props: Props) => {
  const { illustration = "lost", text, className = "", children, size = "base" } = props;

  const imageSize = props.imageSize || (size === "base" ? 224 : 128);

  return (
    <div className={`flex flex-col items-center space-y-4 px-4 md:space-y-6 ${className}`}>
      <div
        className={cx("flex items-center justify-center rounded-full bg-white dark:bg-white/10", {
          "p-8": size === "base",
          "p-6": size === "sm",
        })}
        style={{ width: imageSize, height: imageSize }}
      >
        <Image src={illustrations[illustration]} alt={text || "Empty"} width="800" height="800" />
      </div>
      {text && <h3 className="max-w-md text-center text-sm font-medium">{text}</h3>}
      {children}
    </div>
  );
};

export default EmptyState;
