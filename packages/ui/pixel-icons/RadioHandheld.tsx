import { SVGProps } from "react";

const SvgRadioHandheld = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2v5h8v15H7V2h2Zm0 7v4h6V9H9Zm6 6H9v5h6v-5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgRadioHandheld;
