import type { AnalysisResultData, AnalysisReason } from "@/components/analysis-result"

// ==========================================
// ASSINATURAS DIRETAS DE IA (EVIDÊNCIA FORTE)
// ==========================================
const DIRECT_AI_SIGNATURES = [
  // v0.dev / Vercel
  { patterns: [/created\s*(with|by)\s*v0/gi, /built\s*(with|by)\s*v0/gi, /v0\.dev/gi, /vercel\s*v0/gi], indicator: "Assinatura v0.dev", description: "Referência direta à ferramenta v0 da Vercel.", score: 45 },
  
  // Menções explícitas de IA
  { patterns: [/generated\s*(by|with|using)\s*(ai|artificial\s*intelligence|gpt|claude|chatgpt|copilot)/gi, /ai[\-\s]generated/gi, /powered\s*by\s*(gpt|claude|openai|anthropic|gemini)/gi, /made\s*with\s*ai/gi], indicator: "Declaração Explícita de IA", description: "Código declara abertamente ter sido criado por IA.", score: 50 },
  
  // Ferramentas de IA conhecidas
  { patterns: [/cursor\.sh/gi, /cursor\s*ai/gi, /cursor\s*editor/gi], indicator: "Cursor AI", description: "Referência ao editor Cursor com IA integrada.", score: 40 },
  { patterns: [/bolt\.new/gi, /stackblitz\s*bolt/gi], indicator: "Bolt.new", description: "Referência à ferramenta Bolt.new da StackBlitz.", score: 40 },
  { patterns: [/replit\s*ai/gi, /replit\s*ghost/gi], indicator: "Replit AI", description: "Referência ao Replit com assistente de IA.", score: 40 },
  { patterns: [/lovable\.dev/gi, /made\s*with\s*lovable/gi], indicator: "Lovable.dev", description: "Referência à ferramenta Lovable.dev.", score: 45 },
  { patterns: [/windsurf/gi, /codeium\s*windsurf/gi], indicator: "Windsurf/Codeium", description: "Referência ao Windsurf ou Codeium.", score: 40 },
  
  // Comentários típicos de IA
  { patterns: [/\/\/\s*This\s*(component|function|code)\s*(is|was)\s*(generated|created|built)/gi], indicator: "Comentário de Geração", description: "Comentário indicando código gerado automaticamente.", score: 35 },
  { patterns: [/\{\/\*\s*AI[\-\s]generated/gi, /<!--\s*AI[\-\s]generated/gi], indicator: "Marcador de IA em Comentário", description: "Comentário HTML/JSX marcando código de IA.", score: 40 },
]

// ==========================================
// PADRÕES DE ESTRUTURA DE CÓDIGO IA
// ==========================================
const AI_CODE_PATTERNS = [
  // shadcn/ui extensivo
  {
    patterns: [
      /@\/components\/ui\/(button|card|input|dialog|dropdown|sheet|tabs|accordion|alert|avatar|badge|calendar|checkbox|collapsible|command|context-menu|hover-card|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|skeleton|slider|switch|table|textarea|toast|toggle|tooltip|form|label|sonner|drawer)/gi,
    ],
    indicator: "shadcn/ui Extensivo",
    description: "Uso massivo de componentes shadcn/ui - stack padrão de ferramentas de IA.",
    score: 15,
    minMatches: 6,
  },
  
  // Função cn() do shadcn
  {
    patterns: [/\bcn\s*\(/gi],
    indicator: "Utilitário cn()",
    description: "Função cn() para classes CSS - padrão do shadcn/ui.",
    score: 8,
    minMatches: 4,
  },
  
  // clsx/class-variance-authority
  {
    patterns: [/class-variance-authority/gi, /\bcva\s*\(/gi],
    indicator: "class-variance-authority",
    description: "Biblioteca CVA para variantes de componentes - comum em templates de IA.",
    score: 6,
    minMatches: 2,
  },
  
  // Lucide icons extensivo
  {
    patterns: [/from\s*["']lucide-react["']/gi, /import\s*\{[^}]+\}\s*from\s*["']lucide-react/gi],
    indicator: "Lucide React Extensivo",
    description: "Múltiplos ícones Lucide - biblioteca padrão de ferramentas de IA.",
    score: 6,
    minMatches: 3,
  },
  
  // Radix UI
  {
    patterns: [/@radix-ui\/(react-)?/gi],
    indicator: "Radix UI Primitives",
    description: "Componentes Radix UI - base do shadcn/ui.",
    score: 4,
    minMatches: 3,
  },
]

// ==========================================
// PADRÕES DE TAILWIND GENÉRICOS (IA adora usar)
// ==========================================
const AI_TAILWIND_PATTERNS = [
  // Combos de centralização excessiva
  {
    patterns: [/flex\s+items-center\s+justify-center/gi, /flex\s+flex-col\s+items-center/gi],
    indicator: "Centralização Repetitiva",
    description: "Padrão flex items-center justify-center usado excessivamente.",
    score: 4,
    minMatches: 8,
  },
  
  // Gradientes
  {
    patterns: [/bg-gradient-to-(r|l|t|b|br|bl|tr|tl)/gi],
    indicator: "Gradientes Tailwind",
    description: "Múltiplos gradientes - IA tende a usar decorações visuais genéricas.",
    score: 3,
    minMatches: 4,
  },
  
  // Animações hover genéricas
  {
    patterns: [/hover:scale-\d+/gi],
    indicator: "Scale no Hover",
    description: "Efeito hover:scale repetitivo.",
    score: 2,
    minMatches: 5,
  },
  
  // Transições genéricas
  {
    patterns: [/transition-all\s+duration-\d+/gi],
    indicator: "Transições Genéricas",
    description: "transition-all duration usado em excesso.",
    score: 2,
    minMatches: 6,
  },
  
  // Spacing patterns repetitivos
  {
    patterns: [/space-y-4/gi, /space-y-6/gi, /gap-4/gi, /gap-6/gi],
    indicator: "Spacing Repetitivo",
    description: "Mesmo valor de spacing usado repetidamente.",
    score: 2,
    minMatches: 10,
  },
]

// ==========================================
// PADRÕES DE TEXTO/COPY GENÉRICOS
// ==========================================
const AI_COPY_PATTERNS = [
  // Placeholders clássicos
  {
    patterns: [/lorem\s*ipsum/gi],
    indicator: "Lorem Ipsum",
    description: "Texto placeholder não substituído.",
    score: 8,
  },
  
  // Textos genéricos de landing page
  {
    patterns: [
      /welcome\s*to\s*(our|the)\s*(website|platform|app)/gi,
      /get\s*started\s*today/gi,
      /join\s*(us|our)\s*(community|newsletter)/gi,
      /trusted\s*by\s*(thousands|millions)/gi,
      /start\s*your\s*free\s*trial/gi,
    ],
    indicator: "Copy Genérico de Landing",
    description: "Textos de marketing muito genéricos típicos de templates.",
    score: 4,
    minMatches: 3,
  },
  
  // Nomes de exemplo
  {
    patterns: [
      /john\s*(doe|smith)/gi,
      /jane\s*(doe|smith)/gi,
      /acme\s*(corp|inc|company)/gi,
      /example\.(com|org|net)/gi,
      /your[\-\s]*(name|email|company)[\-\s]*here/gi,
    ],
    indicator: "Dados de Exemplo",
    description: "Nomes e emails de exemplo não substituídos.",
    score: 6,
    minMatches: 2,
  },
]

// ==========================================
// PADRÕES DE COMENTÁRIOS DE IA
// ==========================================
const AI_COMMENT_PATTERNS = [
  // Comentários de seção muito óbvios
  {
    patterns: [
      /<!--\s*(Hero|Header|Footer|Navbar|Navigation|Features?|Pricing|Testimonials?|CTA|FAQ|About)\s*Section\s*-->/gi,
      /\{\/\*\s*(Hero|Header|Footer|Navbar|Navigation|Features?|Pricing|Testimonials?|CTA|FAQ|About)\s*Section\s*\*\/\}/gi,
      /\/\/\s*(Hero|Header|Footer|Navbar|Features?|Pricing|Testimonials?|CTA|FAQ|About)\s*Section/gi,
    ],
    indicator: "Comentários de Seção Óbvios",
    description: "Comentários descrevendo seções de forma muito literal - padrão de IA.",
    score: 6,
    minMatches: 3,
  },
  
  // TODO genéricos
  {
    patterns: [
      /\/\/\s*TODO:\s*(add|implement|fix|update|change)/gi,
      /\{\/\*\s*TODO:\s*(add|implement|fix|update|change)/gi,
    ],
    indicator: "TODOs Genéricos",
    description: "Comentários TODO muito genéricos deixados por IA.",
    score: 4,
    minMatches: 3,
  },
]

// ==========================================
// PADRÕES DE URL/HOSPEDAGEM
// ==========================================
const AI_URL_PATTERNS = [
  { pattern: /\.v0\.dev$/i, indicator: "Domínio v0.dev", description: "Site hospedado diretamente no v0.dev.", score: 55 },
  { pattern: /v0-[a-z0-9]+\.vercel\.app$/i, indicator: "Deploy v0 na Vercel", description: "Padrão de URL de deploy do v0.", score: 40 },
  { pattern: /bolt-[a-z0-9]+\.(netlify\.app|vercel\.app)/i, indicator: "Deploy Bolt.new", description: "Padrão de URL de deploy do Bolt.new.", score: 40 },
  { pattern: /lovable-[a-z0-9]+\./i, indicator: "Deploy Lovable", description: "Padrão de URL de deploy do Lovable.dev.", score: 40 },
]

// ==========================================
// INDICADORES QUE REDUZEM SCORE (HUMANO)
// ==========================================
const HUMAN_INDICATORS = [
  // Testes automatizados
  {
    patterns: [
      /\.(test|spec)\.(ts|tsx|js|jsx)/gi,
      /describe\s*\(\s*["'`]/gi,
      /it\s*\(\s*["'`](should|when|given)/gi,
      /expect\s*\([^)]+\)\.(toBe|toEqual|toHaveLength|toContain|toThrow|toMatch)/gi,
      /jest\.(fn|mock|spyOn)/gi,
      /vitest/gi,
      /@testing-library/gi,
    ],
    indicator: "Testes Automatizados",
    description: "Presença de testes indica desenvolvimento profissional e revisado.",
    score: -25,
    minMatches: 4,
  },
  
  // TypeScript avançado
  {
    patterns: [
      /type\s+[A-Z]\w+\s*<[^>]+>/gi,
      /interface\s+[A-Z]\w+\s*<[^>]+>/gi,
      /as\s+const/gi,
      /satisfies\s+/gi,
      /infer\s+/gi,
      /keyof\s+typeof/gi,
    ],
    indicator: "TypeScript Avançado",
    description: "Uso de recursos avançados de TypeScript indica experiência.",
    score: -15,
    minMatches: 3,
  },
  
  // Hooks avançados React
  {
    patterns: [
      /useMemo\s*\(\s*\(\s*\)/gi,
      /useCallback\s*\(\s*\(/gi,
      /useReducer\s*\(/gi,
      /useImperativeHandle\s*\(/gi,
      /useSyncExternalStore\s*\(/gi,
      /useTransition\s*\(/gi,
      /useDeferredValue\s*\(/gi,
      /React\.memo\s*\(/gi,
      /forwardRef\s*\(/gi,
    ],
    indicator: "React Avançado",
    description: "Hooks de performance e padrões avançados de React.",
    score: -18,
    minMatches: 3,
  },
  
  // Tratamento de erros robusto
  {
    patterns: [
      /try\s*\{[\s\S]{20,}?\}\s*catch\s*\([^)]+\)\s*\{[\s\S]{10,}?\}/gi,
      /\.catch\s*\(\s*\([^)]+\)\s*=>\s*\{/gi,
      /ErrorBoundary/gi,
      /onError\s*[=:]/gi,
      /fallback\s*[=:]/gi,
    ],
    indicator: "Tratamento de Erros Robusto",
    description: "Error handling detalhado indica código de produção.",
    score: -12,
    minMatches: 3,
  },
  
  // Acessibilidade
  {
    patterns: [
      /aria-label=["'][^"']{10,}["']/gi,
      /aria-describedby/gi,
      /aria-labelledby/gi,
      /aria-live/gi,
      /role=["'](button|dialog|alert|navigation|main|complementary|contentinfo|form|search)/gi,
      /sr-only/gi,
      /focus-visible/gi,
      /tabIndex/gi,
    ],
    indicator: "Acessibilidade",
    description: "Implementação cuidadosa de ARIA e acessibilidade.",
    score: -15,
    minMatches: 6,
  },
  
  // Documentação/Comentários úteis
  {
    patterns: [
      /\/\*\*[\s\S]{50,}?\*\//gi, // JSDoc extenso
      /@param\s+\{/gi,
      /@returns?\s+\{/gi,
      /@example/gi,
      /@deprecated/gi,
    ],
    indicator: "Documentação JSDoc",
    description: "Documentação detalhada de código.",
    score: -12,
    minMatches: 3,
  },
  
  // Configuração de projeto madura
  {
    patterns: [
      /eslint-disable-next-line/gi,
      /prettier-ignore/gi,
      /stylelint-disable/gi,
      /@ts-expect-error/gi,
      /\.eslintrc/gi,
      /\.prettierrc/gi,
      /husky/gi,
      /lint-staged/gi,
    ],
    indicator: "Configuração de Linter",
    description: "Configuração de ferramentas indica projeto maduro.",
    score: -10,
    minMatches: 2,
  },
  
  // CI/CD e DevOps
  {
    patterns: [
      /\.github\/workflows/gi,
      /gitlab-ci/gi,
      /Dockerfile/gi,
      /docker-compose/gi,
      /kubernetes/gi,
      /terraform/gi,
    ],
    indicator: "CI/CD e DevOps",
    description: "Configuração de infraestrutura e deploy automatizado.",
    score: -20,
    minMatches: 1,
  },
  
  // Git e versionamento
  {
    patterns: [
      /CHANGELOG\.md/gi,
      /CONTRIBUTING\.md/gi,
      /\.gitignore/gi,
      /semantic-release/gi,
      /conventional-commits/gi,
    ],
    indicator: "Práticas de Versionamento",
    description: "Documentação de contribuição e changelog.",
    score: -12,
    minMatches: 2,
  },
  
  // Código legado/migrado
  {
    patterns: [
      /deprecated/gi,
      /legacy/gi,
      /migration/gi,
      /backward.?compat/gi,
    ],
    indicator: "Código com Histórico",
    description: "Menções a código legado indicam projeto com histórico.",
    score: -8,
    minMatches: 2,
  },
  
  // Internacionalização
  {
    patterns: [
      /i18n/gi,
      /next-intl/gi,
      /react-intl/gi,
      /useTranslation/gi,
      /t\s*\(\s*["'][a-z]+\./gi,
    ],
    indicator: "Internacionalização",
    description: "Suporte a múltiplos idiomas indica projeto maduro.",
    score: -15,
    minMatches: 3,
  },
  
  // Performance otimizada
  {
    patterns: [
      /lazy\s*\(\s*\(\s*\)\s*=>\s*import/gi,
      /Suspense/gi,
      /dynamic\s*\(\s*\(\s*\)\s*=>/gi,
      /prefetch/gi,
      /preload/gi,
    ],
    indicator: "Otimização de Performance",
    description: "Code splitting e lazy loading indicam otimização.",
    score: -10,
    minMatches: 2,
  },
  
  // Monitoramento e analytics personalizados
  {
    patterns: [
      /sentry/gi,
      /datadog/gi,
      /newrelic/gi,
      /logflare/gi,
      /mixpanel/gi,
      /amplitude/gi,
    ],
    indicator: "Monitoramento",
    description: "Integração com ferramentas de monitoramento.",
    score: -12,
    minMatches: 1,
  },
]

// ==========================================
// FUNÇÕES DE ANÁLISE
// ==========================================

function countMatches(content: string, patterns: RegExp[]): number {
  let count = 0
  for (const pattern of patterns) {
    // Reset lastIndex para regex global
    pattern.lastIndex = 0
    const matches = content.match(pattern)
    if (matches) {
      count += matches.length
    }
  }
  return count
}

function getUniqueMatches(content: string, patterns: RegExp[]): Set<string> {
  const uniqueMatches = new Set<string>()
  for (const pattern of patterns) {
    pattern.lastIndex = 0
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(m => uniqueMatches.add(m.toLowerCase()))
    }
  }
  return uniqueMatches
}

function analyzeContent(content: string): { score: number; reasons: AnalysisReason[] } {
  const reasons: AnalysisReason[] = []
  let score = 0
  
  // 1. Verifica assinaturas DIRETAS de IA (mais importantes)
  for (const indicator of DIRECT_AI_SIGNATURES) {
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
  
  // 2. Verifica padrões de código de IA
  for (const indicator of AI_CODE_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description} (${matches} ocorrências)`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 3. Verifica padrões de Tailwind genéricos
  for (const indicator of AI_TAILWIND_PATTERNS) {
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
  
  // 4. Verifica padrões de copy/texto genérico
  for (const indicator of AI_COPY_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description}`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 5. Verifica padrões de comentários de IA
  for (const indicator of AI_COMMENT_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description} (${matches} encontrados)`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 6. Verifica indicadores HUMANOS (reduzem score)
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
  
  for (const { pattern, indicator, description, score: patternScore } of AI_URL_PATTERNS) {
    if (pattern.test(url)) {
      reasons.push({
        indicator,
        description,
        weight: "high",
      })
      score += patternScore
      break
    }
  }
  
  return { score, reasons }
}

async function fetchSiteContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/fetch-site?url=${encodeURIComponent(url)}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.content
  } catch {
    return null
  }
}

export async function analyzeWebsite(url: string): Promise<AnalysisResultData> {
  const reasons: AnalysisReason[] = []
  let totalScore = 0
  
  // Análise da URL primeiro
  const urlAnalysis = analyzeUrl(url)
  totalScore += urlAnalysis.score
  reasons.push(...urlAnalysis.reasons)
  
  // Tenta buscar conteúdo do site
  const content = await fetchSiteContent(url)
  
  if (content) {
    const contentAnalysis = analyzeContent(content)
    totalScore += contentAnalysis.score
    reasons.push(...contentAnalysis.reasons)
    
    // Adiciona informação sobre análise completa
    if (content.length > 10000) {
      reasons.push({
        indicator: "Análise Completa",
        description: `Analisados ${Math.round(content.length / 1000)}KB de código fonte.`,
        weight: "low",
      })
    }
  } else {
    reasons.push({
      indicator: "Análise Limitada",
      description: "Não foi possível acessar o código fonte. Análise baseada apenas na URL e metadados.",
      weight: "low",
    })
    // Se não conseguiu analisar conteúdo, reduz confiança
    totalScore = Math.min(totalScore, 30)
  }
  
  // Calcula porcentagem final
  // Score base: 10% (muito conservador)
  // Só aumenta significativamente com evidências fortes
  let percentage = 10 + Math.max(0, totalScore)
  
  // Se não tem NENHUMA evidência forte, limita a 35%
  const hasStrongEvidence = reasons.some(r => r.weight === "high")
  if (!hasStrongEvidence && percentage > 35) {
    percentage = 35
  }
  
  // Limites finais
  percentage = Math.min(95, Math.max(5, percentage))
  percentage = Math.round(percentage)
  
  // Determina o veredicto com critérios mais rigorosos
  let verdict: AnalysisResultData["verdict"]
  if (percentage <= 20) {
    verdict = "human"
  } else if (percentage <= 35) {
    verdict = "likely_human"
  } else if (percentage <= 55) {
    verdict = "mixed"
  } else if (percentage <= 75) {
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
