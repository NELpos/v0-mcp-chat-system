"use client"

import { TranslationInterface } from "@/components/translation-interface"

export default function TranslationPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <TranslationInterface />
      </div>
    </div>
  )
}
