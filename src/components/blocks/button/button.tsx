import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

import { ButtonSpinner } from "../button-spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../utility/tooltip";
import { buttonVariants } from "./button.styles";
import {
  ButtonIconButtonVariant,
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
  iconOnly?: boolean;
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
      iconOnly = false,
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
        data-icon-only={iconOnly ? "true" : "false"}
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
            iconOnly,
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

export type ButtonIconButtonProps = Omit<
  ButtonProps,
  | "children"
  | "leftIcon"
  | "rightIcon"
  | "variant"
  | "intent"
  | "fullWidth"
  | "loading"
  | "loadingText"
  | "loadingPosition"
  | "glowIntensity"
  | "rounded"
  | "elevated"
  | "asChild"
  | "href"
  | "type"
> & {
  id: string;
  icon: React.ReactNode | string;
  alt: string;
  title?: string;
  description?: string;
  variant?: ButtonIconButtonVariant;
  showDot?: boolean;
  dotTitle?: string;
  badgeContent?: number | string;
  active?: boolean;
  comingSoon?: string;
  showTooltip?: boolean;
};

export const ButtonIconButton = React.forwardRef<HTMLElement, ButtonIconButtonProps>(
  (props, ref) => {
    const {
      id,
      icon,
      alt,
      title,
      description,
      onClick,
      disabled,
      variant = "utility",
      size = "lg",
      showDot = false,
      dotTitle,
      badgeContent,
      active = false,
      comingSoon,
      showTooltip = false,
      className,
      ...rest
    } = props;

    const isDisabled = Boolean(disabled) || Boolean(comingSoon);

    const iconTone =
      variant === "primary"
        ? "[filter:brightness(1.06)_contrast(1.10)_saturate(1.10)]"
        : variant === "secondary"
          ? "[filter:brightness(1.08)_contrast(1.06)_saturate(0.92)]"
          : "[filter:brightness(1.14)_contrast(1.06)_saturate(0.88)]";

    const glowTone =
      variant === "primary"
        ? "bg-[radial-gradient(circle_at_center,rgba(255,210,111,0.24),transparent_62%)]"
        : variant === "secondary"
          ? "bg-[radial-gradient(circle_at_center,rgba(230,235,240,0.16),transparent_62%)]"
          : "bg-[radial-gradient(circle_at_center,rgba(230,235,240,0.18),transparent_62%)]";

    const activeFrame = active
      ? "bg-[#E6C36A]/12 border-[#E6C36A]/70 shadow-[0_0_0_1px_rgba(230,195,106,0.25),0_0_18px_rgba(230,195,106,0.20)]"
      : "";

    const activeIconBoost = active
      ? "opacity-100 [filter:brightness(1.22)_contrast(1.10)_saturate(1.06)]"
      : "";

    const iconClasses = cn(
      "relative h-4 w-4 sm:h-7 sm:w-7 opacity-95 drop-shadow-[0_0_10px_rgba(0,0,0,0.55)]",
      iconTone,
      activeIconBoost,
      comingSoon ? "opacity-80" : "",
    );

    const iconButtonElement = (
      <ButtonRoot
        ref={ref}
        {...rest}
        type="button"
        variant="ghost"
        size={size}
        iconOnly
        rounded="full"
        aria-label={alt}
        aria-current={active ? "page" : undefined}
        data-nav-button="true"
        data-nav-id={id}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        className={cn(
          "group !h-auto !w-auto rounded-3xl border border-transparent p-3 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E6C36A]/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#001629]",
          !isDisabled && "cursor-pointer hover:bg-[#E6C36A]/10 hover:border-[#E6C36A]/60 active:scale-[0.98]",
          isDisabled && "cursor-default opacity-60",
          activeFrame,
          className,
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-1.5 rounded-full blur-[10px] transition-opacity duration-300",
            glowTone,
            active
              ? "opacity-95"
              : isDisabled
                ? "opacity-0"
                : "opacity-0 group-hover:opacity-90 group-focus-visible:opacity-90",
          )}
        />

        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0.5 rounded-full ring-1 ring-white/5",
            active ? "opacity-95" : "opacity-70",
          )}
        />

        {active && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_30%,rgba(255,210,111,0.16),transparent_55%)]"
          />
        )}

        {showDot && (
          <span
            title={dotTitle}
            className="absolute right-1.5 top-2.5 z-30 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#FFD26F] px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-[#0B1526] shadow-[0_0_12px_rgba(255,210,111,0.70)]"
          >
            {badgeContent ?? ""}
          </span>
        )}

        {typeof icon === "string" ? (
          <img src={icon} alt="" aria-hidden className={iconClasses} />
        ) : (
          <span
            aria-hidden
            className={cn(
              "relative inline-flex h-4 w-4 items-center justify-center sm:h-7 sm:w-7 [&>svg]:h-full [&>svg]:w-full [&>svg]:shrink-0",
              iconClasses,
            )}
          >
            {icon}
          </span>
        )}
      </ButtonRoot>
    );

    if (!showTooltip) {
      return iconButtonElement;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{iconButtonElement}</TooltipTrigger>

        <TooltipContent
          side="bottom"
          align="center"
          className="w-fit border border-white/10 bg-[#0B1526]/95 text-center text-[#E6EBF0] shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="text-sm font-semibold text-[#E6C36A]">{title ?? alt}</div>
              {comingSoon && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#E6C36A]/85">
                  {comingSoon}
                </span>
              )}
            </div>

            {description ? (
              <div className="text-xs leading-snug text-[#C6CED7]">{description}</div>
            ) : null}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  },
);

ButtonIconButton.displayName = "Button.IconButton";

type ButtonComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
> & {
  Icon: typeof ButtonIcon;
  Spinner: typeof ButtonSpinner;
  Text: typeof ButtonText;
  IconButton: typeof ButtonIconButton;
};

const Button = ButtonRoot as ButtonComponent;
Button.Icon = ButtonIcon;
Button.Spinner = ButtonSpinner;
Button.Text = ButtonText;
Button.IconButton = ButtonIconButton;

export { Button, ButtonIcon, ButtonSpinner, ButtonText };
