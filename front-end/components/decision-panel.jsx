"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Download,
  Copy,
  TrendingUp,
  TrendingDown,
  Shield,
  Eye,
  Ban,
} from "lucide-react"
import { useState } from "react"

export function DecisionPanel({ decision, isEvaluating }) {
  const [auditOpen, setAuditOpen] = useState(false)

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case "APPROVE":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "REJECT":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "REFER":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      default:
        return null
    }
  }

  const getDecisionBgColor = (decision) => {
    switch (decision) {
      case "APPROVE":
        return "from-green-500/20 to-green-500/5 border-green-500/30"
      case "REJECT":
        return "from-red-500/20 to-red-500/5 border-red-500/30"
      case "REFER":
        return "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30"
      default:
        return "from-slate-500/20 to-slate-500/5 border-slate-500/30"
    }
  }

  const getRuleTypeIcon = (type) => {
    switch (type) {
      case "hard_reject":
        return <Ban className="h-4 w-4 text-red-500" />
      case "validation":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "referral":
        return <Eye className="h-4 w-4 text-yellow-500" />
      default:
        return <Shield className="h-4 w-4 text-blue-500" />
    }
  }

  const getRuleTypeColor = (type) => {
    switch (type) {
      case "hard_reject":
        return "bg-red-50/50 border-red-200/50 dark:bg-red-500/10 dark:border-red-500/20"
      case "validation":
        return "bg-green-50/50 border-green-200/50 dark:bg-green-500/10 dark:border-green-500/20"
      case "referral":
        return "bg-yellow-50/50 border-yellow-200/50 dark:bg-yellow-500/10 dark:border-yellow-500/20"
      default:
        return "bg-blue-50/50 border-blue-200/50 dark:bg-blue-500/10 dark:border-blue-500/20"
    }
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(decision, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `loan-decision-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyAuditTrail = () => {
    navigator.clipboard.writeText(JSON.stringify(decision, null, 2))
  }

  if (isEvaluating) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-border/50 shadow-md">
          <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2">Processing Application</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed px-2">
                    Running ML model inference and applying business rules. This request may take up to 60 seconds as
                    the backend may need to spin up from a cold start.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!decision) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-3 sm:pb-4 border-b border-border/30 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg font-semibold">Decision Results</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-base sm:text-lg mb-2 text-foreground">No Decision Yet</h3>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto">
                Complete the application form and click "Evaluate Application" to see the AI decision.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Decision Badge - Main Result */}
      <Card className={`border bg-gradient-to-br ${getDecisionBgColor(decision.decision)} shadow-lg`}>
        <CardHeader className="pb-3 sm:pb-4 border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold">Decision</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {getDecisionIcon(decision.decision)}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Recommendation</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{decision.decision}</p>
              </div>
            </div>
            <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 bg-card/50 w-full sm:w-auto">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Score */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-3 sm:pb-4 border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 space-y-4 sm:space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-medium text-foreground">Probability of Default</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-primary">
                {(decision.riskScore * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={decision.riskScore * 100} className="h-2 sm:h-2.5" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-medium text-foreground">Model Confidence</span>
              <span className="text-base sm:text-lg font-semibold text-primary">
                {(decision.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={decision.confidence * 100} className="h-2 sm:h-2.5" />
          </div>
        </CardContent>
      </Card>

      {/* Rules Fired */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-3 sm:pb-4 border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold">Business Rules Applied</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            {decision.rulesFired && decision.rulesFired.length > 0 ? (
              decision.rulesFired.map((rule, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border text-xs sm:text-sm ${getRuleTypeColor(rule.type)}`}
                >
                  {getRuleTypeIcon(rule.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-foreground">{rule.rule}</p>
                      <Badge variant="outline" className="text-xs">
                        {rule.type?.replace("_", " ") || "validation"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rule.reason}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">No business rules fired</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Drivers */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-3 sm:pb-4 border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold">Key Decision Factors</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            {decision.topDrivers?.map((driver, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 sm:p-4 bg-muted/40 rounded-lg border border-border/50 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {driver.direction === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className="font-medium text-foreground truncate">{driver.feature}</span>
                </div>
                <div className="text-right ml-2">
                  <span
                    className={`font-mono text-xs sm:text-sm font-semibold ${driver.direction === "positive" ? "text-green-500" : "text-red-500"}`}
                  >
                    {driver.direction === "positive" ? "+" : ""}
                    {(driver.impact * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-3 sm:pb-4 border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <Collapsible open={auditOpen} onOpenChange={setAuditOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-card/50 text-xs sm:text-sm h-9 sm:h-10">
                View Raw Decision Data
                <ChevronDown
                  className={`h-4 w-4 transition-transform ml-2 flex-shrink-0 ${auditOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 sm:mt-4">
              <div className="relative">
                <Button
                  onClick={copyAuditTrail}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 gap-1 sm:gap-2 text-xs h-7"
                >
                  <Copy className="h-3 w-3" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <pre className="bg-muted/50 p-3 sm:p-4 rounded-lg text-xs font-mono overflow-auto max-h-96 border border-border/50 pr-12">
                  {JSON.stringify(decision, null, 2)}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
