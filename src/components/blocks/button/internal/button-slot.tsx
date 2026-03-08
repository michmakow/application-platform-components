import type { ReactNode } from "react";
import { cn } from "../../../../lib/utils";
import { ButtonSpinner } from "../../button-spinner/button-spinner";
import { ButtonIcon } from "./button-icon";

interface ButtonSlotProps {
  position?: "left" | "right";
  icon?: ReactNode;
  showSpinner?: boolean;
  isLoading?: boolean;
}

export const ButtonSlot = ({
  position = "left",
  icon,
  showSpinner = false,
  isLoading = false,
}: ButtonSlotProps) => {
  if (!icon && !showSpinner) return null;

  const spinnerVisible = showSpinner && isLoading;

  return (
    <span
      data-slot="icon-slot"
      data-position={position}
      className="relative inline-flex shrink-0 items-center justify-center"
    >
      {icon && (
        <ButtonIcon
          position={position}
          aria-hidden
          className={cn(spinnerVisible && "opacity-0")}
        >
          {icon}
        </ButtonIcon>
      )}

      {showSpinner && (
        <ButtonSpinner
          aria-hidden
          className={cn(
            icon && "absolute pointer-events-none",
            spinnerVisible ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
};
