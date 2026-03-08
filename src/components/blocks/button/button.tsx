import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

import { ButtonSpinner } from "../button-spinner/button-spinner";
import { buttonVariants } from "./button.styles";
import {
  ButtonVariant,
  ButtonIntent,
  ButtonSize,
  ButtonLoadingPosition,
  ButtonGlowIntensity,
  ButtonRounded,
} from "./button.types";
import { ButtonIcon } from "./internal/button-icon";
import { ButtonSlot } from "./internal/button-slot";
import { ButtonText } from "./internal/button-text";

type ButtonAsButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  href?: never;
};

type ButtonAsAnchorProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "disabled" | "type"
> & {
  href: string;
  disabled?: never;
  type?: never;
};

type ButtonElementProps =
  | Omit<ButtonAsButtonProps, "onClick">
  | Omit<ButtonAsAnchorProps, "onClick">;

export type ButtonProps = ButtonElementProps & {
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingPosition?: ButtonLoadingPosition; // "overlay" | "left" | "right"
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glowIntensity?: ButtonGlowIntensity;
  rounded?: ButtonRounded;
  elevated?: boolean;
  analyticsId?: string;
  testId?: string;
  asChild?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

const isTextOrNumberChild = (children: React.ReactNode) => {
  const arr = React.Children.toArray(children);
  return (
    arr.length === 1 &&
    (typeof arr[0] === "string" || typeof arr[0] === "number")
  );
};

const hasKnownSlotChild = (children: React.ReactNode) =>
  React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const slot = (child.props as any)?.["data-slot"];
    return slot === "icon" || slot === "text" || slot === "spinner";
  });

export const ButtonRoot = React.forwardRef<HTMLElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = "primary",
      intent = "default",
      size = "md",
      fullWidth = false,
      disabled = false,
      loading = false,
      loadingText,
      loadingPosition = "overlay",
      leftIcon,
      rightIcon,
      glowIntensity,
      rounded = "lg",
      elevated = false,
      analyticsId,
      testId,
      asChild = false,
      className,
      onClick,
      tabIndex,
      children,
      type,
      ...rest
    } = props;

    const isLoading = Boolean(loading);
    const isDisabled = Boolean(disabled) || isLoading;

    const isAnchor =
      "href" in props &&
      typeof (props as ButtonAsAnchorProps).href === "string" &&
      (props as ButtonAsAnchorProps).href.length > 0;

    const Comp: React.ElementType = asChild ? Slot : isAnchor ? "a" : "button";

    const resolvedType = !asChild && !isAnchor ? type ?? "button" : undefined;

    const resolvedTabIndex =
      (asChild || isAnchor) && isDisabled ? -1 : tabIndex;

    // optional hardening: prevent leaking invalid attrs to <a> / Slot
    const restProps = { ...rest } as any;
    if (asChild || isAnchor) {
      delete restProps.disabled;
      delete restProps.type;
    }

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      },
      [isDisabled, onClick],
    );

    const showOverlay = loadingPosition === "overlay";
    const isGlowEnabled = glowIntensity !== undefined;
    const resolvedGlowIntensity = glowIntensity ?? "none";

    const compound =
      hasKnownSlotChild(children) || React.Children.count(children) === 0;

    const content =
      compound || !isTextOrNumberChild(children) ? (
        children
      ) : (
        <ButtonText>{children}</ButtonText>
      );

    return (
      <Comp
        ref={ref}
        // only for native <button> rendering
        type={resolvedType}
        disabled={!asChild && !isAnchor ? isDisabled : undefined}
        // for asChild or anchor-ish rendering
        aria-disabled={asChild || isAnchor ? isDisabled : undefined}
        aria-busy={isLoading || undefined}
        data-slot="button"
        data-variant={variant}
        data-intent={intent}
        data-size={size}
        data-loading={isLoading ? "true" : "false"}
        data-disabled={isDisabled ? "true" : "false"}
        data-loading-position={loadingPosition}
        data-glow={isGlowEnabled ? "true" : "false"}
        data-elevated={elevated ? "true" : "false"}
        data-rounded={rounded}
        data-analytics-id={analyticsId}
        data-testid={testId}
        className={cn(
          "relative",
          buttonVariants({
            variant,
            intent,
            size,
            fullWidth,
            rounded,
            elevated,
            glowIntensity: resolvedGlowIntensity,
          }),
          className,
        )}
        onClick={handleClick}
        tabIndex={resolvedTabIndex}
        {...restProps}
      >
        {asChild ? (
          children
        ) : (
          <>
            {showOverlay ? (
              <span
                data-slot="overlay"
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 inline-flex items-center justify-center transition-opacity",
                  isLoading ? "opacity-100" : "opacity-0",
                )}
              >
                <ButtonSpinner />
              </span>
            ) : null}

            <span
              data-slot="content"
              className={cn(
                "inline-flex min-w-0 items-center justify-center gap-2",
                showOverlay && isLoading ? "opacity-0" : "opacity-100",
              )}
            >
              <ButtonSlot
                position="left"
                icon={leftIcon}
                showSpinner={loadingPosition === "left"}
                isLoading={isLoading}
              />
              {content}
              <ButtonSlot
                position="right"
                icon={rightIcon}
                showSpinner={loadingPosition === "right"}
                isLoading={isLoading}
              />
            </span>

            {isLoading && loadingText ? (
              <span className="sr-only" aria-live="polite">
                {loadingText}
              </span>
            ) : null}
          </>
        )}
      </Comp>
    );
  },
);

ButtonRoot.displayName = "Button";

type ButtonComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
> & {
  Icon: typeof ButtonIcon;
  Spinner: typeof ButtonSpinner;
  Text: typeof ButtonText;
};

const Button = ButtonRoot as ButtonComponent;
Button.Icon = ButtonIcon;
Button.Spinner = ButtonSpinner;
Button.Text = ButtonText;

export { Button, ButtonIcon, ButtonSpinner, ButtonText };
