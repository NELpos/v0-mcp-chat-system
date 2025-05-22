"use client"

import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  duration?: number
}

export function toast({ title, description, duration = 3000 }: ToastProps) {
  // Create a custom event
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      duration,
    },
  })

  // Dispatch the event
  window.dispatchEvent(event)
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const addToast = useCallback(({ title, description, duration = 3000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, duration }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  useEffect(() => {
    const handleToast = (e: Event) => {
      const { title, description, duration } = (e as CustomEvent).detail
      addToast({ title, description, duration })
    }

    window.addEventListener("toast", handleToast)
    return () => window.removeEventListener("toast", handleToast)
  }, [addToast])

  return { toasts }
}
