import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardAction,
  CardContent,
  type CardRounded,
  type CardShadow,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card"
import { Button, type ButtonIntent, type ButtonSize, type ButtonVariant } from "../components/blocks/button"

const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger", "link"]
const BUTTON_INTENTS: ButtonIntent[] = ["default", "positive", "negative", "warning", "info"]
const BUTTON_SIZES: ButtonSize[] = ["xs", "sm", "md", "lg"]
const CARD_ROUNDED_OPTIONS: CardRounded[] = ["none", "sm", "md", "lg", "xl", "2xl", "3xl"]
const CARD_SHADOW_OPTIONS: CardShadow[] = ["none", "sm", "md", "lg", "xl"]

type CardStoryArgs = {
  className: string
  glow: boolean
  border: boolean
  rounded: number
  borderColor: string
  shadow: CardShadow
  shadowColor: string
  showHeader: boolean
  headerClassName: string
  showTitle: boolean
  title: string
  titleClassName: string
  showDescription: boolean
  description: string
  descriptionClassName: string
  showAction: boolean
  actionClassName: string
  actionButtonLabel: string
  actionButtonVariant: ButtonVariant
  actionButtonIntent: ButtonIntent
  actionButtonSize: ButtonSize
  showContent: boolean
  content: string
  contentClassName: string
  contentTextClassName: string
  showFooter: boolean
  footerClassName: string
  footerButtonLabel: string
  footerButtonVariant: ButtonVariant
  footerButtonIntent: ButtonIntent
  footerButtonSize: ButtonSize
}

const meta: Meta<CardStoryArgs> = {
  title: "Platform Components/Layout System/Card",
  component: Card,
  args: {
    className: "",
    glow: false,
    border: true,
    rounded: CARD_ROUNDED_OPTIONS.indexOf("xl"),
    borderColor: "",
    shadow: "sm",
    shadowColor: "",
    showHeader: true,
    headerClassName: "",
    showTitle: true,
    title: "Profile",
    titleClassName: "",
    showDescription: true,
    description: "Manage your personal settings.",
    descriptionClassName: "",
    showAction: true,
    actionClassName: "",
    actionButtonLabel: "Edit",
    actionButtonVariant: "link",
    actionButtonIntent: "default",
    actionButtonSize: "sm",
    showContent: true,
    content: "Update your details and preferences.",
    contentClassName: "",
    contentTextClassName: "text-sm text-muted-foreground",
    showFooter: true,
    footerClassName: "",
    footerButtonLabel: "Save changes",
    footerButtonVariant: "primary",
    footerButtonIntent: "default",
    footerButtonSize: "md",
  },
  argTypes: {
    className: { control: "text" },
    glow: { control: "boolean" },
    border: { control: "boolean" },
    rounded: {
      control: {
        type: "range",
        min: 0,
        max: CARD_ROUNDED_OPTIONS.length - 1,
        step: 1,
      },
      description: CARD_ROUNDED_OPTIONS.map((option, index) => `${index}:${option}`).join(", "),
    },
    borderColor: { control: "color" },
    shadow: { control: "select", options: CARD_SHADOW_OPTIONS },
    shadowColor: { control: "color" },
    showHeader: { control: "boolean" },
    headerClassName: { control: "text" },
    showTitle: { control: "boolean" },
    title: { control: "text" },
    titleClassName: { control: "text" },
    showDescription: { control: "boolean" },
    description: { control: "text" },
    descriptionClassName: { control: "text" },
    showAction: { control: "boolean" },
    actionClassName: { control: "text" },
    actionButtonLabel: { control: "text" },
    actionButtonVariant: { control: "select", options: BUTTON_VARIANTS },
    actionButtonIntent: { control: "select", options: BUTTON_INTENTS },
    actionButtonSize: { control: "select", options: BUTTON_SIZES },
    showContent: { control: "boolean" },
    content: { control: "text" },
    contentClassName: { control: "text" },
    contentTextClassName: { control: "text" },
    showFooter: { control: "boolean" },
    footerClassName: { control: "text" },
    footerButtonLabel: { control: "text" },
    footerButtonVariant: { control: "select", options: BUTTON_VARIANTS },
    footerButtonIntent: { control: "select", options: BUTTON_INTENTS },
    footerButtonSize: { control: "select", options: BUTTON_SIZES },
  },
}

export default meta
type Story = StoryObj<CardStoryArgs>

export const Default: Story = {
  render: (args) => {
    const headerVisible = args.showHeader && (args.showTitle || args.showDescription || args.showAction)
    const resolvedClassName = args.className ? `max-w-md ${args.className}` : "max-w-md"
    const roundedIndex = Math.min(
      CARD_ROUNDED_OPTIONS.length - 1,
      Math.max(0, Math.round(args.rounded))
    )
    const resolvedRounded = CARD_ROUNDED_OPTIONS[roundedIndex]

    return (
      <Card
        className={resolvedClassName}
        glow={args.glow}
        border={args.border}
        rounded={resolvedRounded}
        borderColor={args.borderColor || undefined}
        shadow={args.shadow}
        shadowColor={args.shadowColor || undefined}
      >
        {headerVisible ? (
          <CardHeader className={args.headerClassName || undefined}>
            {args.showTitle ? (
              <CardTitle className={args.titleClassName || undefined}>{args.title}</CardTitle>
            ) : null}
            {args.showDescription ? (
              <CardDescription className={args.descriptionClassName || undefined}>
                {args.description}
              </CardDescription>
            ) : null}
            {args.showAction ? (
              <CardAction className={args.actionClassName || undefined}>
                <Button
                  className="cursor-pointer"
                  size={args.actionButtonSize}
                  variant={args.actionButtonVariant}
                  intent={args.actionButtonIntent}
                >
                  {args.actionButtonLabel}
                </Button>
              </CardAction>
            ) : null}
          </CardHeader>
        ) : null}

        {args.showContent ? (
          <CardContent className={args.contentClassName || undefined}>
            <p className={args.contentTextClassName || undefined}>{args.content}</p>
          </CardContent>
        ) : null}

        {args.showFooter ? (
          <CardFooter className={args.footerClassName || undefined}>
            <Button
              className="cursor-pointer"
              variant={args.footerButtonVariant}
              intent={args.footerButtonIntent}
              size={args.footerButtonSize}
            >
              {args.footerButtonLabel}
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    )
  },
}
