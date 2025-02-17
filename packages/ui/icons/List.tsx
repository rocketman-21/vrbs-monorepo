import { SVGProps } from "react";

const SvgList = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 1a.5.5 0 0 0-.5.5V3a.5.5 0 0 0 .5.5H3a.5.5 0 0 0 .5-.5V1.5A.5.5 0 0 0 3 1H1.5Zm4.667 0a.5.5 0 0 0-.5.5v1.333a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-.5-.5H6.167ZM1 7.333a.5.5 0 0 1 .5-.5H3a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5H1.5a.5.5 0 0 1-.5-.5v-1.5Zm.5 5.333a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 .5.5H3a.5.5 0 0 0 .5-.5v-1.5a.5.5 0 0 0-.5-.5H1.5Zm4.167-5.333a.5.5 0 0 1 .5-.5H14.5a.5.5 0 0 1 .5.5v1.334a.5.5 0 0 1-.5.5H6.167a.5.5 0 0 1-.5-.5V7.333Zm.5 5.334a.5.5 0 0 0-.5.5V14.5a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5v-1.333a.5.5 0 0 0-.5-.5H6.167Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgList;
