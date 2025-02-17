import { SVGProps } from "react";

const SvgWindows = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <mask id="Windows_svg__a" fill="#fff">
      <rect width={14} height={14} rx={1} />
    </mask>
    <rect
      width={14}
      height={14}
      rx={1}
      stroke="#fff"
      strokeWidth={2.4}
      mask="url(#Windows_svg__a)"
    />
    <path fill="#fff" d="M1 5h8v8H1z" />
  </svg>
);

export default SvgWindows;
