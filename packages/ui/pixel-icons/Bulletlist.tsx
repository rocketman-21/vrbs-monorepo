import { SVGProps } from "react";

const SvgBulletlist = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 11V5h6v6H2Zm4-2V7H4v2h2Zm16-4H10v2h12V5Zm0 4H10v2h12V9Zm-12 4h12v2H10v-2Zm12 4H10v2h12v-2ZM2 13v6h6v-6H2Zm4 2v2H4v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBulletlist;
