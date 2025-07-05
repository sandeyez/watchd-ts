import { ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
};

export function GradientText({ children }: GradientTextProps) {
  return (
    <div className="block h-fit w-fit whitespace-nowrap [&>*]:!bg-gradient-to-r [&>*]:!from-sky-500 [&>*]:!to-fuchsia-500 [&>*]:!inline-block [&>*]:!text-transparent [&>*]:!bg-clip-text">
      {children}
    </div>
  );
}
