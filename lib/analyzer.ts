import type { AnalysisResultData, AnalysisReason } from "@/components/analysis-result"

// Indicadores FORTES de código gerado por IA (muito específicos)
const STRONG_AI_INDICATORS = [
  {
    patterns: [
      /created\s*(with|by)\s*v0/gi,
      /built\s*(with|by)\s*v0/gi,
      /v0\.dev/gi,
      /vercel\s*v0/gi,
    ],
    indicator: "Assinatura v0.dev",
    description: "Referência direta à ferramenta v0 da Vercel nos metadados ou código.",
    score: 40,
  },
  {
    patterns: [
      /generated\s*(by|with|using)\s*(ai|artificial\s*intelligence|gpt|claude|chatgpt|copilot)/gi,
      /ai[\-\s]generated/gi,
      /powered\s*by\s*(gpt|claude|openai|anthropic)/gi,
    ],
    indicator: "Assinatura de IA",
    description: "Menção explícita de que o código foi gerado por IA.",
    score: 45,
  },
  {
    patterns: [
      /cursor\.sh/gi,
      /cursor\s*ai/gi,
      /bolt\.new/gi,
      /replit\s*ai/gi,
      /codeium/gi,
    ],
    indicator: "Ferramenta de IA Conhecida",
    description: "Referência a ferramentas de desenvolvimento assistido por IA.",
    score: 35,
  },
]

