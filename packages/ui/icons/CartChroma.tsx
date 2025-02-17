import { SVGProps } from "react";

const SvgCartChroma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#CartChroma_svg__a)" fill="#2F80ED">
      <path d="M0 1.667C0 1.299.299 1 .667 1h2c.32 0 .594.228.655.542l1.675 8.791h8.559c.369 0 .666.298.666.667 0 .37-.297.667-.666.667H4.419a.663.663 0 0 1-.63-.542L2.115 2.333H.667A.667.667 0 0 1 0 1.667Zm6.222 12.222a1.334 1.334 0 1 1-2.667 0 1.334 1.334 0 0 1 2.667 0Zm5.334 0a1.334 1.334 0 1 1 2.667 0 1.334 1.334 0 0 1-2.667 0Z" />
      <path
        opacity={0.4}
        d="M3.364 1.889H15.05c.564 0 1.014.562.855 1.13l-1.5 5.334A.89.89 0 0 1 13.55 9H4.742L3.364 1.889Z"
      />
    </g>
    <defs>
      <clipPath id="CartChroma_svg__a">
        <path fill="#fff" transform="translate(0 1)" d="M0 0h16v14.222H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCartChroma;
