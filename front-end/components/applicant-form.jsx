"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Loader2 } from "lucide-react"

export function ApplicantForm({ onEvaluate, isEvaluating }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    education: "",
    income: "",
    employmentExperience: "",
    homeOwnership: "",
    loanAmount: "",
    loanIntent: "",
    interestRate: "",
    creditHistoryLength: "",
    creditScore: "",
    previousLoanDefault: "",
  })

  const [errors, setErrors] = useState({})

  const calculateLoanPercentageIncome = () => {
    const income = Number.parseFloat(formData.income) || 0
    const loanAmount = Number.parseFloat(formData.loanAmount) || 0
    return income > 0 ? ((loanAmount / income) * 100).toFixed(2) : "0"
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.age) newErrors.age = "Age is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.education) newErrors.education = "Education is required"
    if (!formData.income) newErrors.income = "Income is required"
    if (!formData.employmentExperience) newErrors.employmentExperience = "Employment experience is required"
    if (!formData.homeOwnership) newErrors.homeOwnership = "Home ownership is required"
    if (!formData.loanAmount) newErrors.loanAmount = "Loan amount is required"
    if (!formData.loanIntent) newErrors.loanIntent = "Loan intent is required"
    if (!formData.interestRate) newErrors.interestRate = "Interest rate is required"
    if (!formData.creditHistoryLength) newErrors.creditHistoryLength = "Credit history length is required"
    if (!formData.creditScore) newErrors.creditScore = "Credit score is required"
    if (!formData.previousLoanDefault) newErrors.previousLoanDefault = "Previous loan default is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onEvaluate({
        ...formData,
        age: Number.parseInt(formData.age),
        income: Number.parseInt(formData.income),
        employmentExperience: Number.parseInt(formData.employmentExperience),
        loanAmount: Number.parseInt(formData.loanAmount),
        interestRate: Number.parseFloat(formData.interestRate),
        loanPercentageIncome: Number.parseFloat(calculateLoanPercentageIncome()),
        creditHistoryLength: Number.parseInt(formData.creditHistoryLength),
        creditScore: Number.parseInt(formData.creditScore),
        timestamp: new Date().toISOString(),
      })
    }
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
            1
          </span>
          Personal Information
        </h3>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="age" className="text-xs sm:text-sm font-medium">
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className={`mt-1 sm:mt-2 text-sm ${errors.age ? "border-destructive" : ""}`}
                />
                {errors.age && <p className="text-xs text-destructive mt-1">{errors.age}</p>}
              </div>
              <div>
                <Label htmlFor="gender" className="text-xs sm:text-sm font-medium">
                  Gender *
                </Label>
                <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger className={`mt-1 sm:mt-2 text-sm ${errors.gender ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="education" className="text-xs sm:text-sm font-medium">
                Education *
              </Label>
              <Select value={formData.education} onValueChange={(value) => updateField("education", value)}>
                <SelectTrigger className={`mt-1 sm:mt-2 text-sm ${errors.education ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Associate">Associate</SelectItem>
                  <SelectItem value="Bachelor">Bachelor</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
              {errors.education && <p className="text-xs text-destructive mt-1">{errors.education}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial & Employment */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
            2
          </span>
          Financial & Employment
        </h3>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="income" className="text-xs sm:text-sm font-medium">
                Income ($) *
              </Label>
              <Input
                id="income"
                type="number"
                min="0"
                max="10000000"
                value={formData.income}
                onChange={(e) => updateField("income", e.target.value)}
                className={`mt-1 sm:mt-2 text-sm ${errors.income ? "border-destructive" : ""}`}
              />
              {errors.income && <p className="text-xs text-destructive mt-1">{errors.income}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="employmentExperience" className="text-xs sm:text-sm font-medium">
                  Experience (Yrs) *
                </Label>
                <Input
                  id="employmentExperience"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.employmentExperience}
                  onChange={(e) => updateField("employmentExperience", e.target.value)}
                  className={`mt-1 sm:mt-2 text-sm ${errors.employmentExperience ? "border-destructive" : ""}`}
                />
                {errors.employmentExperience && (
                  <p className="text-xs text-destructive mt-1">{errors.employmentExperience}</p>
                )}
              </div>
              <div>
                <Label htmlFor="homeOwnership" className="text-xs sm:text-sm font-medium">
                  Home Ownership *
                </Label>
                <Select value={formData.homeOwnership} onValueChange={(value) => updateField("homeOwnership", value)}>
                  <SelectTrigger className={`mt-1 sm:mt-2 text-sm ${errors.homeOwnership ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                    <SelectItem value="OWN">Own</SelectItem>
                    <SelectItem value="RENT">Rent</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.homeOwnership && <p className="text-xs text-destructive mt-1">{errors.homeOwnership}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loan Details */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
            3
          </span>
          Loan Details
        </h3>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="loanAmount" className="text-xs sm:text-sm font-medium">
                  Loan Amount ($) *
                </Label>
                <Input
                  id="loanAmount"
                  type="number"
                  min="0"
                  max="10000000"
                  value={formData.loanAmount}
                  onChange={(e) => updateField("loanAmount", e.target.value)}
                  className={`mt-1 sm:mt-2 text-sm ${errors.loanAmount ? "border-destructive" : ""}`}
                />
                {errors.loanAmount && <p className="text-xs text-destructive mt-1">{errors.loanAmount}</p>}
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-xs sm:text-sm font-medium">
                  Interest Rate (%) *
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.interestRate}
                  onChange={(e) => updateField("interestRate", e.target.value)}
                  className={`mt-1 sm:mt-2 text-sm ${errors.interestRate ? "border-destructive" : ""}`}
                />
                {errors.interestRate && <p className="text-xs text-destructive mt-1">{errors.interestRate}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="loanIntent" className="text-xs sm:text-sm font-medium">
                Loan Intent *
              </Label>
              <Select value={formData.loanIntent} onValueChange={(value) => updateField("loanIntent", value)}>
                <SelectTrigger className={`mt-1 sm:mt-2 text-sm ${errors.loanIntent ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select intent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBTCONSOLIDATION">Debt Consolidation</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                  <SelectItem value="HOMEIMPROVEMENT">Home Improvement</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                  <SelectItem value="PERSONAL">Personal</SelectItem>
                  <SelectItem value="VENTURE">Venture</SelectItem>
                </SelectContent>
              </Select>
              {errors.loanIntent && <p className="text-xs text-destructive mt-1">{errors.loanIntent}</p>}
            </div>
            {formData.income && formData.loanAmount && (
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm sm:text-base">
                <Calculator className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-foreground">
                  Loan-to-Income: <strong>{calculateLoanPercentageIncome()}%</strong>
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Credit History */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
            4
          </span>
          Credit History
        </h3>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="creditScore" className="text-xs sm:text-sm font-medium">
                  Credit Score *
                </Label>
                <Input
                  id="creditScore"
                  type="number"
                  min="0"
                  max="1000"
                  value={formData.creditScore}
                  onChange={(e) => updateField("creditScore", e.target.value)}
                  className={`mt-1 sm:mt-2 text-sm ${errors.creditScore ? "border-destructive" : ""}`}
                />
                {errors.creditScore && <p className="text-xs text-destructive mt-1">{errors.creditScore}</p>}
              </div>
              <div>
                <Label htmlFor="creditHistoryLength" className="text-xs sm:text-sm font-medium">
                  History Length (Yrs) *
                </Label>
                <Input
                  id="creditHistoryLength"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.creditHistoryLength}
                  onChange={(e) => updateField("creditHistoryLength", e.target.value)}
                  className={`mt-1 sm:mt-2 text-sm ${errors.creditHistoryLength ? "border-destructive" : ""}`}
                />
                {errors.creditHistoryLength && (
                  <p className="text-xs text-destructive mt-1">{errors.creditHistoryLength}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="previousLoanDefault" className="text-xs sm:text-sm font-medium">
                Previous Default *
              </Label>
              <Select
                value={formData.previousLoanDefault}
                onValueChange={(value) => updateField("previousLoanDefault", value)}
              >
                <SelectTrigger
                  className={`mt-1 sm:mt-2 text-sm ${errors.previousLoanDefault ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              {errors.previousLoanDefault && (
                <p className="text-xs text-destructive mt-1">{errors.previousLoanDefault}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full h-10 sm:h-10" disabled={isEvaluating} size="lg">
        {isEvaluating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Evaluating...
          </>
        ) : (
          "Evaluate Application"
        )}
      </Button>
    </form>
  )
}
