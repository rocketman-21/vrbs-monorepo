import { SVGProps } from "react";

const SvgArchive = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 4H2v6h2v10h16V10h2V4ZM6 10h12v8H6v-8Zm14-4v2H4V6h16Zm-5 6H9v2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArchive;
