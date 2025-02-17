import { SVGProps } from "react";

const SvgAttachment = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 5v14H5V3h14v18H9V7h6v10h-2V9h-2v10h6V5H7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAttachment;
