import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type MovieStatProps = {
  icon: ReactNode;
  tooltipText: string;
  children?: ReactNode;
};

export function MovieStat({ children, icon, tooltipText }: MovieStatProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 [&>svg]:size-4">
          {icon}
          <span>{children}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
