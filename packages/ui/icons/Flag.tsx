import { SVGProps } from "react";

const SvgFlag = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="Flag_svg__h-6 Flag_svg__w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 21v-4m0 0V5a2 2 0 0 1 2-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 0 0-2 2zm9-13.5V9"
    />
  </svg>
);

export default SvgFlag;
