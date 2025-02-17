import { CSSProperties, PropsWithChildren } from "react";

interface Props {
  className?: string;
}

export const GradientCard = (props: PropsWithChildren<Props>) => {
  const { className = "", children } = props;

  return (
    <div
      style={
        {
          "--color": "253 224 71",
          "--bg-color": `linear-gradient(var(--color-bg), var(--color-bg))`,
          "--border-color": `linear-gradient(145deg,
          var(--color-lead-400) 0%,
          var(--color-lead-300) 33.33%,
          var(--color-lead-200) 66.67%,
          var(--color-lead-100) 100%)
        `,
        } as CSSProperties
      }
      className={`rounded-xl border-2 border-transparent [background:padding-box_var(--bg-color),border-box_var(--border-color)] ${className}`}
    >
      {children}
    </div>
  );
};
