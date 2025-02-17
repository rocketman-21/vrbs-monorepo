import { SVGProps } from "react";

const SvgSortingArrows = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m3.162.652-3.02 3.13A.551.551 0 0 0 0 4.129c-.012.262.288.372.55.372H6.45c.262 0 .562-.11.55-.372a.551.551 0 0 0-.14-.345L3.837.653A.446.446 0 0 0 3.5.5a.446.446 0 0 0-.338.152ZM3.162 11.348l-3.02-3.13A.551.551 0 0 1 0 7.871C-.011 7.61.289 7.5.55 7.5H6.45c.262 0 .562.11.55.372a.551.551 0 0 1-.14.345l-3.021 3.13a.446.446 0 0 1-.338.153.446.446 0 0 1-.338-.152Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSortingArrows;
