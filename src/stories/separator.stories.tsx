import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Separator,
  SEPARATOR_ORNAMENTS,
  renderSeparatorActionButton,
  separatorNode,
} from "../components/separator"

const meta: Meta<typeof Separator> = {
  title: "Platform Components/Layout System/Separator",
  component: Separator,
  parameters: {
    layout: "padded",
    docs: {
      story: { inline: true },
    },
  },
  args: {
    orientation: "horizontal",
    variant: "solid",
    thickness: 1,
    color: "#E6C36A",
    centerColor: "#38BDF8",
    curved: false,
    fadeEnds: false,
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical", "diagonal-down", "diagonal-up"],
    },
    variant: {
      control: "select",
      options: ["solid", "dotted", "long-dotted", "double", "ornament", "icon", "text"],
    },
    color: {
      control: "color",
    },
    centerColor: {
      control: "color",
    },
    trackExtent: {
      control: "text",
    },
    ornament: {
      control: "select",
      options: Object.keys(SEPARATOR_ORNAMENTS),
    },
    ornamentCount: {
      control: { type: "number", min: 0, max: 12, step: 1 },
    },
    thickness: {
      control: { type: "number", min: 1, max: 12, step: 1 },
    },
    curved: {
      control: "boolean",
    },
    fadeEnds: {
      control: "boolean",
    },
    fadeColorClassName: {
      control: "text",
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    icons: {
      control: false,
      table: { disable: true },
    },
    text: {
      control: "text",
    },
    edgeStart: {
      control: false,
      table: { disable: true },
    },
    edgeEnd: {
      control: false,
      table: { disable: true },
    },
    renderIconButton: {
      control: false,
      table: { disable: true },
    },
    hideCenterContent: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>
const STORY_SURFACE_STYLE: React.CSSProperties = { width: "min(100%, 42rem)" }
const renderIconButtonForStory: React.ComponentProps<typeof Separator>["renderIconButton"] = (config) =>
  renderSeparatorActionButton(config)

const renderPlayground = (args: React.ComponentProps<typeof Separator>) => {
  if (args.orientation === "vertical") {
    return (
      <div className="flex h-24 items-center gap-4">
        <span>Left</span>
        <Separator {...args} />
        <span>Right</span>
      </div>
    )
  }

  if (args.orientation === "diagonal-down" || args.orientation === "diagonal-up") {
    return (
      <div className="space-y-3" style={STORY_SURFACE_STYLE}>
        <div className="text-sm">Top content</div>
        <Separator {...args} />
        <div className="text-sm">Bottom content</div>
      </div>
    )
  }

  return (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  )
}

export const Horizontal: Story = {
  render: (args) => renderPlayground(args),
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-20 items-center gap-4">
      <span>Left</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
}

export const DiagonalDown: Story = {
  args: {
    orientation: "diagonal-down",
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top-left</div>
      <Separator {...args} />
      <div className="text-right text-sm">Bottom-right</div>
    </div>
  ),
}

export const DiagonalUp: Story = {
  args: {
    orientation: "diagonal-up",
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top-right</div>
      <Separator {...args} />
      <div className="text-left text-sm">Bottom-left</div>
    </div>
  ),
}

export const Dotted: Story = {
  args: {
    variant: "dotted",
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const LongDotted: Story = {
  args: {
    variant: "long-dotted",
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const Double: Story = {
  args: {
    variant: "double",
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const Ornament: Story = {
  args: {
    variant: "ornament",
    ornament: "flower",
    ornamentCount: 1,
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const OrnamentLibrary: Story = {
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      {Object.entries(SEPARATOR_ORNAMENTS).filter(([ornamentKey]) => ornamentKey !== "none").map(([ornamentKey, ornamentSymbol]) => (
        <div key={ornamentKey} className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {ornamentKey} ({ornamentSymbol})
          </div>
          <Separator {...args} variant="ornament" ornament={ornamentKey} ornamentCount={3} />
        </div>
      ))}
    </div>
  ),
}

export const TextCentered: Story = {
  args: {
    variant: "text",
    text: "Section",
    thickness: 2,
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const IconCentered: Story = {
  args: {
    variant: "icon",
    color: "#E6C36A",
    centerColor: "#38BDF8",
    thickness: 2,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        type: "code",
        code: "<Separator variant=\"icon\" icon={separatorNode(\"✦\")} />",
      },
    },
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator
        {...args}
        variant="icon"
        color="#E6C36A"
        centerColor="#38BDF8"
        thickness={2}
        icon={separatorNode("✦")}
      />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const IconSequence: Story = {
  args: {
    variant: "icon",
    color: "#E6C36A",
    centerColor: "#38BDF8",
    thickness: 2,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        type: "code",
        code: "<Separator variant=\"icon\" icons={[separatorNode(\"✦\"), separatorNode(\"♥\"), separatorNode(\"★\")]} />",
      },
    },
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator
        {...args}
        variant="icon"
        color="#E6C36A"
        centerColor="#38BDF8"
        thickness={2}
        icons={[
          separatorNode("✦"),
          separatorNode("♥"),
          separatorNode("★"),
        ]}
      />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const OrnamentMultiple: Story = {
  args: {
    variant: "ornament",
    ornamentCount: 4,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        type: "code",
        code: "<Separator variant=\"ornament\" ornament=\"flower\" ornamentCount={4} />",
      },
    },
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} variant="ornament" ornament="flower" ornamentCount={4} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const OrnamentEdges: Story = {
  args: {
    variant: "ornament",
    ornamentCount: 3,
    edgeStart: separatorNode("✿"),
    edgeEnd: separatorNode("✿"),
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        type: "code",
        code: "<Separator variant=\"ornament\" ornament=\"flower\" ornamentCount={3} edgeStart={separatorNode(\"✿\")} edgeEnd={separatorNode(\"✿\")} />",
      },
    },
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator
        {...args}
        variant="ornament"
        ornament="flower"
        ornamentCount={3}
        edgeStart={separatorNode("✿")}
        edgeEnd={separatorNode("✿")}
      />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const ClickableIcons: Story = {
  args: {
    variant: "icon",
    color: "#E6C36A",
    centerColor: "#38BDF8",
    thickness: 2,
    decorative: false,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        type: "code",
        code: "<Separator variant=\"icon\" decorative={false} icons={[...]} />",
      },
    },
  },
  render: (args) => {
    const [activeId, setActiveId] = React.useState("sparkles")
    const [lastAction, setLastAction] = React.useState("sparkles")
    const buildIconButton = (
      id: string,
      label: string,
      iconGlyph: string,
      extra?: { edge?: "start" | "end" },
    ) => ({
      kind: "icon-button" as const,
      id,
      icon: <span className="text-black text-xs leading-none">{iconGlyph}</span>,
      alt: label,
      title: label,
      className: "!text-black",
      description:
        extra?.edge === "start"
          ? "Action attached to the start edge icon."
          : extra?.edge === "end"
            ? "Action attached to the end edge icon."
            : "Action attached to a center icon.",
      active: activeId === id,
      onClick: () => {
        setActiveId(id)
        setLastAction(id)
      },
    })

    return (
      <div className="space-y-3" style={STORY_SURFACE_STYLE}>
        <div className="text-sm">Last action: {lastAction}</div>
        <Separator
          {...args}
          variant="icon"
          color="#E6C36A"
          centerColor="#38BDF8"
          thickness={2}
          decorative={false}
          renderIconButton={renderIconButtonForStory}
          edgeStart={buildIconButton("edge-start", "Edge Start", "S", {
            edge: "start",
          })}
          icons={[
            buildIconButton("sparkles", "Sparkles", "✦"),
            buildIconButton("heart", "Heart", "♥"),
          ]}
          edgeEnd={buildIconButton("edge-end", "Edge End", "E", {
            edge: "end",
          })}
        />
        <div className="text-sm">Bottom content</div>
      </div>
    )
  },
}

export const CurvedWave: Story = {
  args: {
    variant: "solid",
    curved: true,
    thickness: 2,
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const HiddenCenterContent: Story = {
  args: {
    variant: "ornament",
    hideCenterContent: true,
    color: "#E6C36A",
    thickness: 2,
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}

export const WithFadingEnds: Story = {
  args: {
    fadeEnds: true,
    fadeColorClassName: "via-[#E6C36A]/75",
  },
  render: (args) => (
    <div className="space-y-3" style={STORY_SURFACE_STYLE}>
      <div className="text-sm">Top content</div>
      <Separator {...args} />
      <div className="text-sm">Bottom content</div>
    </div>
  ),
}


