import { SVGProps } from "react";
import * as React from "react";

const SvgApproved = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.459 6.5a6.125 6.125 0 1 1-12.25 0 6.125 6.125 0 0 1 12.25 0ZM5.626 9.743 10.17 5.2a.395.395 0 0 0 0-.559L9.61 4.08a.395.395 0 0 0-.559 0L5.346 7.787l-1.73-1.73a.395.395 0 0 0-.56 0l-.558.559a.395.395 0 0 0 0 .559l2.569 2.568a.395.395 0 0 0 .559 0Z"
      fill="#45B26B"
    />
  </svg>
);

export default SvgApproved;
