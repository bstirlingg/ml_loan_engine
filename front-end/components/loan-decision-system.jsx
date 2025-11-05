"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { ApplicantForm } from "./applicant-form"
import { DecisionPanel } from "./decision-panel"
import { HowItWorksDialog } from "./how-it-works-dialog"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function LoanDecisionSystem() {
  const [decision, setDecision] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const { toast } = useToast()

  const handleEvaluate = async (formData) => {
    setIsEvaluating(true)

    try {
      const response = await fetch(`${API_URL}/api/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()

      const formattedResult = {
        decision: result.decision,
        riskScore: result.defaultProbability,
        confidence: result.confidenceScore,
        rulesFired: [],
        hardRejects: [],
        validations: [],
        referrals: [],
        topDrivers: [
          { feature: "Credit Score", impact: 0.25, direction: "positive" },
          { feature: "Loan Amount", impact: -0.18, direction: "negative" },
          { feature: "Income", impact: 0.15, direction: "positive" },
        ],
        auditTrail: {
          inputs: formData,
          timestamp: new Date().toISOString(),
          backendResponse: result,
        },
      }

      setDecision(formattedResult)

      toast({
        title: "Evaluation Complete",
        description: `Decision: ${result.decision} (Risk Score: ${(result.defaultProbability * 100).toFixed(1)}%)`,
      })
    } catch (error) {
      console.error("Evaluation error:", error)
      toast({
        title: "Evaluation Failed",
        description: error.message || "An error occurred during loan evaluation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Improved visual hierarchy */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Loan Decision System</h1>
                <p className="text-xs text-muted-foreground">ML-Powered Risk Assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HowItWorksDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Better spacing and structure */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Form Section */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="border-border/50 shadow-md">
                <CardHeader className="pb-4 border-b border-border/30">
                  <CardTitle className="text-lg font-semibold">Application</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Fill out the form to evaluate the loan</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <ApplicantForm onEvaluate={handleEvaluate} isEvaluating={isEvaluating} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Decision Results with better prominence */}
          <div className="lg:col-span-2">
            <DecisionPanel decision={decision} isEvaluating={isEvaluating} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 mt-16 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Created by</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.linkedin.com/in/arron-murray-28874a352/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="text-primary">in</span> Arron Murray
                </a>
                <span className="text-muted-foreground hidden sm:inline">&</span>
                <a
                  href="https://www.linkedin.com/in/benjamin-s-a921631a6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="text-primary">in</span> Ben Stirling
                </a>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              <p>ML-Powered Loan Decision System</p>
              <p className="mt-1">© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
