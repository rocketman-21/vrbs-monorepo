import { SVGProps } from "react";

const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 17 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#Wallet_svg__a)">
      <path
        opacity={0.4}
        d="M15.333 2.5v1.781a1.785 1.785 0 0 0-1-.281h-12.5a1.52 1.52 0 0 1-1.5-1.5c0-.813.688-1.5 1.5-1.5h12c.813 0 1.5.688 1.5 1.5Z"
      />
      <path d="M14.333 4h-12.5a1.52 1.52 0 0 1-1.5-1.5V13c0 1.094.907 2 2 2h12c1.094 0 2-.906 2-2V6c0-1.094-.906-2-2-2Zm-1 6.5c-.562 0-1-.438-1-1 0-.563.438-1 1-1 .563 0 1 .438 1 1 0 .563-.437 1-1 1Z" />
    </g>
    <defs>
      <clipPath id="Wallet_svg__a">
        <path fill="#fff" transform="translate(.333)" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgWallet;
