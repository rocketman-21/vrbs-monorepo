import { SVGProps } from "react";

const SvgLayoutDistributeVertical = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 6V4H4v2h16Zm0 14v-2H4v2h16ZM17 8v8h-2V8h2Zm-8 6v-4h6V8H7v8h8v-2H9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutDistributeVertical;
