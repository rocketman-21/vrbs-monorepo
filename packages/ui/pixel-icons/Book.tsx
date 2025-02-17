import { SVGProps } from "react";

const SvgBook = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2h12v20H4V2h4Zm4 8h-2v2H8V4H6v16h12V4h-4v8h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBook;
