import { SVGProps } from "react";

const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.325 9.543c.562-.022.999-.496.977-1.058l-.194-4.844a1.018 1.018 0 0 0-.977-.977L7.286 2.47a1.018 1.018 0 1 0-.08 2.035l2.52.1L2.734 11.6a1.018 1.018 0 0 0 1.44 1.44l6.993-6.994.101 2.522c.023.562.496.999 1.058.976Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowUp;
