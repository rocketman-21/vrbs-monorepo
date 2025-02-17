import classNames from "classnames";
import { CSSProperties } from "react";

interface Props {
  className?: string;
  count?: number;
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  rounded?: boolean;
  square?: boolean;
}

export const Skeleton = (props: Props) => {
  const {
    count = 1,
    className,
    square,
    height = square ? "auto" : 20,
    rounded = false,
    width = "100%",
  } = props;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          className={classNames(
            "dark:bg-card max-w-full flex-shrink-0 animate-pulse bg-zinc-200",
            className,
            {
              "rounded-lg": rounded && Number(height) < 50,
              "rounded-xl": rounded && Number(height) >= 50,
              "aspect-square rounded-xl": square,
            },
          )}
          key={`skeleton_${index}_${count}_${height}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};

export const SkeletonRow = (props: Props & { colSpan?: number }) => {
  const { count, colSpan = 1, ...rest } = props;
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <tr key={`skeleton_${index}_${count}_${colSpan}}`}>
          <td colSpan={colSpan}>
            <Skeleton {...rest} />
          </td>
        </tr>
      ))}
    </>
  );
};

export default Skeleton;
