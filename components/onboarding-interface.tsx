"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, Key, Settings, MessageSquare, Rocket } from "lucide-react"
import { OnboardingStep1 } from "@/components/onboarding-step1"
import { OnboardingStep2 } from "@/components/onboarding-step2"
import { OnboardingStep3 } from "@/components/onboarding-step3"
import { useSettings } from "@/contexts/settings-context"
import { useRouter } from "next/navigation"

interface Step {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
}

export function OnboardingInterface() {
  const [currentStep, setCurrentStep] = useState(1)
  const [hasApiKey, setHasApiKey] = useState(false)
  const { toolTokens, isLoaded } = useSettings()
  const router = useRouter()

  // Check if user has configured tokens
  const hasConfiguredTokens =
    isLoaded &&
    ((toolTokens.jira && toolTokens.jira.length > 0) ||
      (toolTokens.atlassian && toolTokens.atlassian.length > 0) ||
      (toolTokens.github && toolTokens.github.length > 0))

  const steps: Step[] = [
    {
      id: 1,
      title: "Generate API Key",
      description: "Create your personal API key to access the MCP Chat System",
      icon: Key,
      completed: hasApiKey,
    },
    {
      id: 2,
      title: "Configure Tools",
      description: "Set up your service tokens for Jira, Atlassian, and GitHub",
      icon: Settings,
      completed: hasConfiguredTokens,
    },
    {
      id: 3,
      title: "Start Chatting",
      description: "You're all set! Start using MCP Chat with your configured tools",
      icon: MessageSquare,
      completed: hasApiKey && hasConfiguredTokens,
    },
  ]

  // Auto-advance to next step when current step is completed
  useEffect(() => {
    if (currentStep === 1 && hasApiKey) {
      setTimeout(() => setCurrentStep(2), 1000)
    } else if (currentStep === 2 && hasConfiguredTokens) {
      setTimeout(() => setCurrentStep(3), 1000)
    }
  }, [currentStep, hasApiKey, hasConfiguredTokens])

  const progress = (steps.filter((step) => step.completed).length / steps.length) * 100

  const handleStepClick = (stepId: number) => {
    // Allow going back to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
    }
  }

  const handleFinish = () => {
    router.push("/mcp")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 onApiKeyGenerated={() => setHasApiKey(true)} />
      case 2:
        return <OnboardingStep2 />
      case 3:
        return <OnboardingStep3 onFinish={handleFinish} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>Complete these steps to start using MCP Chat</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {steps.filter((step) => step.completed).length} of {steps.length} completed
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isClickable = step.id <= currentStep

          return (
            <Card
              key={step.id}
              className={`cursor-pointer transition-all duration-200 ${
                isActive
                  ? "ring-2 ring-primary shadow-md"
                  : isClickable
                    ? "hover:shadow-md"
                    : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => isClickable && handleStepClick(step.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{step.title}</h3>
                      {step.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />}
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">{renderStepContent()}</div>
    </div>
  )
}
