import type { ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
};

export function GradientText({ children }: GradientTextProps) {
  return (
    <div className="block h-fit w-fit whitespace-nowrap [&>*]:!bg-gradient-to-r [&>*]:!from-main-blue [&>*]:!to-main-pink [&>*]:!inline-block [&>*]:!text-transparent [&>*]:!bg-clip-text">
      {children}
    </div>
  );
}
