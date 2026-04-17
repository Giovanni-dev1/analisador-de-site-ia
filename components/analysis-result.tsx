"use client"

import { CheckCircle2, AlertTriangle, XCircle, Bot, Code2, FileCode, Layers, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface AnalysisReason {
  indicator: string
  description: string
  weight: "high" | "medium" | "low"
}

export interface AnalysisResultData {
  url: string
  percentage: number
  verdict: "human" | "likely_human" | "mixed" | "likely_ai" | "ai"
  reasons: AnalysisReason[]
}

interface AnalysisResultProps {
  result: AnalysisResultData
}

function getVerdictInfo(verdict: AnalysisResultData["verdict"]) {
  switch (verdict) {
    case "human":
      return {
        label: "Feito por Humano",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        borderColor: "border-emerald-400/30",
        icon: CheckCircle2,
      }
    case "likely_human":
      return {
        label: "Provavelmente Humano",
        color: "text-emerald-300",
        bgColor: "bg-emerald-300/10",
        borderColor: "border-emerald-300/30",
        icon: CheckCircle2,
      }
    case "mixed":
      return {
        label: "Resultado Misto",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        borderColor: "border-amber-400/30",
        icon: AlertTriangle,
      }
    case "likely_ai":
      return {
        label: "Provavelmente IA",
        color: "text-orange-400",
        bgColor: "bg-orange-400/10",
        borderColor: "border-orange-400/30",
        icon: Bot,
      }
    case "ai":
      return {
        label: "Feito por IA",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/30",
        icon: XCircle,
      }
  }
}

function getWeightIcon(weight: AnalysisReason["weight"]) {
  switch (weight) {
    case "high":
      return <Sparkles className="h-4 w-4 text-red-400" />
    case "medium":
      return <Layers className="h-4 w-4 text-amber-400" />
    case "low":
      return <FileCode className="h-4 w-4 text-muted-foreground" />
  }
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const verdictInfo = getVerdictInfo(result.verdict)
  const VerdictIcon = verdictInfo.icon

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Porcentagem principal */}
      <Card className={`p-6 ${verdictInfo.bgColor} ${verdictInfo.borderColor} border`}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <VerdictIcon className={`h-8 w-8 ${verdictInfo.color}`} />
            <span className={`text-lg font-medium ${verdictInfo.color}`}>
              {verdictInfo.label}
            </span>
          </div>
          
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/30"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${result.percentage * 3.52} 352`}
                strokeLinecap="round"
                className={verdictInfo.color}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-bold ${verdictInfo.color}`}>
                {result.percentage}%
              </span>
              <span className="text-xs text-muted-foreground">chance IA</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {result.url}
          </p>
        </div>
      </Card>

      {/* Lista de motivos */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Indicadores Detectados</h3>
        </div>
        
        <div className="space-y-2">
          {result.reasons.map((reason, index) => (
            <Card key={index} className="flex items-start gap-3 p-4">
              {getWeightIcon(reason.weight)}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {reason.indicator}
                </p>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
