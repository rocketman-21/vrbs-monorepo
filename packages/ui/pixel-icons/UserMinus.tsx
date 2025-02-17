import { SVGProps } from "react";

const SvgUserMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2h6v2h-6v6h-2V4h2V2Zm0 8h6v2h-6v-2Zm8-6h-2v6h2V4ZM9 16H7v6h16v-6h-2v4H9v-4h12v-2H9v2Zm-2-6H1v2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUserMinus;
