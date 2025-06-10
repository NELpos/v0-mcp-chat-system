import { OnboardingInterface } from "@/components/onboarding-interface"

export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to MCP Chat System</h1>
          <p className="text-muted-foreground text-lg">Let's get you set up in just a few simple steps</p>
        </div>
        <OnboardingInterface />
      </div>
    </div>
  )
}
