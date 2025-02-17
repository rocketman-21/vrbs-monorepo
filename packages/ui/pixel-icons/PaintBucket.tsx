import { SVGProps } from "react";

const SvgPaintBucket = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3h8v2H8V3Zm0 2H6v4H4v12h16V9h-2V5h-2v4H8V5Zm8 6h2v8H6v-8h2v6h2v-4h2v2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPaintBucket;
