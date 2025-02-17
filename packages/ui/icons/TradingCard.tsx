import { SVGProps } from "react";

const SvgTradingCard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect opacity={0.3} width={13.333} height={16} rx={1.067} fill="url(#TradingCard_svg__a)" />
    <path
      d="M3.162 12.783h7.343a.652.652 0 0 0 .644-.643.652.652 0 0 0-.644-.644H3.162a.652.652 0 0 0-.643.644c0 .348.295.643.643.643ZM2.667 8.89h7.92c.524 0 1.168 0 1.168-.89V2.76a.653.653 0 0 0-.644-.644H2.33a.653.653 0 0 0-.644.644V8c0 .487.093.889.982.889Z"
      fill="url(#TradingCard_svg__b)"
    />
    <defs>
      <linearGradient
        id="TradingCard_svg__a"
        x1={0}
        y1={16}
        x2={14.938}
        y2={13.752}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE6B8B" />
        <stop offset={1} stopColor="#FF8E53" />
      </linearGradient>
      <linearGradient
        id="TradingCard_svg__b"
        x1={1.685}
        y1={12.783}
        x2={12.896}
        y2={10.872}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE6B8B" />
        <stop offset={1} stopColor="#FF8E53" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgTradingCard;
