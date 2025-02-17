import { SVGProps } from "react";

const SvgUserCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="UserCircle_svg__h-6 UserCircle_svg__w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.121 17.804A13.937 13.937 0 0 1 12 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
    />
  </svg>
);

export default SvgUserCircle;
