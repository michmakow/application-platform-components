import React from "react";
import { cn } from "../../../../lib/utils";

export type ButtonTextProps = React.ComponentPropsWithoutRef<"span">;

export const ButtonText = React.forwardRef<HTMLSpanElement, ButtonTextProps>(
  ({ className, ...rest }, ref) => (
    <span
      data-slot="text"
      ref={ref}
      className={cn("inline-flex min-w-0 items-center justify-center truncate", className)}
      {...rest}
    />
  )
);

ButtonText.displayName = "Button.Text";