"use client"

import { useToast } from "@/components/ui/use-toast"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  const { toasts = [] } = useToast() || {}

  return (
    <ToastProvider>
      {Array.isArray(toasts) &&
        toasts.map(({ id, title, description }) => (
          <Toast key={id || Math.random().toString()}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
      <ToastViewport />
    </ToastProvider>
  )
}
