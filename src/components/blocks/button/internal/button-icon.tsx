import React from "react";
import { IconSlotProps, IconSlot } from "../../icon-slot/icon-slot";

export interface ButtonIconProps extends IconSlotProps {}

export const ButtonIcon = React.forwardRef<HTMLSpanElement, ButtonIconProps>(
  (props, ref) => <IconSlot ref={ref} {...props} />,
);

ButtonIcon.displayName = "Button.Icon";
