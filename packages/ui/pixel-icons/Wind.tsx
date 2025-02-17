import { SVGProps } from "react";

const SvgWind = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3H8v2h4v2H2v2h12V3h-2Zm10 8V7h-6v2h4v2H2v2h20v-2ZM2 17v-2h14v6h-6v-2h4v-2H2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgWind;
