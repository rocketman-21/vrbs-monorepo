import { SVGProps } from "react";

const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m14.904 13.822-3.32-3.32a.325.325 0 0 0-.232-.096h-.36A5.687 5.687 0 0 0 6.687 1 5.687 5.687 0 0 0 1 6.688a5.687 5.687 0 0 0 9.406 4.303v.361c0 .088.036.17.096.233l3.32 3.32a.328.328 0 0 0 .464 0l.618-.619a.328.328 0 0 0 0-.464Zm-8.216-2.76a4.374 4.374 0 0 1-4.375-4.374 4.374 4.374 0 0 1 4.374-4.375 4.374 4.374 0 0 1 4.375 4.374 4.374 4.374 0 0 1-4.374 4.375Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSearch;
