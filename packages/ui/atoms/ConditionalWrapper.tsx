import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  condition: boolean;
  wrapper: (children: ReactNode) => JSX.Element;
}>;

export const ConditionalWrapper = ({ condition, wrapper, children }: Props) => {
  return condition && wrapper ? wrapper(children) : <>{children}</>;
};
