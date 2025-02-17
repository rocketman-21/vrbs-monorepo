import { SVGProps } from "react";

const SvgEmptyPlaceholder = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} />
);

export default SvgEmptyPlaceholder;
