import { SVGProps } from "react";

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10.95 10.95a.819.819 0 0 1-1.143 0L6 7.142 2.192 10.95a.819.819 0 0 1-1.142 0 .819.819 0 0 1 0-1.143L4.858 6 1.05 2.192a.819.819 0 0 1 0-1.142.819.819 0 0 1 1.142 0L6 4.858 9.807 1.05a.819.819 0 0 1 1.143 0c.31.31.31.833 0 1.142L7.142 6l3.808 3.807c.31.31.31.833 0 1.143Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgClose;
