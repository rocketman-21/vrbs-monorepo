import { SVGProps } from "react";

const SvgHeartFull = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2.66666H6.66665V5.33332H3.99998V7.99999H1.33331V16H3.99998V18.6667H6.66665V21.3333H9.33331V24H12L12 26.6667H14.6666V29.3333H17.3333V26.6667L20 26.6667V24H22.6666V21.3333H25.3333V18.6667L28 18.6667V16H30.6666V7.99999H28V5.33332H25.3333V2.66666H20V5.33332H17.3333V7.99999H14.6666V5.33332H12V2.66666ZM12 5.33332V7.99999H14.6666V10.6667H17.3333V7.99999H20V5.33332H25.3333V7.99999H28V16H25.3333V18.6667H22.6666L22.6666 21.3333H20V24H17.3333V26.6667L14.6666 26.6667V24H12V21.3333H9.33331V18.6667L6.66665 18.6667V16H3.99998V7.99999H6.66665V5.33332H12Z"
      fill="#E55151"
    />
    <rect x="4" y="8" width="24" height="8" fill="#E55151" />
    <rect x="6.66669" y="16" width="18.6667" height="2.66667" fill="#E55151" />
    <rect x="9.33331" y="18.6667" width="13.3333" height="2.66667" fill="#E55151" />
    <rect x="12" y="21.3333" width="8" height="2.66667" fill="#E55151" />
    <rect x="14.6667" y="24" width="2.66667" height="2.66667" fill="#E55151" />
    <rect x="6.66669" y="5.33334" width="5.33333" height="2.66667" fill="#E55151" />
    <rect x="20" y="5.33334" width="5.33333" height="2.66667" fill="#E55151" />
  </svg>
);

export default SvgHeartFull;
