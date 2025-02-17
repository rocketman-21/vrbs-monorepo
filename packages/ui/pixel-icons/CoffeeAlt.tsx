import { SVGProps } from "react";

const SvgCoffeeAlt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 3H5v4h2V3Zm4 0H9v4h2V3Zm2 0h2v4h-2V3Zm8 6H3v12h14v-5h4V9Zm-2 5h-2v-3h2v3ZM5 11h10v8H5v-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCoffeeAlt;
