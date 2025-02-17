import { SVGProps } from "react";

const SvgVerticalOptions = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.438 11.375a1.312 1.312 0 1 1 0 2.625 1.312 1.312 0 0 1 0-2.625Zm0-5.25a1.313 1.313 0 1 1 0 2.625 1.313 1.313 0 0 1 0-2.625ZM8.75 2.187a1.313 1.313 0 1 0-2.625 0 1.313 1.313 0 0 0 2.625 0Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVerticalOptions;
