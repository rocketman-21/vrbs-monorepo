import { SVGProps } from "react";

const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#Calendar_svg__a)">
      <path
        d="M12.375 2.75h-1.094V1.656c0-.355-.3-.656-.656-.656-.355 0-.656.3-.656.656V2.75H6.03V1.656c0-.355-.3-.656-.656-.656-.355 0-.656.3-.656.656V2.75H3.625c-.957 0-1.75.793-1.75 1.75v8.75c0 .957.793 1.75 1.75 1.75h8.75c.957 0 1.75-.793 1.75-1.75V4.5c0-.957-.793-1.75-1.75-1.75Zm0 10.938h-8.75a.432.432 0 0 1-.438-.438v-7h9.626v7a.432.432 0 0 1-.438.438Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="Calendar_svg__a">
        <path fill="#fff" transform="translate(1.875 1)" d="M0 0h12.25v14H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCalendar;
