import type { AnalysisResultData, AnalysisReason } from "@/components/analysis-result"

// ==========================================
// CATEGORIA 1: ASSINATURAS DIRETAS DE IA (EVIDENCIA MUITO FORTE)
// ==========================================
const DIRECT_AI_SIGNATURES = [
  // v0.dev / Vercel
  { patterns: [/created\s*(with|by)\s*v0/gi, /built\s*(with|by)\s*v0/gi, /v0\.dev/gi, /vercel\s*v0/gi], indicator: "Assinatura v0.dev", description: "Referencia direta a ferramenta v0 da Vercel", score: 55 },
  
  // Mencoes explicitas de IA
  { patterns: [/generated\s*(by|with|using)\s*(ai|artificial\s*intelligence|gpt|claude|chatgpt|copilot)/gi, /ai[\-\s]generated/gi, /powered\s*by\s*(gpt|claude|openai|anthropic|gemini)/gi, /made\s*with\s*ai/gi], indicator: "Declaracao Explicita de IA", description: "Codigo declara abertamente ter sido criado por IA", score: 60 },
  
  // Ferramentas de IA conhecidas
  { patterns: [/cursor\.sh/gi, /cursor\s*ai/gi, /cursor\s*editor/gi], indicator: "Cursor AI", description: "Referencia ao editor Cursor com IA integrada", score: 50 },
  { patterns: [/bolt\.new/gi, /stackblitz\s*bolt/gi], indicator: "Bolt.new", description: "Referencia a ferramenta Bolt.new da StackBlitz", score: 50 },
  { patterns: [/replit\s*ai/gi, /replit\s*ghost/gi], indicator: "Replit AI", description: "Referencia ao Replit com assistente de IA", score: 50 },
  { patterns: [/lovable\.dev/gi, /made\s*with\s*lovable/gi], indicator: "Lovable.dev", description: "Referencia a ferramenta Lovable.dev", score: 55 },
  { patterns: [/windsurf/gi, /codeium\s*windsurf/gi], indicator: "Windsurf/Codeium", description: "Referencia ao Windsurf ou Codeium", score: 50 },
  { patterns: [/gptengineer/gi, /gpt\s*engineer/gi], indicator: "GPT Engineer", description: "Referencia ao GPT Engineer", score: 50 },
  { patterns: [/websim/gi, /websim\.ai/gi], indicator: "WebSim AI", description: "Referencia ao WebSim AI", score: 50 },
  
  // Comentarios tipicos de IA em templates
  { patterns: [/\/\/\s*This\s*(component|function|code)\s*(is|was)\s*(generated|created|built)/gi], indicator: "Comentario de Geracao Automatica", description: "Comentario indicando codigo gerado automaticamente", score: 45 },
  { patterns: [/\{\/\*\s*AI[\-\s]generated/gi, /<!--\s*AI[\-\s]generated/gi], indicator: "Marcador de IA em Comentario", description: "Comentario HTML/JSX marcando codigo de IA", score: 50 },
]

// ==========================================
// CATEGORIA 2: PADROES DE URL DE IA (EVIDENCIA MUITO FORTE)
// ==========================================
const AI_URL_PATTERNS = [
  // v0.dev direto
  { pattern: /\.v0\.dev/i, indicator: "Dominio v0.dev", description: "Site hospedado diretamente no v0.dev", score: 70 },
  
  // Deploy padrao do v0 na Vercel (v0-qualquercoisa.vercel.app)
  { pattern: /v0[\-_][a-z0-9\-]+\.vercel\.app/i, indicator: "Deploy v0 na Vercel", description: "Padrao de URL tipico de deploy do v0", score: 60 },
  
  // Outros padroes de ferramentas de IA
  { pattern: /bolt[\-_][a-z0-9\-]+\.(netlify\.app|vercel\.app)/i, indicator: "Deploy Bolt.new", description: "Padrao de URL de deploy do Bolt.new", score: 55 },
  { pattern: /lovable[\-_][a-z0-9\-]+\./i, indicator: "Deploy Lovable", description: "Padrao de URL de deploy do Lovable.dev", score: 55 },
  { pattern: /cursor[\-_][a-z0-9\-]+\.vercel\.app/i, indicator: "Deploy Cursor", description: "Projeto criado com Cursor AI", score: 45 },
  { pattern: /replit\.app/i, indicator: "Replit Deploy", description: "Site hospedado no Replit", score: 20 },
  
  // Padroes genericos de prototipo
  { pattern: /demo[\-_]?[a-z0-9]+\.vercel\.app/i, indicator: "Demo na Vercel", description: "Padrao de URL de demonstracao", score: 15 },
  { pattern: /test[\-_]?[a-z0-9]+\.vercel\.app/i, indicator: "Teste na Vercel", description: "Padrao de URL de teste", score: 10 },
]

// ==========================================
// CATEGORIA 3: ESTRUTURA DE CODIGO SHADCN/RADIX (FORTE)
// ==========================================
const SHADCN_COMPONENTS = [
  "button", "card", "input", "dialog", "dropdown-menu", "dropdown", "sheet", "tabs",
  "accordion", "alert", "alert-dialog", "avatar", "badge", "calendar", "checkbox",
  "collapsible", "command", "context-menu", "hover-card", "menubar", "navigation-menu",
  "popover", "progress", "radio-group", "scroll-area", "select", "separator", "skeleton",
  "slider", "switch", "table", "textarea", "toast", "toggle", "tooltip", "form", "label",
  "sonner", "drawer", "carousel", "pagination", "resizable", "breadcrumb", "sidebar"
]

// ==========================================
// CATEGORIA 4: PADROES DE DASHBOARD/APP DE IA
// ==========================================
const AI_DASHBOARD_PATTERNS = [
  // Cards de estatisticas tipicos
  { patterns: [/className=["'][^"']*rounded-(lg|xl|2xl)[^"']*bg-(card|white|gray|slate|zinc|neutral)/gi], indicator: "Cards Estatisticos Padrao", minMatches: 6, score: 8 },
  
  // Icones de iniciais/avatar
  { patterns: [/className=["'][^"']*h-\d+\s+w-\d+[^"']*rounded-full[^"']*bg-/gi, /className=["'][^"']*flex[^"']*items-center[^"']*justify-center[^"']*rounded-full/gi], indicator: "Avatares de Iniciais Padrao", minMatches: 4, score: 6 },
  
  // Tabelas com estrutura identica
  { patterns: [/<Table|<TableHeader|<TableBody|<TableRow|<TableCell|<TableHead/g], indicator: "Tabelas shadcn", minMatches: 5, score: 5 },
  
  // Sidebar padrao
  { patterns: [/Sidebar|SidebarProvider|SidebarContent|SidebarMenu|SidebarTrigger/g], indicator: "Sidebar shadcn", minMatches: 3, score: 6 },
  
  // Charts padrao
  { patterns: [/ResponsiveContainer|LineChart|BarChart|AreaChart|PieChart|RadialBarChart/g], indicator: "Charts Recharts Padrao", minMatches: 2, score: 5 },
]

// ==========================================
// CATEGORIA 5: TEXTOS E DADOS FICTICIOS TIPICOS DE IA
// ==========================================
const AI_FAKE_DATA_PATTERNS = [
  // Nomes brasileiros ficticios muito usados por IA
  { patterns: [/jo[aã]o\s*(da\s*)?(silva|santos|oliveira|souza)/gi, /maria\s*(da\s*)?(silva|santos|oliveira)/gi, /pedro\s*(henrique|lucas|paulo)/gi, /ana\s*(clara|julia|paula|beatriz)/gi], indicator: "Nomes Ficticios BR Padrao", minMatches: 2, score: 12 },
  
  // Emails ficticios
  { patterns: [/joao@|maria@|pedro@|ana@|usuario@|user@|teste@|test@|admin@exemplo|admin@example/gi], indicator: "Emails Ficticios", minMatches: 2, score: 10 },
  
  // Empresas ficticias
  { patterns: [/acme|empresa\s*exemplo|minha\s*empresa|sua\s*empresa|nome\s*da\s*empresa/gi], indicator: "Empresas Ficticias", minMatches: 1, score: 8 },
  
  // Valores monetarios redondos demais (tipico de dados fake)
  { patterns: [/R\$\s*\d+\.000,00|R\$\s*\d{1,3}\.000,00/g], indicator: "Valores Redondos Demais", minMatches: 4, score: 8 },
  
  // Datas muito convenientes
  { patterns: [/janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro/gi], indicator: "Datas por Extenso", minMatches: 3, score: 4 },
  
  // Lorem ipsum e placeholders
  { patterns: [/lorem\s*ipsum/gi], indicator: "Lorem Ipsum", minMatches: 1, score: 15 },
  { patterns: [/placeholder|exemplo\s*de|sample\s*text/gi], indicator: "Textos Placeholder", minMatches: 2, score: 8 },
]

// ==========================================
// CATEGORIA 6: ESTRUTURA VISUAL PADRAO DE IA
// ==========================================
const AI_VISUAL_PATTERNS = [
  // Saudacao com hora do dia (muito comum em dashboards de IA)
  { patterns: [/bom\s*dia|boa\s*tarde|boa\s*noite|good\s*morning|good\s*afternoon|good\s*evening/gi], indicator: "Saudacao Dinamica", minMatches: 1, score: 6 },
  
  // Gradientes decorativos
  { patterns: [/bg-gradient-to-(r|l|t|b|br|bl|tr|tl)/g], indicator: "Gradientes Tailwind", minMatches: 4, score: 4 },
  
  // Animacoes padrao
  { patterns: [/animate-pulse|animate-spin|animate-bounce|animate-ping/g], indicator: "Animacoes Padrao", minMatches: 3, score: 4 },
  
  // Efeitos hover padrao
  { patterns: [/hover:scale-\d+/g], indicator: "Hover Scale", minMatches: 5, score: 4 },
  { patterns: [/hover:bg-|hover:text-|hover:border-/g], indicator: "Hover Colors", minMatches: 10, score: 3 },
  
  // Transicoes genericas
  { patterns: [/transition-all|transition-colors|duration-\d+/g], indicator: "Transicoes Genericas", minMatches: 8, score: 3 },
  
  // Espacamento muito consistente
  { patterns: [/space-y-4|space-x-4|gap-4|gap-6|gap-8/g], indicator: "Espacamento Consistente", minMatches: 10, score: 3 },
  
  // Arredondamentos padrao
  { patterns: [/rounded-lg|rounded-xl|rounded-2xl|rounded-full/g], indicator: "Arredondamentos Padrao", minMatches: 15, score: 4 },
]

// ==========================================
// CATEGORIA 7: IMPORTS E DEPENDENCIAS DE IA
// ==========================================
const AI_IMPORT_PATTERNS = [
  // shadcn/ui extensivo
  { patterns: [/@\/components\/ui\//g], indicator: "Imports shadcn/ui", minMatches: 8, score: 10 },
  
  // Lucide icons
  { patterns: [/from\s*["']lucide-react["']/g, /lucide-react/g], indicator: "Lucide React", minMatches: 3, score: 6 },
  
  // Radix UI
  { patterns: [/@radix-ui\//g], indicator: "Radix UI", minMatches: 5, score: 6 },
  
  // clsx/cn
  { patterns: [/\bcn\s*\(/g], indicator: "Funcao cn()", minMatches: 8, score: 6 },
  
  // class-variance-authority
  { patterns: [/class-variance-authority|cva\s*\(/g], indicator: "CVA", minMatches: 2, score: 5 },
  
  // tailwind-merge
  { patterns: [/tailwind-merge|twMerge/g], indicator: "Tailwind Merge", minMatches: 1, score: 3 },
]

// ==========================================
// CATEGORIA 8: CODIGO BOILERPLATE DE IA
// ==========================================
const AI_BOILERPLATE_PATTERNS = [
  // Estrutura de page/layout Next.js muito limpa
  { patterns: [/export\s+default\s+function\s+(Page|Home|Dashboard|Layout)\s*\(/g], indicator: "Componentes Nomeados Genericamente", minMatches: 1, score: 4 },
  
  // "use client" no topo
  { patterns: [/"use client"/g], indicator: "use client Directive", minMatches: 1, score: 2 },
  
  // Metadata padrao
  { patterns: [/export\s+const\s+metadata\s*[:=]/g], indicator: "Metadata Export", minMatches: 1, score: 2 },
  
  // Comentarios de secao
  { patterns: [/\{\/\*\s*(Header|Hero|Footer|Sidebar|Main|Content|Features?|Pricing|CTA)\s*(Section)?\s*\*\/\}/gi, /<!--\s*(Header|Hero|Footer|Sidebar|Main|Content|Features?|Pricing|CTA)\s*(Section)?\s*-->/gi], indicator: "Comentarios de Secao", minMatches: 3, score: 6 },
  
  // className muito longo (tipico de IA que junta muitas classes)
  { patterns: [/className=["'][^"']{100,}["']/g], indicator: "Classes Muito Longas", minMatches: 5, score: 6 },
  
  // Flex center padrao
  { patterns: [/flex\s+items-center\s+justify-center|flex\s+flex-col\s+items-center/g], indicator: "Flex Center Padrao", minMatches: 8, score: 4 },
  
  // Min-h-screen
  { patterns: [/min-h-screen/g], indicator: "Min-h-screen", minMatches: 2, score: 2 },
]

// ==========================================
// CATEGORIA 9: FRASES E COMENTARIOS DE LLM
// ==========================================
const AI_VERBAL_PATTERNS = [
  // Comentarios explicativos demais
  { patterns: [/\/\/\s*(This|Here|We|The)\s+(is|are|will|should|can|must)/gi], indicator: "Comentarios Explicativos", minMatches: 5, score: 6 },
  
  // Frases tipicas de LLM
  { patterns: [/ensure\s+that/gi, /note\s+that/gi, /it('|')s\s+worth\s+noting/gi], indicator: "Frases de LLM", minMatches: 2, score: 8 },
  
  // Comentarios TODO genericos
  { patterns: [/\/\/\s*TODO:\s*(add|implement|fix|update|change|remove)/gi], indicator: "TODOs Genericos", minMatches: 3, score: 5 },
  
  // Descricoes muito detalhadas em comentarios
  { patterns: [/\/\/\s*\w+\s+\w+\s+\w+\s+\w+\s+\w+\s+\w+\s+\w+/g], indicator: "Comentarios Longos", minMatches: 5, score: 4 },
]

// ==========================================
// CATEGORIA 10: INDICADORES HUMANOS (REDUZEM SCORE)
// ==========================================
const HUMAN_INDICATORS = [
  // Testes automatizados
  { patterns: [/\.(test|spec)\.(ts|tsx|js|jsx)/g, /describe\s*\(\s*["'`]/g, /it\s*\(\s*["'`]/g, /expect\s*\(/g, /jest\.|vitest|cypress|playwright/gi], indicator: "Testes Automatizados", minMatches: 3, score: -35 },
  
  // TypeScript avancado
  { patterns: [/type\s+[A-Z]\w+\s*<[^>]+>/g, /interface\s+[A-Z]\w+\s*<[^>]+>/g, /as\s+const/g, /satisfies\s+/g, /infer\s+[A-Z]/g, /keyof\s+typeof/g], indicator: "TypeScript Avancado", minMatches: 4, score: -25 },
  
  // React hooks avancados
  { patterns: [/useMemo\s*\(/g, /useCallback\s*\(/g, /useReducer\s*\(/g, /useImperativeHandle\s*\(/g, /useSyncExternalStore\s*\(/g, /React\.memo\s*\(/g, /forwardRef/g], indicator: "React Avancado", minMatches: 4, score: -25 },
  
  // Error handling robusto
  { patterns: [/ErrorBoundary/g, /componentDidCatch/g, /getDerivedStateFromError/g, /new\s+Error\s*\(/g], indicator: "Error Handling Robusto", minMatches: 3, score: -18 },
  
  // Acessibilidade avancada
  { patterns: [/aria-describedby/g, /aria-labelledby/g, /aria-live/g, /role=["'](dialog|alertdialog|menu|tree|grid|listbox)/g], indicator: "Acessibilidade Avancada", minMatches: 4, score: -20 },
  
  // JSDoc detalhado
  { patterns: [/@param\s+\{[^}]+\}/g, /@returns?\s+\{[^}]+\}/g, /@example/g, /@throws/g], indicator: "JSDoc Detalhado", minMatches: 3, score: -15 },
  
  // CI/CD
  { patterns: [/\.github\/workflows/g, /gitlab-ci/g, /Dockerfile/g, /docker-compose/g], indicator: "CI/CD Configurado", minMatches: 1, score: -25 },
  
  // Linting configurado
  { patterns: [/eslint-disable-next-line/g, /prettier-ignore/g, /@ts-expect-error/g], indicator: "Linting Configurado", minMatches: 2, score: -12 },
  
  // Internacionalizacao
  { patterns: [/next-intl|react-intl|i18next/g, /useTranslation/g, /formatMessage/g], indicator: "Internacionalizacao", minMatches: 2, score: -18 },
  
  // Monitoramento
  { patterns: [/sentry|datadog|newrelic|logrocket|bugsnag/gi], indicator: "Monitoramento", minMatches: 1, score: -15 },
  
  // State management complexo
  { patterns: [/zustand|jotai|recoil|xstate|redux-toolkit|@reduxjs\/toolkit/gi], indicator: "State Management Avancado", minMatches: 1, score: -15 },
  
  // Comentarios com contexto de negocio
  { patterns: [/\/\/\s*(BUG|FIX|HACK|WORKAROUND|LEGACY|TECH.?DEBT):/gi, /\/\/\s*@see\s+(https?:|JIRA|TICKET|#\d+)/gi, /\/\/\s*(per|as per|according to)\s+(client|design|spec|PM|product)/gi], indicator: "Comentarios de Negocio", minMatches: 2, score: -15 },
  
  // Variaveis de ambiente customizadas
  { patterns: [/process\.env\.[A-Z_]{10,}/g, /NEXT_PUBLIC_(?!VERCEL)[A-Z_]{5,}/g], indicator: "Env Vars Customizadas", minMatches: 2, score: -10 },
  
  // Logica de negocio complexa
  { patterns: [/switch\s*\([^)]+\)\s*\{[\s\S]*case[\s\S]*case[\s\S]*case/g], indicator: "Logica Complexa (Switch)", minMatches: 1, score: -10 },
  
  // Regex complexos
  { patterns: [/new\s+RegExp\s*\([^)]{30,}\)/g, /\/[^\/]{30,}\/[gimsuy]*/g], indicator: "Regex Complexos", minMatches: 2, score: -12 },
]

// ==========================================
// FUNCOES DE ANALISE
// ==========================================

function countMatches(content: string, patterns: RegExp[]): number {
  let count = 0
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, pattern.flags)
    const matches = content.match(regex)
    if (matches) {
      count += matches.length
    }
  }
  return count
}

function countShadcnComponents(content: string): number {
  let count = 0
  const uniqueComponents = new Set<string>()
  
  for (const component of SHADCN_COMPONENTS) {
    // Regex para import do componente
    const importRegex = new RegExp(`@/components/ui/${component}|from\\s*["'].*/${component}["']`, "gi")
    // Regex para uso do componente (capitalizado)
    const capitalizedName = component.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("")
    const usageRegex = new RegExp(`<${capitalizedName}[\\s/>]`, "g")
    
    const importMatches = content.match(importRegex)
    const usageMatches = content.match(usageRegex)
    
    if (importMatches || usageMatches) {
      uniqueComponents.add(component)
      count += (importMatches?.length || 0) + (usageMatches?.length || 0)
    }
  }
  
  return uniqueComponents.size
}

function analyzeContent(content: string): { score: number; reasons: AnalysisReason[] } {
  const reasons: AnalysisReason[] = []
  let score = 0
  
  // 1. ASSINATURAS DIRETAS (mais importante)
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
  
  // 2. PADROES DE DASHBOARD
  for (const indicator of AI_DASHBOARD_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${matches} ocorrencias encontradas`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 3. DADOS FICTICIOS
  for (const indicator of AI_FAKE_DATA_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${matches} ocorrencias encontradas`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 4. PADROES VISUAIS
  for (const indicator of AI_VISUAL_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${matches} ocorrencias encontradas`,
        weight: "low",
      })
      score += indicator.score
    }
  }
  
  // 5. IMPORTS DE IA
  for (const indicator of AI_IMPORT_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${matches} ocorrencias encontradas`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 6. BOILERPLATE
  for (const indicator of AI_BOILERPLATE_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${matches} ocorrencias encontradas`,
        weight: "low",
      })
      score += indicator.score
    }
  }
  
  // 7. PADROES VERBAIS
  for (const indicator of AI_VERBAL_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${matches} ocorrencias encontradas`,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 8. COMPONENTES SHADCN (analise especial)
  const shadcnCount = countShadcnComponents(content)
  if (shadcnCount >= 5) {
    reasons.push({
      indicator: "Stack shadcn/ui Completa",
      description: `${shadcnCount} componentes shadcn/ui diferentes detectados`,
      weight: shadcnCount >= 10 ? "high" : "medium",
    })
    score += shadcnCount >= 10 ? 18 : (shadcnCount >= 7 ? 12 : 8)
  }
  
  // 9. INDICADORES HUMANOS (REDUZEM SCORE)
  for (const indicator of HUMAN_INDICATORS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({
        indicator: indicator.indicator,
        description: indicator.indicator,
        weight: "low",
      })
      score += indicator.score // Score e negativo
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
      break // Pega apenas o primeiro match de URL
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
  
  // Analise da URL primeiro (muito importante para deteccao de v0)
  const urlAnalysis = analyzeUrl(url)
  totalScore += urlAnalysis.score
  reasons.push(...urlAnalysis.reasons)
  
  // Tenta buscar conteudo do site
  const content = await fetchSiteContent(url)
  
  if (content) {
    const contentAnalysis = analyzeContent(content)
    totalScore += contentAnalysis.score
    reasons.push(...contentAnalysis.reasons)
    
    // Info sobre analise
    if (content.length > 5000) {
      reasons.push({
        indicator: "Analise Completa",
        description: `Analisados ${Math.round(content.length / 1000)}KB de codigo fonte`,
        weight: "low",
      })
    }
  } else {
    reasons.push({
      indicator: "Analise Limitada",
      description: "Nao foi possivel acessar o codigo fonte. Analise baseada apenas na URL",
      weight: "low",
    })
  }
  
  // Calcula porcentagem final
  // Score base: 10% (beneficio da duvida)
  let percentage = 10 + Math.max(0, totalScore)
  
  // Se tem evidencia forte de URL, garante minimo de 50%
  const hasUrlEvidence = urlAnalysis.score >= 45
  if (hasUrlEvidence && percentage < 55) {
    percentage = 55
  }
  
  // Se nao tem NENHUMA evidencia forte, limita a 40%
  const hasStrongEvidence = reasons.some(r => r.weight === "high")
  if (!hasStrongEvidence && percentage > 40) {
    percentage = 40
  }
  
  // Limites finais
  percentage = Math.min(95, Math.max(5, percentage))
  percentage = Math.round(percentage)
  
  // Determina o veredicto
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
  
  // Ordena: high primeiro, depois medium, depois low
  const weightOrder = { high: 0, medium: 1, low: 2 }
  reasons.sort((a, b) => weightOrder[a.weight] - weightOrder[b.weight])
  
  return {
    url,
    percentage,
    verdict,
    reasons,
  }
}