// Indicadores MÉDIOS - padrões comuns mas não exclusivos de IA
const MEDIUM_AI_INDICATORS = [
  {
    patterns: [
      /@\/components\/ui\/(button|card|input|dialog|dropdown|sheet|tabs|accordion|alert|avatar|badge|calendar|checkbox|collapsible|command|context-menu|hover-card|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|skeleton|slider|switch|table|textarea|toast|toggle|tooltip)/gi,
    ],
    indicator: "Uso Extensivo de shadcn/ui",
    description: "Múltiplos componentes shadcn/ui, biblioteca padrão de ferramentas como v0.",
    score: 12,
    minMatches: 5, // Precisa ter 5+ componentes diferentes
  },
  {
    patterns: [
      /cn\s*\(\s*["'`][^"'`]*["'`]\s*,/gi,
    ],
    indicator: "Utilitário cn() do shadcn",
    description: "Função cn() para merge de classes, padrão do shadcn/ui.",
    score: 8,
    minMatches: 3,
  },
  {
    patterns: [
      /lucide-react/gi,
    ],
    indicator: "Lucide React Icons",
    description: "Biblioteca de ícones padrão de templates de IA.",
    score: 5,
  },
]

// Indicadores FRACOS - muito comuns em qualquer projeto moderno
const WEAK_AI_INDICATORS = [
  {
    patterns: [
      /bg-gradient-to-(r|l|t|b|br|bl|tr|tl)/gi,
    ],
    indicator: "Gradientes Tailwind",
    description: "Gradientes CSS via Tailwind - comum mas não exclusivo de IA.",
    score: 2,
    minMatches: 3,
  },
  {
    patterns: [
      /hover:scale-\d+/gi,
      /transition-all\s+duration-\d+/gi,
    ],
    indicator: "Animações de Hover",
    description: "Transições CSS genéricas - usadas por humanos e IA.",
    score: 1,
    minMatches: 5,
  },
]

// Indicadores que REDUZEM a chance de ser IA
const HUMAN_INDICATORS = [
  {
    patterns: [
      /\.test\.(ts|tsx|js|jsx)/gi,
      /\.spec\.(ts|tsx|js|jsx)/gi,
      /describe\s*\(\s*["'`]/gi,
      /it\s*\(\s*["'`]/gi,
      /expect\s*\(/gi,
    ],
    indicator: "Testes Automatizados",
    description: "Presença de testes indica desenvolvimento profissional e revisado.",
    score: -25,
    minMatches: 3,
  },
  {
    patterns: [
      /eslint-disable/gi,
      /prettier-ignore/gi,
      /stylelint-disable/gi,
    ],
    indicator: "Configurações de Linter",
    description: "Exceções de linter indicam código revisado e mantido.",
    score: -10,
  },
  {
    patterns: [
      /copyright/gi,
      /license:/gi,
      /author:/gi,
      /@author/gi,
    ],
    indicator: "Metadados de Autoria",
    description: "Informações de copyright e autoria indicam projeto estabelecido.",
    score: -15,
  },
  {
    patterns: [
      /\bgit\s+commit/gi,
      /changelog/gi,
      /CONTRIBUTING\.md/gi,
      /pull\s*request/gi,
    ],
    indicator: "Histórico de Desenvolvimento",
    description: "Referências a processo de desenvolvimento colaborativo.",
    score: -20,
  },
  {
    patterns: [
      /useMemo\s*\(/gi,
      /useCallback\s*\(/gi,
      /useReducer\s*\(/gi,
      /React\.memo/gi,
      /forwardRef/gi,
    ],
    indicator: "Otimizações React",
    description: "Hooks avançados de performance indicam desenvolvimento experiente.",
    score: -12,
    minMatches: 2,
  },
  {
    patterns: [
      /error\s*boundary/gi,
      /try\s*{\s*[\s\S]*?\s*}\s*catch/gi,
      /\.catch\s*\(/gi,
    ],
    indicator: "Tratamento de Erros",
    description: "Tratamento robusto de erros indica código de produção.",
    score: -8,
    minMatches: 3,
  },
  {
    patterns: [
      /accessibility/gi,
      /aria-label/gi,
      /aria-describedby/gi,
      /role=["']/gi,
      /sr-only/gi,
    ],
    indicator: "Acessibilidade",
    description: "Atributos de acessibilidade indicam atenção a boas práticas.",
    score: -10,
    minMatches: 5,
  },
]

// Padrões de URL que indicam ferramentas de IA
const AI_URL_PATTERNS = [
  { pattern: /\.v0\.dev$/i, indicator: "Domínio v0.dev", score: 50 },
  { pattern: /v0-.*\.vercel\.app$/i, indicator: "Deploy v0 na Vercel", score: 35 },
  { pattern: /bolt-.*\.netlify\.app$/i, indicator: "Deploy Bolt.new", score: 35 },
]

// Padrões de URL neutros (não aumentam score)
const NEUTRAL_URL_PATTERNS = [
  /\.vercel\.app$/i,
  /\.netlify\.app$/i,
  /\.pages\.dev$/i,
]

async function fetchSiteContent(url: string): Promise<string | null> {
  try {
    // Usa um proxy CORS ou API para buscar o conteúdo
    const response = await fetch(`/api/fetch-site?url=${encodeURIComponent(url)}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.content
  } catch {
    return null
  }
}

function countMatches(content: string, patterns: RegExp[]): number {
  let count = 0
  for (const pattern of patterns) {
    const matches = content.match(pattern)
    if (matches) {
      count += matches.length
    }
  }
  return count
}

function analyzeContent(content: string): { score: number; reasons: AnalysisReason[] } {
  const reasons: AnalysisReason[] = []
  let score = 0
  
  // Verifica indicadores FORTES de IA
  for (const indicator of STRONG_AI_INDICATORS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches > 0) {
      reasons.push({
        indicator: indicator.indicator,
        description: indicator.description,
        weight: "high",
      })
      score += indicator.score
    }
  }
  
  // Verifica indicadores MÉDIOS de IA
  for (const indicator of MEDIUM_AI_INDICATORS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description} (${matches} ocorrências encontradas)`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // Verifica indicadores FRACOS de IA
  for (const indicator of WEAK_AI_INDICATORS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description} (${matches} ocorrências)`,
        weight: "low",
      })
      score += indicator.score
    }
  }
  
  // Verifica indicadores HUMANOS (reduzem score)
  for (const indicator of HUMAN_INDICATORS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: indicator.description,
        weight: "low",
      })
      score += indicator.score // Score é negativo
    }
  }
  
  return { score, reasons }
}

function analyzeUrl(url: string): { score: number; reasons: AnalysisReason[] } {
  const reasons: AnalysisReason[] = []
  let score = 0
  
  for (const { pattern, indicator, score: patternScore } of AI_URL_PATTERNS) {
    if (pattern.test(url)) {
      reasons.push({
        indicator,
        description: `URL indica uso de ferramenta de IA: ${url}`,
        weight: "high",
      })
      score += patternScore
      break // Só conta uma vez
    }
  }
  
  return { score, reasons }
}

export async function analyzeWebsite(url: string): Promise<AnalysisResultData> {
  const reasons: AnalysisReason[] = []
  let totalScore = 0
  
  // Simula delay de análise
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Análise da URL
  const urlAnalysis = analyzeUrl(url)
  totalScore += urlAnalysis.score
  reasons.push(...urlAnalysis.reasons)
  
  // Tenta buscar conteúdo do site
  await new Promise(resolve => setTimeout(resolve, 700))
  const content = await fetchSiteContent(url)
  
  if (content) {
    const contentAnalysis = analyzeContent(content)
    totalScore += contentAnalysis.score
    reasons.push(...contentAnalysis.reasons)
  } else {
    // Se não conseguiu buscar, faz análise mais conservadora baseada só na URL
    reasons.push({
      indicator: "Análise Limitada",
      description: "Não foi possível acessar o código fonte. Análise baseada apenas na URL.",
      weight: "low",
    })
  }
  
  // Calcula porcentagem (0-100)
  // Score base começa em 15% (benefício da dúvida)
  // Score máximo teórico é ~100, mínimo teórico é ~-100
  let percentage = 15 + Math.max(0, totalScore)
  percentage = Math.min(95, Math.max(5, percentage))
  percentage = Math.round(percentage)
  
  // Determina o veredicto
  let verdict: AnalysisResultData["verdict"]
  if (percentage <= 15) {
    verdict = "human"
  } else if (percentage <= 30) {
    verdict = "likely_human"
  } else if (percentage <= 50) {
    verdict = "mixed"
  } else if (percentage <= 70) {
    verdict = "likely_ai"
  } else {
    verdict = "ai"
  }
  
  // Ordena os motivos por peso
  const weightOrder = { high: 0, medium: 1, low: 2 }
  reasons.sort((a, b) => weightOrder[a.weight] - weightOrder[b.weight])
  
  return {
    url,
    percentage,
    verdict,
    reasons,
  }
}
