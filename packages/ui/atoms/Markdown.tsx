import MarkdownJsx, { MarkdownToJSX } from "markdown-to-jsx";
import { Fragment } from "react";

interface Props {
  children: string;
  options?: MarkdownToJSX.Options;
}

export const Markdown = (props: Props) => {
  let { children = "", options } = props;

  if (children.includes("\\n")) {
    // eslint-disable-next-line no-param-reassign
    children = children.replaceAll("\\n", "\n");
  }

  if (children.startsWith('"') && children.endsWith('"')) {
    // eslint-disable-next-line no-param-reassign
    children = children.slice(1, -1);
  }

  return (
    <MarkdownJsx
      options={{
        overrides: {
          a: { props: { target: "_blank", className: "underline break-words" } },
          li: { props: { className: "break-words" } },
          p: { props: { className: "break-words" } },
          ...options?.overrides,
        },
        wrapper: Fragment,
        ...options,
      }}
    >
      {children}
    </MarkdownJsx>
  );
};

export default Markdown;
