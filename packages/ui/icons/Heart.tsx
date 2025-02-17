import { SVGProps } from "react";

const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#Heart_svg__a)">
      <path
        d="M14.472 1.97A3.964 3.964 0 0 0 11.846 1c-1.188 0-2.376.469-3.22 1.376L8 3l-.625-.625C6.53 1.469 5.342 1 4.155 1c-.939 0-1.877.313-2.627.97C-.411 3.657-.505 6.66 1.246 8.44l6.035 6.254a.95.95 0 0 0 .719.312.95.95 0 0 0 .72-.312l6.034-6.254c1.75-1.782 1.657-4.783-.282-6.472Zm-.781 5.44L8 13.288 2.31 7.41c-1.001-1.032-1.251-3.064.187-4.315 1.25-1.063 2.97-.532 3.815.313.906.969.25.28 1.688 1.75 1.188-1.219.844-.875 1.688-1.75.845-.845 2.533-1.407 3.815-.313 1.407 1.25 1.22 3.252.188 4.315Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="Heart_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgHeart;
