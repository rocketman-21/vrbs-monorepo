import { SVGProps } from "react";

const SvgList = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 6H4v2h2V6Zm14 0H8v2h12V6ZM4 11h2v2H4v-2Zm16 0H8v2h12v-2ZM4 16h2v2H4v-2Zm16 0H8v2h12v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgList;
