import React from "react";
import { cn } from "../../../lib/utils";

export type IconSlotPosition = "left" | "right";

export interface IconSlotProps extends React.ComponentPropsWithoutRef<"span"> {
  position?: IconSlotPosition;
}

export const IconSlot = React.forwardRef<HTMLSpanElement, IconSlotProps>(
  ({ position = "left", className, ...rest }, ref) => (
    <span
      data-slot="icon"
      data-position={position}
      ref={ref}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-current [&>svg]:h-full [&>svg]:w-full [&>svg]:shrink-0",
        className,
      )}
      {...rest}
    />
  ),
);

IconSlot.displayName = "IconSlot";
