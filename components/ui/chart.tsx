"use client"

import * as React from "react"
import type { ChartConfig } from "@/types"

const ChartContext = React.createContext<ChartConfig | null>(null)

function ChartContainer({
  config,
  children,
  className,
}: {
  config: ChartConfig
  children: React.ReactNode
  className?: string
}) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={className}
        style={
          {
            "--color-primary": config.primary?.color,
            "--color-secondary": config.secondary?.color,
            "--color-tertiary": config.tertiary?.color,
            "--color-muted": "hsl(var(--muted))",
            ...Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color])),
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

function ChartTooltip({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-background p-2 shadow-sm">{children}</div>
}

function ChartTooltipContent() {
  const config = React.useContext(ChartContext)

  return (
    <ChartTooltip>
      {({ payload, label, active }) => {
        if (!active || !payload?.length || !config) {
          return null
        }

        return (
          <div className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <div className="grid gap-0.5">
              {payload.map((item: any, i) => {
                const color = item.color ?? config[item.dataKey]?.color

                return (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                      <p className="text-xs text-muted-foreground">{config[item.dataKey]?.label ?? item.name}</p>
                    </div>
                    <p className="text-xs font-medium">{item.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    </ChartTooltip>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
