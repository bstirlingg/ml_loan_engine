"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Server, Brain, Code, Zap, Database } from "lucide-react"

export function HowItWorksDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Info className="h-4 w-4" />
          How This App Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">How the Loan Decision System Works</DialogTitle>
          <DialogDescription>
            An AI-powered loan decision system that evaluates applications in real-time using machine learning trained
            on 45,000 real loan applications.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-120px)] pr-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="ml">ML Model</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    System Components
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1">Frontend (What You See)</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Next.js web application at https://loanengine.netlify.app</li>
                        <li>• Collects your loan application information</li>
                        <li>• Displays the decision and risk analysis</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1">Backend (The Processing Engine)</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• FastAPI service at https://loan-decision-api-os4n.onrender.com</li>
                        <li>• Validates your data</li>
                        <li>• Runs the AI prediction</li>
                        <li>• Applies business rules</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1">ML Model (The Brain)</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Random Forest algorithm with 300 decision trees</li>
                        <li>• Trained on 45,000 historical loan applications</li>
                        <li>• Predicts probability of loan default</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Important: Cold Start Notice
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The backend is hosted on Render's free tier. If the service hasn't been used recently, it may take
                    up to 60 seconds to "wake up" (cold start). Subsequent requests will be much faster (1-3 seconds).
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Step-by-Step Process</h3>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">You Submit Your Application</h4>
                      <p className="text-sm text-muted-foreground">
                        Fill out the form with 13 pieces of information: Personal (Age, Gender, Education), Financial
                        (Income, Employment History, Home Ownership), Loan (Amount, Purpose, Interest Rate), and Credit
                        (Score, History Length, Past Defaults).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Frontend Validates & Sends</h4>
                      <p className="text-sm text-muted-foreground">
                        Form checks your input is valid (e.g., age 18-100, credit score 300-850). Data is packaged and
                        sent securely to the backend API.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Backend Processes Your Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Receives and validates the request. Converts your data into the format the ML model expects.
                        Text values become numbers (e.g., "Male/Female" → binary values). Numbers are scaled to a
                        standard range.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">ML Model Makes Prediction</h4>
                      <p className="text-sm text-muted-foreground">
                        Your data goes through 300 decision trees. Each tree analyzes patterns learned from 45,000 past
                        applications. Trees "vote" on the likelihood of default. Outputs a probability score (0-100%).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Business Rules Determine Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        REJECT: Default probability &gt; 70% (high risk). APPROVE: Default probability &lt; 30% AND
                        confidence &gt; 70% (low risk). REFER: Everything else (needs manual review).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      6
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">You See The Results</h4>
                      <p className="text-sm text-muted-foreground">
                        Decision badge (Approve/Reject/Refer), risk score as a percentage, confidence level, and visual
                        representation. Total time: 1-3 seconds (or ~30-60 seconds if backend was sleeping).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ml" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    The Machine Learning Model
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">What is Random Forest?</h4>
                      <p className="text-sm text-muted-foreground">
                        An ensemble algorithm that combines 300 decision trees to make predictions. Each tree analyzes
                        your application independently, then they "vote" on the outcome. This approach is highly
                        accurate and resistant to errors.
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Training Details</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Dataset: 45,000 historical loan applications</li>
                        <li>• Split: 80% training (36,000), 20% testing (9,000)</li>
                        <li>• Configuration: 300 trees, max depth of 10, balanced class weights</li>
                        <li>• Result: Model learns patterns that predict loan default risk</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">13 Input Features</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Age, Gender, Education, Income, Employment Experience, Home Ownership, Loan Amount, Loan
                        Purpose, Interest Rate, Loan % of Income, Credit Score, Credit History Length, Previous Defaults
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        After processing: These 13 inputs become 22 features (text converts to numbers, values are
                        scaled)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 text-red-900 dark:text-red-100">High Risk Signals</h4>
                        <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                          <li>• Low credit score (&lt; 600)</li>
                          <li>• High loan-to-income ratio (&gt; 2.0)</li>
                          <li>• Previous defaults</li>
                          <li>• Short credit history</li>
                          <li>• High interest rates</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 text-green-900 dark:text-green-100">
                          Low Risk Signals
                        </h4>
                        <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                          <li>• High credit score (&gt; 750)</li>
                          <li>• Low loan-to-income ratio (&lt; 0.3)</li>
                          <li>• No previous defaults</li>
                          <li>• Long credit history</li>
                          <li>• Stable income and employment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Technology Stack
                  </h3>

                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Frontend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Next.js 14 + React 19 (web framework)</li>
                        <li>• Tailwind CSS (styling)</li>
                        <li>• Zod (validation)</li>
                        <li>• Hosted on Netlify</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Backend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• FastAPI (Python web framework)</li>
                        <li>• scikit-learn (ML library)</li>
                        <li>• pandas (data processing)</li>
                        <li>• Hosted on Render (free tier)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Deployment</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• GitHub for version control</li>
                        <li>• Automatic deployments on code push</li>
                        <li>• Total cost: $0/month (using free tiers)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        How Components Connect
                      </h4>
                      <div className="text-sm text-muted-foreground font-mono bg-background p-3 rounded border">
                        <div>User Browser</div>
                        <div className="ml-4">↓</div>
                        <div>Netlify Frontend (loanengine.netlify.app)</div>
                        <div className="ml-4">↓ POST /api/evaluate</div>
                        <div>Render Backend (loan-decision-api-os4n.onrender.com)</div>
                        <div className="ml-4">↓</div>
                        <div>ML Model (Random Forest - loaded in memory)</div>
                        <div className="ml-4">↓</div>
                        <div>Business Rules Engine</div>
                        <div className="ml-4">↓</div>
                        <div>Response: {"{decision, probability, confidence}"}</div>
                        <div className="ml-4">↓</div>
                        <div>Display Results to User</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                  <h4 className="font-medium mb-2">Important Notes</h4>
                  <p className="text-sm text-muted-foreground mb-2">This is a demonstration application:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Trained on 45,000 historical loan applications</li>
                    <li>• Uses sophisticated ML (Random Forest with 300 trees)</li>
                    <li>• Not storing any personal data</li>
                    <li>• Not connected to real credit bureaus</li>
                    <li>• Not making legally binding decisions</li>
                    <li>• Built for educational/portfolio purposes</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
