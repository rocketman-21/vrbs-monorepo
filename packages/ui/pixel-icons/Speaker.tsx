import { SVGProps } from "react";

const SvgSpeaker = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2H3v20h18V2H4Zm15 2v16H5V4h14Zm-6 2h-2v2h2V6Zm-5 4h8v6h-2v-4h-4v4H8v-6Zm8 6H8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSpeaker;
