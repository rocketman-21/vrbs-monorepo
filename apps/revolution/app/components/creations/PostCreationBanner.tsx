import { Button } from "@cobuild/ui/atoms/Button";
import { getRevolutionPalette } from "@cobuild/libs/revolution/config";
import clsx from "classnames";
import Link from "next/link";

interface Props {
  revolutionId: string;
  className?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  url?: string;
}

export const PostCreationBanner = (props: Props) => {
  const { revolutionId, className, title, subtitle, ctaText, url } = props;

  const palette = getRevolutionPalette(revolutionId);
  const patternSvgColor = palette[300].replace("#", "%23");

  return (
    <div
      className={clsx(
        "border-lead-300 bg-page relative flex flex-col overflow-hidden rounded-md border-[3px] border-double p-4 md:flex-row md:items-center md:justify-between md:p-5",
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${patternSvgColor}' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div>
        <h1 className="text-lead-900 font-bold tracking-tighter antialiased md:inline-block md:text-2xl dark:text-white">
          {/* Join the movement. */}
          {title}
        </h1>
        <h2 className="text-lead-950 text-sm font-medium md:inline-block md:pl-4 dark:text-white/90">
          {/* Post your creations, get paid for content and earn voting power! */}
          {subtitle}
        </h2>
      </div>
      <div className="max-sm:mt-8">
        <Link href={url || `/${revolutionId}?create=true`}>
          <Button color="primary" size="md">
            {/* Share your creation */}
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};
