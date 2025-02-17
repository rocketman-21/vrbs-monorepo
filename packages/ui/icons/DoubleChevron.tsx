import { SVGProps } from "react";

const SvgDoubleChevron = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m13.84 8.374-4.467 4.464a.55.55 0 0 1-.778 0l-.522-.521a.55.55 0 0 1 0-.78l3.538-3.554L8.073 4.43a.553.553 0 0 1 0-.779l.522-.521a.55.55 0 0 1 .778 0l4.467 4.464a.556.556 0 0 1 0 .781Zm-5.911-.781L3.462 3.129a.55.55 0 0 0-.779 0l-.521.521a.55.55 0 0 0 0 .78L5.7 7.982l-3.538 3.555a.553.553 0 0 0 0 .778l.522.522a.549.549 0 0 0 .778 0L7.93 8.374a.556.556 0 0 0 0-.781Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDoubleChevron;
