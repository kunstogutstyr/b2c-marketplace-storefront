"use client"

import { useEffect, useMemo, useState, type TransitionEvent } from "react"

type HeroVendorTickerProps = {
  names: string[]
  holdMs?: number
  slideMs?: number
  fade?: boolean
}

export const HeroVendorTicker = ({
  names,
  holdMs = 3200,
  slideMs = 700,
  fade = true,
}: HeroVendorTickerProps) => {
  const items = useMemo(() => {
    const cleaned = names.map((name) => name.trim()).filter(Boolean)
    return cleaned.length ? cleaned : ["Vendors"]
  }, [names])

  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [disableTransition, setDisableTransition] = useState(true)

  const nextIndex = items.length > 1 ? (index + 1) % items.length : index
  const current = items[index]
  const next = items[nextIndex]

  useEffect(() => {
    if (items.length <= 1 || animating) return

    const holdTimer = window.setTimeout(() => {
      setAnimating(true)
      setDisableTransition(false)
    }, holdMs)

    return () => window.clearTimeout(holdTimer)
  }, [animating, holdMs, index, items.length])

  const handleTransitionEnd = (event: TransitionEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== "transform") return
    if (!animating) return

    setIndex(nextIndex)
    setDisableTransition(true)
    setAnimating(false)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setDisableTransition(false)
      })
    })
  }

  return (
    <span
      className="relative block basis-full h-[1.2em] w-full min-w-0 overflow-hidden normal-case leading-[1.2em] sm:inline-block sm:basis-auto sm:w-auto sm:min-w-[10ch]"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        onTransitionEnd={handleTransitionEnd}
        className="flex flex-col will-change-transform"
        style={{
          // next is rendered above current, then slides down into view
          transform: animating ? "translateY(0%)" : "translateY(-50%)",
          transitionProperty: disableTransition ? "none" : "transform",
          transitionDuration: `${slideMs}ms`,
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <span
          className="h-[1.2em] whitespace-nowrap leading-[1.2em]"
          style={{
            opacity: fade ? (animating ? 1 : 0.9) : 1,
            transition: disableTransition
              ? "none"
              : `opacity ${Math.min(slideMs, 400)}ms ease-in-out`,
          }}
        >
          {next}
        </span>
        <span
          className="h-[1.2em] whitespace-nowrap leading-[1.2em]"
          style={{
            opacity: fade ? (animating ? 0.9 : 1) : 1,
            transition: disableTransition
              ? "none"
              : `opacity ${Math.min(slideMs, 400)}ms ease-in-out`,
          }}
        >
          {current}
        </span>
      </span>
    </span>
  )
}
