import { SVGProps } from "react";

const SvgBrowser = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M464 32H48C21.5 32 0 53.5 0 80V432C0 458.5 21.5 480 48 480H464C490.5 480 512 458.5 512 432V80C512 53.5 490.5 32 464 32ZM32 80C32 71.2 39.2 64 48 64H96V128H32V80ZM480 432C480 440.8 472.8 448 464 448H48C39.2 448 32 440.8 32 432V160H480V432ZM480 128H128V64H464C472.8 64 480 71.2 480 80V128Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBrowser;
