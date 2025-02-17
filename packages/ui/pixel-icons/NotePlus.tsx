import { SVGProps } from "react";

const SvgNotePlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 1H5v3H2v2h3v3h2V6h3V4H7V1Zm12 1h-7v2h7v10h-6v6H5v-9H3v11h12v-2h2v-2h2v-2h2V2h-2Zm-2 16h-2v-2h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotePlus;
