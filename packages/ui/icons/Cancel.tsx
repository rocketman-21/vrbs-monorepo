import { SVGProps } from "react";

const SvgCancel = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect fill="#fff" height={23} rx={11.5} width={23} x={0.5} y={0.5} />
    <path
      d="M16.331 16.331a.716.716 0 0 1-1 0L12 12.999l-3.332 3.332a.717.717 0 0 1-.999 0 .716.716 0 0 1 0-1L11.001 12 7.669 8.668a.717.717 0 0 1 0-.999.717.717 0 0 1 1 0L12 11.001l3.332-3.332a.716.716 0 0 1 .999 0c.27.27.27.729 0 1L12.999 12l3.332 3.332c.27.27.27.728 0 .999z"
      fill="#9d9dae"
    />
    <rect height={23} rx={11.5} stroke="#e8e8f0" width={23} x={0.5} y={0.5} />
  </svg>
);

export default SvgCancel;
