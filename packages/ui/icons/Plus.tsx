import { SVGProps } from "react";

const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8 1c.437 0 .807.37.807.808v5.384h5.385c.438 0 .808.37.808.808 0 .438-.37.808-.808.808H8.807v5.384c0 .438-.37.808-.807.808a.819.819 0 0 1-.808-.808V8.808H1.807A.819.819 0 0 1 1 8c0-.438.37-.808.807-.808h5.385V1.808C7.192 1.37 7.562 1 8 1Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPlus;
