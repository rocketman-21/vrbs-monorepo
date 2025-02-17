import { SVGProps } from "react";

const SvgMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M14 8a.702.702 0 0 1-.692.692H2.692A.702.702 0 0 1 2 8c0-.375.317-.692.692-.692h10.616c.375 0 .692.317.692.692Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMinus;
