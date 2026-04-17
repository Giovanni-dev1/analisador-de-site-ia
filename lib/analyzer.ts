import type { AnalysisResultData, AnalysisReason } from "@/components/analysis-result"

// ==========================================
// CATEGORIA 1: ASSINATURAS DIRETAS DE IA (EVIDENCIA MUITO FORTE)
// ==========================================
const DIRECT_AI_SIGNATURES = [
  // v0.dev / Vercel
  {
    patterns: [/created\s*(with|by)\s*v0/gi, /built\s*(with|by)\s*v0/gi, /v0\.dev/gi, /vercel\s*v0/gi],
    indicator: "Assinatura v0.dev",
    description: "Referencia direta a ferramenta v0 da Vercel",
    score: 55,
  },

  // Declaracoes explicitas de IA
  {
    patterns: [
      /generated\s*(by|with|using)\s*(ai|artificial\s*intelligence|gpt|claude|chatgpt|copilot)/gi,
      /ai[\-\s]generated/gi,
      /powered\s*by\s*(gpt|claude|openai|anthropic|gemini)/gi,
      /made\s*with\s*ai/gi,
    ],
    indicator: "Declaracao Explicita de IA",
    description: "Codigo declara abertamente ter sido criado por IA",
    score: 60,
  },

  // Ferramentas de IA conhecidas
  { patterns: [/cursor\.sh/gi, /cursor\s*ai/gi, /cursor\s*editor/gi], indicator: "Cursor AI", description: "Referencia ao editor Cursor com IA integrada", score: 50 },
  { patterns: [/bolt\.new/gi, /stackblitz\s*bolt/gi], indicator: "Bolt.new", description: "Referencia a ferramenta Bolt.new da StackBlitz", score: 50 },
  { patterns: [/replit\s*ai/gi, /replit\s*ghost/gi], indicator: "Replit AI", description: "Referencia ao Replit com assistente de IA", score: 50 },
  { patterns: [/lovable\.dev/gi, /made\s*with\s*lovable/gi], indicator: "Lovable.dev", description: "Referencia a ferramenta Lovable.dev", score: 55 },
  { patterns: [/windsurf/gi, /codeium\s*windsurf/gi], indicator: "Windsurf/Codeium", description: "Referencia ao Windsurf ou Codeium", score: 50 },
  { patterns: [/gptengineer/gi, /gpt\s*engineer/gi], indicator: "GPT Engineer", description: "Referencia ao GPT Engineer", score: 50 },
  { patterns: [/websim/gi, /websim\.ai/gi], indicator: "WebSim AI", description: "Referencia ao WebSim AI", score: 50 },

  // NOVOS: Framer AI, Durable, Wix ADI, GitHub Copilot Workspace
  { patterns: [/framer\.com\/motion/gi, /framer\s*ai/gi, /made\s*with\s*framer/gi], indicator: "Framer AI", description: "Referencia ao Framer ou Framer AI", score: 40 },
  { patterns: [/durable\.co/gi, /built\s*with\s*durable/gi], indicator: "Durable AI", description: "Site criado com Durable AI Website Builder", score: 55 },
  { patterns: [/locofy\.ai/gi, /anima\.app/gi, /figma[\-\s]to[\-\s]code/gi], indicator: "Figma-to-Code", description: "Referencia a ferramenta de conversao Figma para codigo", score: 45 },
  { patterns: [/copilot\s*workspace/gi, /github\s*copilot/gi], indicator: "GitHub Copilot", description: "Referencia ao GitHub Copilot Workspace", score: 40 },
  { patterns: [/wix\s*adi/gi, /created\s*with\s*wix/gi], indicator: "Wix ADI", description: "Site criado com o assistente de design Wix ADI", score: 45 },
  { patterns: [/squarespace/gi], indicator: "Squarespace", description: "Site hospedado/criado no Squarespace", score: 30 },
  { patterns: [/webflow\.com/gi, /made\s*in\s*webflow/gi], indicator: "Webflow", description: "Site criado no Webflow", score: 25 },
  { patterns: [/devin\.ai/gi, /cognition[\-\s]ai/gi], indicator: "Devin AI", description: "Referencia ao agente de software Devin", score: 50 },

  // Comentarios tipicos de IA
  {
    patterns: [/\/\/\s*This\s*(component|function|code)\s*(is|was)\s*(generated|created|built)/gi],
    indicator: "Comentario de Geracao Automatica",
    description: "Comentario indicando codigo gerado automaticamente",
    score: 45,
  },
  {
    patterns: [/\{\/\*\s*AI[\-\s]generated/gi, /<!--\s*AI[\-\s]generated/gi],
    indicator: "Marcador de IA em Comentario",
    description: "Comentario HTML/JSX marcando codigo de IA",
    score: 50,
  },
]

// ==========================================
// CATEGORIA 2: META-TAGS DE GERADORES (EVIDENCIA FORTE) — NOVO
// ==========================================
const AI_METATAG_PATTERNS = [
  { pattern: /<meta[^>]+name=["']generator["'][^>]+content=["'][^"']*(wix|squarespace|webflow|framer|durable|wordpress\.com|weebly|jimdo)/gi, indicator: "Meta Generator de Plataforma", description: "Meta-tag 'generator' aponta para plataforma construtora de sites", score: 40 },
  { pattern: /<meta[^>]+name=["']generator["'][^>]+content=["'][^"']*(v0|bolt|lovable|cursor)/gi, indicator: "Meta Generator de IA", description: "Meta-tag 'generator' aponta diretamente para ferramenta de IA", score: 55 },
  // Wix injeta isso no body
  { pattern: /wix-code|wixsite\.com|wix\.com\/lpviral/gi, indicator: "Infraestrutura Wix", description: "Scripts ou links de infraestrutura do Wix detectados", score: 40 },
  // WordPress.com (nao self-hosted) e page builders
  { pattern: /elementor|divi\s*builder|beaver\s*builder|visual\s*composer/gi, indicator: "Page Builder WordPress", description: "Page builder visual do WordPress detectado", score: 20 },
]

// ==========================================
// CATEGORIA 3: PADROES DE URL DE IA (EVIDENCIA MUITO FORTE)
// ==========================================
const AI_URL_PATTERNS = [
  { pattern: /\.v0\.dev/i, indicator: "Dominio v0.dev", description: "Site hospedado diretamente no v0.dev", score: 70 },
  { pattern: /v0[\-_][a-z0-9\-]+\.vercel\.app/i, indicator: "Deploy v0 na Vercel", description: "Padrao de URL tipico de deploy do v0", score: 60 },
  { pattern: /bolt[\-_][a-z0-9\-]+\.(netlify\.app|vercel\.app)/i, indicator: "Deploy Bolt.new", description: "Padrao de URL de deploy do Bolt.new", score: 55 },
  { pattern: /lovable[\-_][a-z0-9\-]+\./i, indicator: "Deploy Lovable", description: "Padrao de URL de deploy do Lovable.dev", score: 55 },
  { pattern: /cursor[\-_][a-z0-9\-]+\.vercel\.app/i, indicator: "Deploy Cursor", description: "Projeto criado com Cursor AI", score: 45 },
  { pattern: /replit\.app/i, indicator: "Replit Deploy", description: "Site hospedado no Replit", score: 20 },
  // NOVOS
  { pattern: /\.framer\.app/i, indicator: "Framer App", description: "Site hospedado no Framer", score: 35 },
  { pattern: /durable\.co/i, indicator: "Durable.co", description: "Site hospedado no Durable AI Builder", score: 55 },
  { pattern: /[a-z0-9\-]+\.wixsite\.com/i, indicator: "Wixsite", description: "Site no subdominio gratuito do Wix", score: 40 },
  // Padroes genericos de prototipo (score baixo, contexto de suporte)
  { pattern: /demo[\-_]?[a-z0-9]+\.vercel\.app/i, indicator: "Demo na Vercel", description: "Padrao de URL de demonstracao", score: 10 },
]

// ==========================================
// CATEGORIA 4: ESTRUTURA DE CODIGO SHADCN/RADIX
// ==========================================
const SHADCN_COMPONENTS = [
  "button", "card", "input", "dialog", "dropdown-menu", "dropdown", "sheet", "tabs",
  "accordion", "alert", "alert-dialog", "avatar", "badge", "calendar", "checkbox",
  "collapsible", "command", "context-menu", "hover-card", "menubar", "navigation-menu",
  "popover", "progress", "radio-group", "scroll-area", "select", "separator", "skeleton",
  "slider", "switch", "table", "textarea", "toast", "toggle", "tooltip", "form", "label",
  "sonner", "drawer", "carousel", "pagination", "resizable", "breadcrumb", "sidebar",
]

// ==========================================
// CATEGORIA 5: PADROES DE DASHBOARD/APP DE IA
// ==========================================
const AI_DASHBOARD_PATTERNS = [
  { patterns: [/className=["'][^"']*rounded-(lg|xl|2xl)[^"']*bg-(card|white|gray|slate|zinc|neutral)/gi], indicator: "Cards Estatisticos Padrao", minMatches: 8, score: 7 },
  { patterns: [/className=["'][^"']*h-\d+\s+w-\d+[^"']*rounded-full[^"']*bg-/gi, /className=["'][^"']*flex[^"']*items-center[^"']*justify-center[^"']*rounded-full/gi], indicator: "Avatares de Iniciais Padrao", minMatches: 5, score: 5 },
  { patterns: [/<Table|<TableHeader|<TableBody|<TableRow|<TableCell|<TableHead/g], indicator: "Tabelas shadcn", minMatches: 6, score: 5 },
  { patterns: [/Sidebar|SidebarProvider|SidebarContent|SidebarMenu|SidebarTrigger/g], indicator: "Sidebar shadcn", minMatches: 4, score: 5 },
  { patterns: [/ResponsiveContainer|LineChart|BarChart|AreaChart|PieChart|RadialBarChart/g], indicator: "Charts Recharts Padrao", minMatches: 3, score: 5 },
]

// ==========================================
// CATEGORIA 6: TEXTOS E DADOS FICTICIOS TIPICOS DE IA
// ==========================================
const AI_FAKE_DATA_PATTERNS = [
  // Nomes ficticios BR (threshold maior para evitar falsos positivos em sites reais)
  { patterns: [/jo[aã]o\s*(da\s*)?(silva|santos|oliveira|souza)/gi, /maria\s*(da\s*)?(silva|santos|oliveira)/gi], indicator: "Nomes Ficticios BR Padrao", minMatches: 3, score: 12 },
  { patterns: [/joao@|maria@|pedro@|usuario@|user@|teste@|test@|admin@exemplo|admin@example/gi], indicator: "Emails Ficticios", minMatches: 3, score: 10 },
  { patterns: [/acme\s*(corp|inc|ltd)?|empresa\s*exemplo|minha\s*empresa|sua\s*empresa|nome\s*da\s*empresa/gi], indicator: "Empresas Ficticias", minMatches: 2, score: 8 },
  { patterns: [/R\$\s*\d+\.000,00/g], indicator: "Valores Redondos Demais", minMatches: 5, score: 7 },
  // Lorem ipsum e placeholders (muito concreto)
  { patterns: [/lorem\s*ipsum/gi], indicator: "Lorem Ipsum", minMatches: 1, score: 15 },
  { patterns: [/\[your\s*(name|company|email|phone)\]/gi, /\{your\s*(name|company|email|phone)\}/gi], indicator: "Placeholders Nao Preenchidos", minMatches: 1, score: 12 },
  // REMOVIDO: "datas por extenso" — falso positivo alto em qualquer site BR
]

// ==========================================
// CATEGORIA 7: ESTRUTURA VISUAL PADRAO DE IA
// ==========================================
const AI_VISUAL_PATTERNS = [
  // Gradientes decorativos (threshold aumentado)
  { patterns: [/bg-gradient-to-(r|l|t|b|br|bl|tr|tl)/g], indicator: "Gradientes Tailwind", minMatches: 6, score: 3 },
  // Animacoes padrao (threshold aumentado)
  { patterns: [/animate-pulse|animate-spin|animate-bounce|animate-ping/g], indicator: "Animacoes Padrao", minMatches: 5, score: 3 },
  // Hover scale (mais especifico, menos comum em codigo humano cuidadoso)
  { patterns: [/hover:scale-\d+/g], indicator: "Hover Scale", minMatches: 6, score: 3 },
  // Transicoes genericas (threshold muito maior)
  { patterns: [/transition-all|transition-colors|duration-\d+/g], indicator: "Transicoes Genericas", minMatches: 15, score: 2 },
  // Espacamento muito consistente (threshold maior)
  { patterns: [/space-y-4|space-x-4|gap-4|gap-6|gap-8/g], indicator: "Espacamento Consistente", minMatches: 15, score: 2 },
  // Arredondamentos padrao (threshold maior)
  { patterns: [/rounded-lg|rounded-xl|rounded-2xl|rounded-full/g], indicator: "Arredondamentos Padrao", minMatches: 20, score: 3 },
]

// ==========================================
// CATEGORIA 8: IMPORTS E DEPENDENCIAS DE IA
// ==========================================
const AI_IMPORT_PATTERNS = [
  // shadcn/ui extensivo (threshold maior)
  { patterns: [/@\/components\/ui\//g], indicator: "Imports shadcn/ui", minMatches: 10, score: 10 },
  // Lucide icons (threshold maior — muitos projetos usam)
  { patterns: [/from\s*["']lucide-react["']/g, /lucide-react/g], indicator: "Lucide React", minMatches: 5, score: 5 },
  // Radix UI
  { patterns: [/@radix-ui\//g], indicator: "Radix UI", minMatches: 6, score: 5 },
  // clsx/cn (threshold maior)
  { patterns: [/\bcn\s*\(/g], indicator: "Funcao cn()", minMatches: 12, score: 5 },
  // class-variance-authority
  { patterns: [/class-variance-authority|cva\s*\(/g], indicator: "CVA", minMatches: 3, score: 4 },
]

// ==========================================
// CATEGORIA 9: CODIGO BOILERPLATE DE IA
// ==========================================
const AI_BOILERPLATE_PATTERNS = [
  // REMOVIDO: "use client" — qualquer app Next.js usa isso, nao e indicador de IA
  // REMOVIDO: "metadata export" — padrao do Next.js, nao de IA

  // Comentarios de secao estrutural
  {
    patterns: [
      /\{\/\*\s*(Header|Hero|Footer|Sidebar|Main|Content|Features?|Pricing|CTA)\s*(Section)?\s*\*\/\}/gi,
      /<!--\s*(Header|Hero|Footer|Sidebar|Main|Content|Features?|Pricing|CTA)\s*(Section)?\s*-->/gi,
    ],
    indicator: "Comentarios de Secao Genericos",
    minMatches: 4,
    score: 6,
  },
  // className muito longo (tipico de IA que empilha classes sem quebrar)
  { patterns: [/className=["'][^"']{120,}["']/g], indicator: "Classes Muito Longas", minMatches: 6, score: 6 },
  // Flex center em excesso
  { patterns: [/flex\s+items-center\s+justify-center|flex\s+flex-col\s+items-center/g], indicator: "Flex Center Excessivo", minMatches: 12, score: 3 },
]

// ==========================================
// CATEGORIA 10: FRASES E COMENTARIOS DE LLM
// ==========================================
const AI_VERBAL_PATTERNS = [
  // Comentarios explicativos demais (threshold maior)
  { patterns: [/\/\/\s*(This|Here|We|The)\s+(is|are|will|should|can|must)/gi], indicator: "Comentarios Explicativos de LLM", minMatches: 8, score: 5 },
  // Frases tipicas de LLM
  { patterns: [/ensure\s+that/gi, /note\s+that/gi, /it('|')s\s+worth\s+noting/gi], indicator: "Frases Tipicas de LLM", minMatches: 3, score: 7 },
  // TODO genericos (threshold maior)
  { patterns: [/\/\/\s*TODO:\s*(add|implement|fix|update|change|remove)/gi], indicator: "TODOs Genericos de IA", minMatches: 5, score: 4 },
]

// ==========================================
// CATEGORIA 11: INDICADORES HUMANOS (REDUZEM SCORE)
// ==========================================
const HUMAN_INDICATORS = [
  // Testes automatizados — forte indicador humano
  {
    patterns: [/describe\s*\(\s*["'`]/g, /it\s*\(\s*["'`]/g, /expect\s*\(/g, /jest\.|vitest|cypress|playwright/gi],
    indicator: "Testes Automatizados",
    minMatches: 3,
    score: -35,
  },
  // TypeScript avancado genuinamente complexo
  {
    patterns: [/type\s+[A-Z]\w+\s*<[^>]+>/g, /interface\s+[A-Z]\w+\s*<[^>]+>/g, /satisfies\s+/g, /infer\s+[A-Z]/g, /keyof\s+typeof/g],
    indicator: "TypeScript Avancado",
    minMatches: 5,
    score: -20,
  },
  // React hooks avancados (threshold maior — IA moderna tb usa)
  {
    patterns: [/useReducer\s*\(/g, /useImperativeHandle\s*\(/g, /useSyncExternalStore\s*\(/g, /forwardRef/g],
    indicator: "React Avancado",
    minMatches: 3,
    score: -20,
  },
  // NOTA: useMemo e useCallback removidos — IA moderna os usa com frequencia
  // Error handling robusto
  {
    patterns: [/ErrorBoundary/g, /componentDidCatch/g, /getDerivedStateFromError/g],
    indicator: "Error Boundary Personalizado",
    minMatches: 2,
    score: -18,
  },
  // Acessibilidade avancada e intencional
  {
    patterns: [/aria-describedby/g, /aria-labelledby/g, /aria-live/g, /role=["'](dialog|alertdialog|menu|tree|grid|listbox)/g],
    indicator: "Acessibilidade Avancada",
    minMatches: 5,
    score: -18,
  },
  // JSDoc detalhado
  {
    patterns: [/@param\s+\{[^}]+\}/g, /@returns?\s+\{[^}]+\}/g, /@example/g, /@throws/g],
    indicator: "JSDoc Detalhado",
    minMatches: 4,
    score: -15,
  },
  // CI/CD e infraestrutura
  {
    patterns: [/\.github\/workflows/g, /gitlab-ci/g, /Dockerfile/g, /docker-compose/g],
    indicator: "CI/CD Configurado",
    minMatches: 1,
    score: -25,
  },
  // Linting configurado de forma humana
  {
    patterns: [/eslint-disable-next-line/g, /@ts-expect-error/g],
    indicator: "Supressao de Linting Manual",
    minMatches: 3,
    score: -12,
  },
  // Internacionalizacao
  {
    patterns: [/next-intl|react-intl|i18next/g, /useTranslation/g, /formatMessage/g],
    indicator: "Internacionalizacao",
    minMatches: 2,
    score: -18,
  },
  // Monitoramento
  {
    patterns: [/sentry|datadog|newrelic|logrocket|bugsnag/gi],
    indicator: "Monitoramento de Erros",
    minMatches: 1,
    score: -15,
  },
  // State management complexo
  {
    patterns: [/zustand|jotai|recoil|xstate|redux-toolkit|@reduxjs\/toolkit/gi],
    indicator: "State Management Avancado",
    minMatches: 1,
    score: -15,
  },
  // Comentarios de contexto real de trabalho (nao de IA)
  {
    patterns: [
      /\/\/\s*(BUG|FIX|HACK|WORKAROUND|LEGACY|TECH.?DEBT):/gi,
      /\/\/\s*@see\s+(https?:|JIRA|TICKET|#\d+)/gi,
      /\/\/\s*(per|as per|according to)\s+(client|design|spec|PM|product)/gi,
    ],
    indicator: "Comentarios de Contexto Real",
    minMatches: 2,
    score: -15,
  },
  // Variaveis de ambiente customizadas (nao as padrao da Vercel)
  {
    patterns: [/NEXT_PUBLIC_(?!VERCEL|URL|ENV)[A-Z_]{5,}/g],
    indicator: "Env Vars Customizadas",
    minMatches: 3,
    score: -10,
  },
  // Logica de negocio complexa
  {
    patterns: [/switch\s*\([^)]+\)\s*\{[\s\S]*case[\s\S]*case[\s\S]*case/g],
    indicator: "Logica Complexa (Switch)",
    minMatches: 2,
    score: -10,
  },
  // Regex complexos (indicador de logica real)
  {
    patterns: [/new\s+RegExp\s*\([^)]{40,}\)/g, /\/[^\/]{40,}\/[gimsuy]*/g],
    indicator: "Regex Complexos",
    minMatches: 2,
    score: -12,
  },
  // Git history denso (arquivo de changelog, muitos autores)
  {
    patterns: [/CHANGELOG|CONTRIBUTING|AUTHORS|CODEOWNERS/g],
    indicator: "Arquivos de Projeto Maduro",
    minMatches: 1,
    score: -10,
  },
  // Comentarios em linguagem nao-inglesa nativa (projetos humanos BR)
  {
    patterns: [/\/\/\s*(Verifica|Busca|Retorna|Atualiza|Calcula|Renderiza|Filtra|Ordena|Valida)\s+\w+/gi],
    indicator: "Comentarios Tecnico-Naturais em PT-BR",
    minMatches: 5,
    score: -8,
  },
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
  const uniqueComponents = new Set<string>()

  for (const component of SHADCN_COMPONENTS) {
    const importRegex = new RegExp(`@/components/ui/${component}|from\\s*["'].*/${component}["']`, "gi")
    const capitalizedName = component
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
    const usageRegex = new RegExp(`<${capitalizedName}[\\s/>]`, "g")

    const importMatches = content.match(importRegex)
    const usageMatches = content.match(usageRegex)

    if (importMatches || usageMatches) {
      uniqueComponents.add(component)
    }
  }

  return uniqueComponents.size
}

function analyzeContent(content: string): { score: number; reasons: AnalysisReason[] } {
  const reasons: AnalysisReason[] = []
  let score = 0

  // 1. ASSINATURAS DIRETAS
  for (const indicator of DIRECT_AI_SIGNATURES) {
    const matches = countMatches(content, indicator.patterns)
    if (matches > 0) {
      reasons.push({ indicator: indicator.indicator, description: indicator.description, weight: "high" })
      score += indicator.score
    }
  }

  // 2. META-TAGS DE GERADORES (NOVO)
  for (const indicator of AI_METATAG_PATTERNS) {
    const regex = new RegExp(indicator.pattern.source, indicator.pattern.flags)
    if (regex.test(content)) {
      reasons.push({ indicator: indicator.indicator, description: indicator.description, weight: "high" })
      score += indicator.score
    }
  }

  // 3. PADROES DE DASHBOARD
  for (const indicator of AI_DASHBOARD_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: `${matches} ocorrencias encontradas`, weight: "medium" })
      score += indicator.score
    }
  }

  // 4. DADOS FICTICIOS
  for (const indicator of AI_FAKE_DATA_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: `${matches} ocorrencias encontradas`, weight: "medium" })
      score += indicator.score
    }
  }

  // 5. PADROES VISUAIS
  for (const indicator of AI_VISUAL_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: `${matches} ocorrencias encontradas`, weight: "low" })
      score += indicator.score
    }
  }

  // 6. IMPORTS DE IA
  for (const indicator of AI_IMPORT_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: `${matches} ocorrencias encontradas`, weight: "medium" })
      score += indicator.score
    }
  }

  // 7. BOILERPLATE
  for (const indicator of AI_BOILERPLATE_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: `${matches} ocorrencias encontradas`, weight: "low" })
      score += indicator.score
    }
  }

  // 8. PADROES VERBAIS
  for (const indicator of AI_VERBAL_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: `${matches} ocorrencias encontradas`, weight: "medium" })
      score += indicator.score
    }
  }

  // 9. COMPONENTES SHADCN (analise especial)
  const shadcnCount = countShadcnComponents(content)
  if (shadcnCount >= 6) {
    reasons.push({
      indicator: "Stack shadcn/ui Completa",
      description: `${shadcnCount} componentes shadcn/ui diferentes detectados`,
      weight: shadcnCount >= 12 ? "high" : "medium",
    })
    score += shadcnCount >= 12 ? 18 : shadcnCount >= 8 ? 12 : 8
  }

  // 10. INDICADORES HUMANOS (REDUZEM SCORE)
  for (const indicator of HUMAN_INDICATORS) {
    const matches = countMatches(content, indicator.patterns)
    if (matches >= indicator.minMatches) {
      reasons.push({ indicator: indicator.indicator, description: indicator.indicator, weight: "low" })
      score += indicator.score // negativo
    }
  }

  return { score, reasons }
}

function analyzeUrl(url: string): { score: number; reasons: AnalysisReason[] } {
  const reasons: AnalysisReason[] = []
  let score = 0

  for (const { pattern, indicator, description, score: patternScore } of AI_URL_PATTERNS) {
    if (pattern.test(url)) {
      reasons.push({ indicator, description, weight: "high" })
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

  // Analise da URL primeiro
  const urlAnalysis = analyzeUrl(url)
  totalScore += urlAnalysis.score
  reasons.push(...urlAnalysis.reasons)

  // Tenta buscar conteudo do site
  const content = await fetchSiteContent(url)

  if (content) {
    const contentAnalysis = analyzeContent(content)
    totalScore += contentAnalysis.score
    reasons.push(...contentAnalysis.reasons)

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

  // ==========================================
  // CALCULO FINAL DE PORCENTAGEM
  // Score e acumulado; convertemos para 0-100 com uma curva suave.
  // Score ~0  = ~10% (beneficio da duvida)
  // Score ~50 = ~55%
  // Score ~100= ~85%
  // Score negativo = abaixo de 10%
  // ==========================================
  const BASE = 10
  // Fator de escala: cada ponto de score vale menos conforme acumula (lei dos retornos decrescentes)
  const scaled = totalScore > 0
    ? BASE + (1 - Math.exp(-totalScore / 80)) * 85
    : Math.max(5, BASE + totalScore * 0.4)

  let percentage = Math.round(scaled)

  // Garantia minima com evidencia forte de URL
  const hasUrlEvidence = urlAnalysis.score >= 45
  if (hasUrlEvidence && percentage < 55) percentage = 55

  // Sem NENHUMA evidencia forte, limita a 35%
  const hasStrongEvidence = reasons.some((r) => r.weight === "high")
  if (!hasStrongEvidence && percentage > 35) percentage = 35

  // Limites absolutos
  percentage = Math.min(95, Math.max(5, percentage))

  // Veredicto
  let verdict: AnalysisResultData["verdict"]
  if (percentage <= 20) verdict = "human"
  else if (percentage <= 35) verdict = "likely_human"
  else if (percentage <= 55) verdict = "mixed"
  else if (percentage <= 75) verdict = "likely_ai"
  else verdict = "ai"

  // Ordena: high -> medium -> low
  const weightOrder = { high: 0, medium: 1, low: 2 }
  reasons.sort((a, b) => weightOrder[a.weight] - weightOrder[b.weight])

  return { url, percentage, verdict, reasons }
}
