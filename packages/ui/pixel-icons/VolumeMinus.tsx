import { SVGProps } from "react";

const SvgVolumeMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2h-2v2H8v2H6v2H2v8h4v2h2v2h2v2h2V2ZM8 18v-2H6v-2H4v-4h2V8h2V6h2v12H8Zm14-7h-8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVolumeMinus;
