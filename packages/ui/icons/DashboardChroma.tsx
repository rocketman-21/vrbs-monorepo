import { SVGProps } from "react";

const SvgDashboardChroma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M7 5.5A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3Zm8 8a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3Z"
      fill="#2F80ED"
    />
    <path
      opacity={0.4}
      d="M15 5.75C15 6.44 14.44 7 13.75 7h-3.5C9.56 7 9 6.44 9 5.75v-3.5C9 1.56 9.56 1 10.25 1h3.5c.69 0 1.25.56 1.25 1.25v3.5Zm-8 8C7 14.44 6.44 15 5.75 15h-3.5C1.56 15 1 14.44 1 13.75v-3.5C1 9.56 1.56 9 2.25 9h3.5C6.44 9 7 9.56 7 10.25v3.5Z"
      fill="#2F80ED"
    />
  </svg>
);

export default SvgDashboardChroma;
