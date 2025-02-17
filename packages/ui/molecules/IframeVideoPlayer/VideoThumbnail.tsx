import { canUseNextImage } from "@cobuild/libs/utils/image";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

export const VideoThumbnail = (props: Props) => {
  const { src, alt, ...rest } = props;
  const [error, setError] = useState<React.SyntheticEvent<HTMLImageElement, Event> | null>(null);

  useEffect(() => setError(null), [src]);

  return (
    <Image
      {...rest}
      alt={alt}
      onError={setError}
      src={error && typeof src === "string" ? src.replace("maxresdefault", "hqdefault") : src}
      unoptimized={!canUseNextImage(src)}
    />
  );
};
