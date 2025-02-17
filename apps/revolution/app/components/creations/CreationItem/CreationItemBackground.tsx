import { canUseNextImage } from "@cobuild/libs/utils/image";
import clsx from "classnames";
import Image from "next/image";

interface Props {
  thumbnailUrl: string;
  darkMode: boolean;
}

export const CreationItemBackground = (props: Props) => {
  const { thumbnailUrl, darkMode } = props;

  return (
    <div className="absolute -inset-[1024px]">
      <Image
        src={thumbnailUrl}
        width={800}
        height={800}
        alt=""
        quality={20}
        className={clsx("h-full w-full object-cover object-center blur-3xl", {
          "opacity-10": darkMode,
          "opacity-15": !darkMode,
        })}
        unoptimized={!canUseNextImage(thumbnailUrl)}
        priority
      />
    </div>
  );
};
