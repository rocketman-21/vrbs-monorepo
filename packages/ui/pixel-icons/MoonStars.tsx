import { SVGProps } from "react";

const SvgMoonStars = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#moon-stars_svg__a)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 0h2v2h2v2h-2v2h-2V4h-2V2h2V0ZM8 4h8v2h-2v2h-2V6H8V4ZM6 8V6h2v2H6Zm0 8H4V8h2v8Zm2 2H6v-2h2v2Zm8 0v2H8v-2h8Zm2-2v2h-2v-2h2Zm-2-4v-2h2V8h2v8h-2v-4h-2Zm-4 0h4v2h-4v-2Zm0 0V8h-2v4h2Zm-8 6H2v2H0v2h2v2h2v-2h2v-2H4v-2Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="moon-stars_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgMoonStars;
