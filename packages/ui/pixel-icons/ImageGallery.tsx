import { SVGProps } from "react";

const SvgImageGallery = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h20v16h-5v2h-2v-2H9v2H7v-2H2V2Zm5 18v2H5v-2h2Zm10 0v2h2v-2h-2Zm3-16H4v12h16V4Zm-8 4h2v2h-2V8Zm-2 4v-2h2v2h-2Zm0 0v2H8v-2h2Zm6 0h-2v-2h2v2Zm0 0h2v2h-2v-2ZM8 6H6v2h2V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageGallery;
