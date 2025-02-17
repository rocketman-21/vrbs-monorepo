import { SVGProps } from "react";

const SvgComment = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M14.25 10.333c0 .445-.36.806-.806.806H4.318c-.331 0-.65.132-.884.366l.53.53-.53-.53-1.684 1.684V2.556c0-.445.36-.806.806-.806h10.888c.445 0 .806.36.806.806v7.777Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComment;
