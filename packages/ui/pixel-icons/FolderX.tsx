import { SVGProps } from "react";

const SvgFolderX = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4H2v16h20V6H12V4Zm-2 4h10v10H4V6h6v2Zm6 4h-2v-2h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2Zm0 0h2v-2h-2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFolderX;
