import { SVGProps } from "react";

const SvgPaperclip = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 5h16v10H7V9h10v2H9v2h10V7H5v10h14v2H3V5h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPaperclip;
