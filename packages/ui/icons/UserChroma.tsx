import { SVGProps } from "react";

const SvgUserChroma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10.197 8.907H6.803C3.6 8.907 1 11.18 1 13.984 1 14.545 1.52 15 2.16 15h12.68c.641 0 1.16-.453 1.16-1.016 0-2.804-2.598-5.077-5.803-5.077Z"
      fill="#2F80ED"
    />
    <path
      opacity={0.4}
      d="M12.786 3.75c0 2.071-1.919 3.75-4.286 3.75-2.367 0-4.286-1.678-4.286-3.75C4.214 1.68 6.134 0 8.5 0c2.367 0 4.286 1.68 4.286 3.75Z"
      fill="#2F80ED"
    />
  </svg>
);

export default SvgUserChroma;
