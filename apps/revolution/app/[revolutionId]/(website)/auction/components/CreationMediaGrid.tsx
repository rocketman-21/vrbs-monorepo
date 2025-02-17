import "server-only";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

interface ArtPiece {
  image: string;
  url: string;
  key: string;
}

export const CreationMediaGrid = ({
  artPieces,
  placeholder,
  minImageRowCount,
}: {
  artPieces: ArtPiece[];
  placeholder?: string;
  minImageRowCount: number;
}) => {
  return (
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${minImageRowCount}, minmax(0, 1fr))` }}
    >
      {artPieces.map((piece, index) => (
        <Link href={piece.url} key={piece.key} className="rounded-md bg-zinc-200">
          <Image
            src={piece.image}
            alt=""
            width={128}
            height={128}
            quality={60}
            loading="eager"
            className={classNames("aspect-square h-full w-full rounded-md object-cover", {
              "rounded-tl-lg": index === 0,
              "rounded-tr-lg": index === Math.ceil(Math.sqrt(artPieces.length)) - 1,
              "rounded-bl-lg": index === artPieces.length - Math.ceil(Math.sqrt(artPieces.length)),
              "rounded-br-lg": index === artPieces.length - 1,
              "cursor-default opacity-15": piece.image === placeholder,
            })}
          />
        </Link>
      ))}
    </div>
  );
};
