import { SVGProps } from "react";

const SvgMusic = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 0c-.085 0-.22.02-.3.047l-.7.206v8.9A3.505 3.505 0 0 0 13 9c-1.657 0-2.972 1.12-2.972 2.472 0 1.38 1.343 2.472 2.972 2.472 1.628 0 2.972-1.12 2.972-2.5L16 1c-.028-.552-.447-1-1-1ZM4 3.953v7.2A3.504 3.504 0 0 0 3 11c-1.657 0-3 1.119-3 2.5S1.343 16 2.972 16s2.972-1.118 2.972-2.498L6 2.615 4.7 3c-.384.122-.7.548-.7.954Z" />
    <path opacity={0.4} d="M6 7V2.613l8-2.362v4.403L6 7Z" />
  </svg>
);

export default SvgMusic;
