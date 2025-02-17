import { SVGProps } from "react";

const SvgBookChroma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#BookChroma_svg__a)" fill="#2F80ED">
      <path d="M4.625 12h8.313c.724 0 1.312-.672 1.312-1.5v-9c0-.828-.588-1.5-1.313-1.5H4.626C3.175 0 2 1.343 2 3v10c0 1.657 1.175 3 2.625 3h8.75c.483 0 .875-.448.875-.972 0-.581-.391-1.028-.875-1.028H4.663c-.457 0-.865-.382-.908-.902-.05-.595.358-1.098.87-1.098Zm1.288-8h5.25c.265 0 .462.225.462.5s-.197.5-.438.5H5.913c-.216 0-.413-.225-.413-.5s.197-.5.413-.5Zm0 2h5.25c.265 0 .462.225.462.5s-.197.5-.438.5H5.913c-.216 0-.413-.225-.413-.5s.197-.5.413-.5Z" />
      <path
        opacity={0.4}
        d="M12.938 11.5H4.624a.875.875 0 0 0 0 1.75h8.75v-1.83c-.161.047-.284.08-.438.08Z"
      />
    </g>
    <defs>
      <clipPath id="BookChroma_svg__a">
        <path fill="#fff" transform="translate(2 1)" d="M0 0h12.25v14H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgBookChroma;
