import { SVGProps } from "react";

const SvgAddBoxMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h14v14H3V3Zm12 12V5H5v10h10Zm-8 6v-2h12V7h2v14H7Zm4-12h2v2h-2v2H9v-2H7V9h2V7h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAddBoxMultiple;
