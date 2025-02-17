import { SVGProps } from "react";

const SvgFootball = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      opacity={0.4}
      d="M15.5 8.25a7.607 7.607 0 0 1-1.313 3.969l-.218-.938-3.313.406L9.25 14.72l.844.469v.03a7.934 7.934 0 0 1-4.188 0v-.03l.844-.47-1.438-3.03L2 11.28l-.219.938C1 11.03.531 9.656.5 8.25l.719.625 2.437-2.281-.625-3.282-.969.094A7.784 7.784 0 0 1 5.438.937l.03.032-.374.875L8 3.437l2.906-1.593-.375-.907a7.698 7.698 0 0 1 3.406 2.47l-.968-.095-.656 3.282 2.437 2.281.75-.625Zm-4.469-1.094L8 4.97 4.969 7.156l1.156 3.563h3.75l1.156-3.563Z"
      fill="url(#Football_svg__a)"
    />
    <path
      d="M10.906 1.406 10.531.5A7.417 7.417 0 0 0 5.47.5l-.375.906L8 3l2.906-1.594ZM3.031 2.875l-.969.094A7.62 7.62 0 0 0 .5 7.563v.25l.75.625 2.438-2.282-.657-3.281Zm6.844 7.406 1.156-3.562L8 4.53 4.969 6.72l1.156 3.562h3.75Zm4.063-7.312-.97-.094-.655 3.281 2.437 2.282.75-.657v-.218a7.62 7.62 0 0 0-1.563-4.594ZM2.03 10.844l-.219.937a7.293 7.293 0 0 0 4.094 2.969l.844-.5-1.438-3-3.28-.406Zm8.625.406-1.406 3 .844.5a7.293 7.293 0 0 0 4.094-2.969l-.22-.937-3.312.406Z"
      fill="url(#Football_svg__b)"
    />
    <defs>
      <linearGradient
        id="Football_svg__a"
        x1={0.5}
        y1={15.5}
        x2={17.111}
        y2={12.41}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE6B8B" />
        <stop offset={1} stopColor="#FF8E53" />
      </linearGradient>
      <linearGradient
        id="Football_svg__b"
        x1={0.5}
        y1={14.75}
        x2={17.121}
        y2={11.686}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE6B8B" />
        <stop offset={1} stopColor="#FF8E53" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgFootball;
