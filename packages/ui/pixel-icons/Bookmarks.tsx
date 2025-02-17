import { SVGProps } from "react";

const SvgBookmarks = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 18V2H7v2h12v14h2ZM5 6H3v16h4v-2h2v-2h2v2h2v2h4V6H5Zm8 14v-2h-2v-2H9v2H7v2H5V8h10v12h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBookmarks;
