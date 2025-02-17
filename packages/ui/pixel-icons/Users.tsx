import { SVGProps } from "react";

const SvgUsers = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#users_svg__a)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2H5v2H3v6h2v2h6v-2H5V4h6V2Zm0 2h2v6h-2V4ZM0 16h2v4h12v2H0v-6Zm2 0h12v-2H2v2Zm14 0h-2v6h2v-6ZM15 2h4v2h-4V2Zm4 8h-4v2h4v-2Zm0-6h2v6h-2V4Zm5 12h-2v4h-4v2h6v-6Zm-6-2h4v2h-4v-2Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="users_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgUsers;
