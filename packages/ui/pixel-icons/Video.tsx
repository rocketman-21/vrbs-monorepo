import { SVGProps } from "react";

const SvgVideo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h14v4h2V7h2V5h2v14h-2v-2h-2v-2h-2v4H2V5Zm2 12h10V7H4v10Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVideo;
