import { SVGProps } from "react";

const SvgEmpty = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#Empty_svg__a)" fill="#7B7B8C">
      <path
        opacity={0.4}
        d="M3.59 18.288A10.453 10.453 0 0 1 1.5 12C1.5 6.201 6.201 1.5 12 1.5c2.267-.004 4.474.73 6.288 2.09l-2.693 2.694a6.754 6.754 0 0 0-9.31 9.31L3.59 18.289Zm14.126-9.882a6.753 6.753 0 0 1-9.31 9.31L5.712 20.41A10.453 10.453 0 0 0 12 22.5c5.799 0 10.5-4.701 10.5-10.5a10.453 10.453 0 0 0-2.09-6.288l-2.694 2.694Z"
      />
      <path d="M23.78 2.344 2.344 23.78a.75.75 0 0 1-1.061 0L.22 22.72a.75.75 0 0 1 0-1.061L21.659.219a.75.75 0 0 1 1.06 0L23.78 1.28a.75.75 0 0 1 0 1.064Z" />
    </g>
    <defs>
      <clipPath id="Empty_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgEmpty;
