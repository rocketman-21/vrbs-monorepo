import { SVGProps } from "react";

const SvgFilter = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M15.872 1.844A1.445 1.445 0 0 0 14.53 1H1.469c-.593 0-1.093.313-1.343.844-.219.5-.156 1.062.218 1.5L5.5 9.688v2.124c0 .376.187.75.53.97l2.563 2c.218.155.468.218.687.218.687 0 1.219-.531 1.219-1.188V9.689l5.186-6.344c.344-.438.406-1 .187-1.5ZM9.218 8.875c-.125.188-.22.406-.22.625v3.688L7 11.655V9.5c0-.219-.093-.438-.218-.625L1.594 2.5h12.81L9.218 8.875Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFilter;
