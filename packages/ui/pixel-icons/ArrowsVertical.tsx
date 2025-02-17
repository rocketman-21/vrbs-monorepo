import { SVGProps } from "react";

const SvgArrowsVertical = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 11h2V7h2v2h2V7h-2V5h-2V3h-2v2H9v2H7v2h2V7h2v4Zm0 2h2v4h2v2h-2v2h-2v-2H9v-2h2v-4Zm-2 4v-2H7v2h2Zm6 0v-2h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowsVertical;
