import { SVGProps } from "react";

const SvgEmail = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M13.25 2.75H2.75C1.793 2.75 1 3.543 1 4.5v7c0 .957.793 1.75 1.75 1.75h10.5c.957 0 1.75-.793 1.75-1.75v-7c0-.957-.793-1.75-1.75-1.75ZM2.75 4.063h10.5c.246 0 .438.19.438.437v.602l-4.567 3.8c-.629.52-1.613.52-2.242 0l-4.566-3.8V4.5c0-.246.19-.438.437-.438Zm10.5 7.875H2.75a.432.432 0 0 1-.438-.438V6.824l3.72 3.09c.546.465 1.257.711 1.968.711.71 0 1.422-.246 1.969-.71l3.719-3.09V11.5a.432.432 0 0 1-.438.438Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgEmail;
