import { SVGProps } from "react";

const SvgFolderMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4H2v16h20V6H12V4Zm-2 4h10v10H4V6h6v2Zm8 6v-2h-6v2h6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFolderMinus;
