import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import Image from "next/image";
import Link from "next/link";

interface Props {
  revolutionId: string | undefined;
  logoUrl?: string;
  className?: string;
}

export const RevolutionLogoLink = (props: Props) => {
  const { revolutionId, className = "", logoUrl } = props;
  if (!revolutionId) return null;

  const { logoUrl: defaultLogo, name, homepageRedirect = "" } = getRevolutionConfig(revolutionId);

  return (
    <Link
      href={`/${revolutionId}/${homepageRedirect}`}
      className={`flex h-7 shrink-0 duration-150 hover:opacity-80 md:h-9 ${className}`}
    >
      <Image
        src={logoUrl || defaultLogo}
        alt={name}
        width="36"
        height="36"
        className="h-full w-auto rounded-sm"
        priority
      />
    </Link>
  );
};
