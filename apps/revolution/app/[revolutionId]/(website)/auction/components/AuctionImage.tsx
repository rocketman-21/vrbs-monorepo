import { canUseNextImage } from "@cobuild/libs/utils/image";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export const AuctionImage = (props: Props) => {
  const { src, alt } = props;

  return (
    <Image
      alt={alt}
      src={src}
      className="h-full w-full object-cover"
      height="720"
      width="720"
      priority
      unoptimized={!canUseNextImage(src)}
    />
  );
};
