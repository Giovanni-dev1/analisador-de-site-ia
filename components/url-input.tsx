"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface UrlInputProps {
  onAnalyze: (url: string) => void
  isLoading: boolean
}

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onAnalyze(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
        <Search className="ml-2 h-5 w-5 text-muted-foreground" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole a URL do site aqui..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={isLoading}
          required
        />
        <Button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Analisando
            </>
          ) : (
            "Analisar"
          )}
        </Button>
      </div>
    </form>
  )
}
