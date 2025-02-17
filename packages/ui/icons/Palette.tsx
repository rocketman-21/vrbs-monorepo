import { SVGProps } from "react";

const SvgPalette = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#Palette_svg__a)">
      <path
        opacity={0.4}
        d="M6.384.157C3.278.763.774 3.26.162 6.357c-1.156 5.844 4.116 10.2 8.088 9.584 1.287-.2 1.918-1.706 1.328-2.865C8.856 11.657 9.888 10 11.48 10h2.49c1.12 0 2.025-.925 2.029-2.041C15.984 3.036 11.503-.84 6.384.157ZM3 10.001a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
        fill="url(#Palette_svg__b)"
      />
      <path
        d="M3 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
        fill="url(#Palette_svg__c)"
      />
    </g>
    <defs>
      <linearGradient
        id="Palette_svg__b"
        x1={0}
        y1={15.999}
        x2={17.752}
        y2={12.793}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE6B8B" />
        <stop offset={1} stopColor="#FF8E53" />
      </linearGradient>
      <linearGradient
        id="Palette_svg__c"
        x1={2}
        y1={10}
        x2={13.871}
        y2={7.052}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE6B8B" />
        <stop offset={1} stopColor="#FF8E53" />
      </linearGradient>
      <clipPath id="Palette_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgPalette;
