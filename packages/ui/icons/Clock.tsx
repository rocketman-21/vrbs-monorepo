import { SVGProps } from "react";

const SvgClock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8.5 0a8.5 8.5 0 1 0 .001 17.001A8.5 8.5 0 0 0 8.5 0Zm3.349 11.113-.543.74a.15.15 0 0 1-.159.057.151.151 0 0 1-.053-.025L7.955 9.597a.15.15 0 0 1-.062-.124V4.25c0-.083.068-.152.152-.152h.912c.084 0 .152.069.152.152v4.696l2.706 1.956a.15.15 0 0 1 .034.21Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgClock;
