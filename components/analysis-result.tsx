"use client"

import { CheckCircle2, AlertTriangle, XCircle, Bot, Code2, ShieldCheck, ShieldAlert, Info } from "lucide-react"
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
        sublabel: "Nenhuma evidência significativa de IA",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        borderColor: "border-emerald-400/30",
        icon: CheckCircle2,
      }
    case "likely_human":
      return {
        label: "Provavelmente Humano",
        sublabel: "Poucos padrões de IA detectados",
        color: "text-emerald-300",
        bgColor: "bg-emerald-300/10",
        borderColor: "border-emerald-300/30",
        icon: CheckCircle2,
      }
    case "mixed":
      return {
        label: "Resultado Inconclusivo",
        sublabel: "Evidências mistas - pode ter assistência de IA",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        borderColor: "border-amber-400/30",
        icon: AlertTriangle,
      }
    case "likely_ai":
      return {
        label: "Provavelmente IA",
        sublabel: "Múltiplos indicadores de código gerado por IA",
        color: "text-orange-400",
        bgColor: "bg-orange-400/10",
        borderColor: "border-orange-400/30",
        icon: Bot,
      }
    case "ai":
      return {
        label: "Feito por IA",
        sublabel: "Evidências fortes de geração por IA",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/30",
        icon: XCircle,
      }
  }
}

function getWeightInfo(weight: AnalysisReason["weight"]) {
  switch (weight) {
    case "high":
      return {
        icon: <ShieldAlert className="h-4 w-4 text-red-400" />,
        label: "Evidência Forte",
        bg: "bg-red-400/5 border-red-400/20",
      }
    case "medium":
      return {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        label: "Evidência Média",
        bg: "bg-amber-400/5 border-amber-400/20",
      }
    case "low":
      return {
        icon: <Info className="h-4 w-4 text-muted-foreground" />,
        label: "Indicador Fraco",
        bg: "bg-muted/30 border-border",
      }
  }
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const verdictInfo = getVerdictInfo(result.verdict)
  const VerdictIcon = verdictInfo.icon

  // Separa indicadores por tipo
  const aiIndicators = result.reasons.filter(r => !r.description.includes("indica"))
  const humanIndicators = result.reasons.filter(r => r.description.includes("indica"))
  
  // Conta por peso
  const highCount = result.reasons.filter(r => r.weight === "high").length
  const mediumCount = result.reasons.filter(r => r.weight === "medium").length

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Card principal com veredicto */}
      <Card className={`p-8 ${verdictInfo.bgColor} ${verdictInfo.borderColor} border`}>
        <div className="flex flex-col items-center gap-6">
          {/* Círculo de progresso */}
          <div className="relative flex items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${result.percentage * 4.02} 402`}
                strokeLinecap="round"
                className={verdictInfo.color}
                style={{
                  transition: "stroke-dasharray 0.8s ease-out",
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-bold ${verdictInfo.color}`}>
                {result.percentage}%
              </span>
              <span className="text-xs text-muted-foreground">chance de IA</span>
            </div>
          </div>

          {/* Veredicto */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <VerdictIcon className={`h-6 w-6 ${verdictInfo.color}`} />
              <span className={`text-xl font-semibold ${verdictInfo.color}`}>
                {verdictInfo.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {verdictInfo.sublabel}
            </p>
          </div>

          {/* Resumo de evidências */}
          {(highCount > 0 || mediumCount > 0) && (
            <div className="flex items-center gap-4 text-xs">
              {highCount > 0 && (
                <span className="flex items-center gap-1 text-red-400">
                  <ShieldAlert className="h-3 w-3" />
                  {highCount} forte{highCount > 1 ? "s" : ""}
                </span>
              )}
              {mediumCount > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  {mediumCount} média{mediumCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}

          {/* URL analisada */}
          <p className="text-xs text-muted-foreground truncate max-w-full px-4">
            {result.url}
          </p>
        </div>
      </Card>

      {/* Lista de indicadores de IA */}
      {aiIndicators.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h3 className="font-medium text-foreground">Indicadores de IA Detectados</h3>
          </div>
          
          <div className="space-y-2">
            {aiIndicators.map((reason, index) => {
              const weightInfo = getWeightInfo(reason.weight)
              return (
                <Card key={index} className={`flex items-start gap-3 p-4 border ${weightInfo.bg}`}>
                  {weightInfo.icon}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {reason.indicator}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {weightInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Lista de indicadores humanos (se houver) */}
      {humanIndicators.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="font-medium text-foreground">Indicadores de Código Humano</h3>
          </div>
          
          <div className="space-y-2">
            {humanIndicators.map((reason, index) => (
              <Card key={index} className="flex items-start gap-3 p-4 border bg-emerald-400/5 border-emerald-400/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
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
      )}

      {/* Nota sobre análise */}
      <Card className="p-4 border-dashed">
        <div className="flex items-start gap-3">
          <Code2 className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              <strong>Como funciona:</strong> Analisamos o HTML, JavaScript e metadados do site em busca de padrões 
              típicos de código gerado por IA como assinaturas de ferramentas, estruturas repetitivas, 
              e ausência de práticas de desenvolvimento profissional.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Nota:</strong> Esta análise é heurística e não é 100% precisa. 
              Código bem escrito por IA pode passar despercebido, e código humano pode ter padrões similares.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
