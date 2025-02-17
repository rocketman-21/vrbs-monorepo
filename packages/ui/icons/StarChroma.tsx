import { SVGProps } from "react";

const SvgStartChroma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#StartChroma_svg__a)" fill="#2F80ED">
      <path d="M8.047 1H8v12.217l-3.561 1.902a.895.895 0 0 1-.939-.063.884.884 0 0 1-.356-.87l.684-4.072L.933 7.275a.893.893 0 0 1-.22-.911.884.884 0 0 1 .715-.6l3.989-.589 1.789-3.676A.885.885 0 0 1 8.047 1Zm3.895 14.222h.091a.502.502 0 0 1-.091 0Z" />
      <path
        opacity={0.4}
        d="M11.103 13.108 10.51 9.6l2.522-2.494-3.483-.512-1.547-3.182-.028.009V1h-.014a.886.886 0 0 1 .842.5l1.786 3.675 3.992.589a.887.887 0 0 1 .494 1.511l-2.894 2.839.683 4.072a.892.892 0 0 1-1.295.934l-3.566-1.903h-.028v-1.761l.028-.003 3.1 1.655Zm-7.04 2.114a.471.471 0 0 1-.088 0h.089Z"
      />
    </g>
    <defs>
      <clipPath id="StartChroma_svg__a">
        <path fill="#fff" transform="translate(0 1)" d="M0 0h16v14.222H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgStartChroma;
