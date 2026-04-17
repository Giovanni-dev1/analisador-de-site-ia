"use client"

import { useState } from "react"
import { Bot, Sparkles } from "lucide-react"
import { UrlInput } from "@/components/url-input"
import { AnalysisResult, type AnalysisResultData } from "@/components/analysis-result"
import { analyzeWebsite } from "@/lib/analyzer"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResultData | null>(null)

  const handleAnalyze = async (url: string) => {
    setIsLoading(true)
    setResult(null)
    
    try {
      // Normaliza a URL
      let normalizedUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        normalizedUrl = "https://" + url
      }
      
      const analysisResult = await analyzeWebsite(normalizedUrl)
      setResult(analysisResult)
    } catch (error) {
      console.error("[v0] Erro na análise:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewAnalysis = () => {
    setResult(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card">
            <Bot className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vibe Check
          </h1>
        </div>
        <p className="max-w-md text-muted-foreground">
          Descubra se um site foi criado por IA ou por um humano. 
          Cole a URL e deixe a análise revelar os sinais.
        </p>
      </div>

      {/* Input ou Resultado */}
      {!result ? (
        <div className="flex w-full flex-col items-center gap-8">
          <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse text-accent" />
                <span>Analisando padrões de código...</span>
              </div>
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
              </div>
            </div>
          )}
          
          {/* Info cards */}
          {!isLoading && (
            <div className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
              <InfoCard
                title="Padrões de Código"
                description="Analisa estruturas de código típicas de geradores de IA"
              />
              <InfoCard
                title="Stack Tecnológica"
                description="Detecta frameworks e bibliotecas comuns em vibe coding"
              />
              <InfoCard
                title="Estilo Visual"
                description="Identifica padrões visuais genéricos de templates"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-6">
          <AnalysisResult result={result} />
          
          <button
            onClick={handleNewAnalysis}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Analisar outro site
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center text-sm text-muted-foreground">
        <p>
          Resultados são estimativas baseadas em padrões comuns.
          <br />
          Nenhuma análise é 100% precisa.
        </p>
      </footer>
    </main>
  )
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-1 font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
