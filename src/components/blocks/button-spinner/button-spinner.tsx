import React from "react";
import { cn } from "../../../lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

export interface ButtonSpinnerProps
  extends React.ComponentPropsWithoutRef<"span"> {
  size?: SpinnerSize;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-3 w-3 border-[2px]",
  md: "h-4 w-4 border-[2px]",
  lg: "h-5 w-5 border-[3px]",
};

export const ButtonSpinner = React.forwardRef<
  HTMLSpanElement,
  ButtonSpinnerProps
>(({ className, size = "md", "aria-hidden": ariaHiddenProp, ...rest }, ref) => {
  const ariaHidden = ariaHiddenProp ?? true;

  return (
    <span
      ref={ref}
      data-slot="spinner"
      data-size={size}
      aria-hidden={ariaHidden}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-current border-t-transparent transition-opacity animate-spin motion-reduce:animate-none",
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
});

ButtonSpinner.displayName = "Button.Spinner";
