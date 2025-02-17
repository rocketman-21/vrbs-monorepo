import { SVGProps } from "react";

const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.325 6.457c.562.022.999.496.977 1.058l-.194 4.844c-.021.53-.446.956-.977.977l-4.845.194a1.018 1.018 0 1 1-.08-2.035l2.52-.1L2.734 4.4a1.018 1.018 0 0 1 1.44-1.44l6.993 6.994.101-2.522a1.018 1.018 0 0 1 1.058-.976Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowDown;
