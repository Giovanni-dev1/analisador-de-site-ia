import type { AnalysisResultData, AnalysisReason } from "@/components/analysis-result"

// ==========================================
// CATEGORIA 1: ASSINATURAS DIRETAS DE IA (EVIDÊNCIA FORTE)
// ==========================================
const DIRECT_AI_SIGNATURES = [
  // v0.dev / Vercel
  { patterns: [/created\s*(with|by)\s*v0/gi, /built\s*(with|by)\s*v0/gi, /v0\.dev/gi, /vercel\s*v0/gi], indicator: "Assinatura v0.dev", description: "Referência direta à ferramenta v0 da Vercel", score: 50 },
  
  // Menções explícitas de IA
  { patterns: [/generated\s*(by|with|using)\s*(ai|artificial\s*intelligence|gpt|claude|chatgpt|copilot)/gi, /ai[\-\s]generated/gi, /powered\s*by\s*(gpt|claude|openai|anthropic|gemini)/gi, /made\s*with\s*ai/gi], indicator: "Declaração Explícita de IA", description: "Código declara abertamente ter sido criado por IA", score: 55 },
  
  // Ferramentas de IA conhecidas
  { patterns: [/cursor\.sh/gi, /cursor\s*ai/gi, /cursor\s*editor/gi], indicator: "Cursor AI", description: "Referência ao editor Cursor com IA integrada", score: 45 },
  { patterns: [/bolt\.new/gi, /stackblitz\s*bolt/gi], indicator: "Bolt.new", description: "Referência à ferramenta Bolt.new da StackBlitz", score: 45 },
  { patterns: [/replit\s*ai/gi, /replit\s*ghost/gi], indicator: "Replit AI", description: "Referência ao Replit com assistente de IA", score: 45 },
  { patterns: [/lovable\.dev/gi, /made\s*with\s*lovable/gi], indicator: "Lovable.dev", description: "Referência à ferramenta Lovable.dev", score: 50 },
  { patterns: [/windsurf/gi, /codeium\s*windsurf/gi], indicator: "Windsurf/Codeium", description: "Referência ao Windsurf ou Codeium", score: 45 },
  { patterns: [/gptengineer/gi, /gpt\s*engineer/gi], indicator: "GPT Engineer", description: "Referência ao GPT Engineer", score: 45 },
  { patterns: [/websim/gi, /websim\.ai/gi], indicator: "WebSim AI", description: "Referência ao WebSim AI", score: 45 },
  
  // Comentários típicos de IA em templates
  { patterns: [/\/\/\s*This\s*(component|function|code)\s*(is|was)\s*(generated|created|built)/gi], indicator: "Comentário de Geração Automática", description: "Comentário indicando código gerado automaticamente", score: 40 },
  { patterns: [/\{\/\*\s*AI[\-\s]generated/gi, /<!--\s*AI[\-\s]generated/gi], indicator: "Marcador de IA em Comentário", description: "Comentário HTML/JSX marcando código de IA", score: 45 },
]

// ==========================================
// CATEGORIA 2: BAIXA ENTROPIA EM NOMES (INDICADOR FORTE)
// Fonte: Pesquisa mostra que IA usa nomes estatisticamente prováveis
// ==========================================
const LOW_ENTROPY_VARIABLE_NAMES = [
  "data", "item", "items", "result", "results", "response", "value", "values",
  "handle", "process", "fetch", "get", "set", "update", "create", "delete",
  "temp", "tmp", "arr", "obj", "str", "num", "val", "res", "req",
  "element", "elements", "list", "array", "object", "index", "count",
  "current", "previous", "next", "first", "last", "new", "old",
  "input", "output", "params", "options", "config", "settings",
  "user", "users", "post", "posts", "comment", "comments",
  "loading", "error", "success", "message", "messages",
]

// ==========================================
// CATEGORIA 3: PADRÃO "COMMENT ECHO" (IA explica O QUE, não PORQUÊ)
// ==========================================
const COMMENT_ECHO_PATTERNS = [
  // Comentários que apenas repetem o que o código faz
  /\/\/\s*(calculate|compute|get|set|update|create|delete|fetch|handle|process)\s+the\s+/gi,
  /\/\/\s*(initialize|initialise)\s+(the\s+)?(variable|array|object|state)/gi,
  /\/\/\s*(loop|iterate)\s+(through|over)\s+(the\s+)?(array|list|items|elements)/gi,
  /\/\/\s*(check|verify)\s+if\s+/gi,
  /\/\/\s*(return|returns)\s+the\s+(result|value|data)/gi,
  /\/\/\s*(add|append|push)\s+(the\s+)?(item|element|value)/gi,
  /\/\/\s*(filter|map|reduce)\s+the\s+(array|list)/gi,
  /\/\/\s*(increment|decrement)\s+(the\s+)?(counter|index|value)/gi,
]

// ==========================================
// CATEGORIA 4: FRASES TÍPICAS DE CHATGPT/CLAUDE
// ==========================================
const AI_VERBAL_TICS = [
  { patterns: [/ensure\s+that/gi], indicator: "Frase 'Ensure that'", minMatches: 3 },
  { patterns: [/note\s+that/gi], indicator: "Frase 'Note that'", minMatches: 3 },
  { patterns: [/crucially/gi], indicator: "Palavra 'Crucially'", minMatches: 2 },
  { patterns: [/here\s+is\s+a\s+(simple\s+)?example/gi], indicator: "Frase 'Here is an example'", minMatches: 1 },
  { patterns: [/let('|')?s\s+(implement|create|build|add)/gi], indicator: "Frase 'Let's implement'", minMatches: 2 },
  { patterns: [/in\s+this\s+(example|case|scenario)/gi], indicator: "Frase 'In this example'", minMatches: 2 },
  { patterns: [/as\s+follows/gi], indicator: "Frase 'As follows'", minMatches: 2 },
  { patterns: [/it('|')s\s+worth\s+noting/gi], indicator: "Frase 'It's worth noting'", minMatches: 1 },
  { patterns: [/the\s+following\s+(code|example|implementation)/gi], indicator: "Frase 'The following code'", minMatches: 2 },
]

// ==========================================
// CATEGORIA 5: OVER-COMMENTING (IA comenta cada linha)
// ==========================================
function detectOverCommenting(content: string): { detected: boolean; ratio: number } {
  const lines = content.split('\n')
  let codeLines = 0
  let commentLines = 0
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length === 0) continue
    
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('<!--')) {
      commentLines++
    } else if (!trimmed.startsWith('import') && !trimmed.startsWith('export') && trimmed.length > 5) {
      codeLines++
    }
  }
  
  const ratio = codeLines > 0 ? commentLines / codeLines : 0
  // IA frequentemente tem ratio > 0.4 (comentário a cada 2-3 linhas de código)
  return { detected: ratio > 0.35, ratio }
}

// ==========================================
// CATEGORIA 6: CONSISTÊNCIA ESTILÍSTICA INUMANA
// ==========================================
function detectInhumanConsistency(content: string): { score: number; indicators: string[] } {
  const indicators: string[] = []
  let score = 0
  
  // Verifica se TODOS os arrow functions usam o mesmo estilo
  const arrowWithBraces = (content.match(/=>\s*\{/g) || []).length
  const arrowWithoutBraces = (content.match(/=>\s*[^{]/g) || []).length
  
  if (arrowWithBraces > 5 && arrowWithoutBraces === 0) {
    indicators.push("Todas as arrow functions usam chaves (consistência artificial)")
    score += 5
  }
  if (arrowWithoutBraces > 5 && arrowWithBraces === 0) {
    indicators.push("Nenhuma arrow function usa chaves (consistência artificial)")
    score += 5
  }
  
  // Verifica se TODOS os componentes seguem exatamente o mesmo padrão
  const functionComponents = (content.match(/function\s+[A-Z][a-zA-Z]+\s*\(/g) || []).length
  const arrowComponents = (content.match(/const\s+[A-Z][a-zA-Z]+\s*=\s*\(/g) || []).length
  
  if (functionComponents > 3 && arrowComponents === 0) {
    indicators.push("Todos os componentes são function declarations (consistência rígida)")
    score += 4
  }
  if (arrowComponents > 3 && functionComponents === 0) {
    indicators.push("Todos os componentes são arrow functions (consistência rígida)")
    score += 4
  }
  
  // Verifica imports perfeitamente organizados (sinal de IA)
  const importLines = content.match(/^import\s+.+$/gm) || []
  if (importLines.length > 5) {
    // Checa se estão em ordem alfabética
    const sortedImports = [...importLines].sort()
    if (JSON.stringify(importLines) === JSON.stringify(sortedImports)) {
      indicators.push("Imports perfeitamente ordenados alfabeticamente")
      score += 6
    }
  }
  
  // Verifica se todos os try-catch têm a mesma estrutura
  const tryCatches = content.match(/try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}/g) || []
  if (tryCatches.length > 3) {
    const structures = tryCatches.map(tc => tc.length)
    const avgLen = structures.reduce((a, b) => a + b, 0) / structures.length
    const variance = structures.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / structures.length
    if (variance < 100) { // Muito pouca variação
      indicators.push("Todos os try-catch têm estrutura quase idêntica")
      score += 8
    }
  }
  
  return { score, indicators }
}

// ==========================================
// CATEGORIA 7: HAPPY PATH BIAS (IA ignora edge cases)
// ==========================================
function detectHappyPathBias(content: string): { score: number; indicators: string[] } {
  const indicators: string[] = []
  let score = 0
  
  // Conta async/await vs tratamento de erros
  const asyncAwait = (content.match(/async|await/g) || []).length
  const errorHandling = (content.match(/try\s*\{|\.catch\s*\(|onError|error\s*:/gi) || []).length
  
  if (asyncAwait > 5 && errorHandling < asyncAwait * 0.3) {
    indicators.push("Muitas operações async sem tratamento de erro adequado")
    score += 6
  }
  
  // Verifica catch genéricos
  const genericCatch = (content.match(/catch\s*\([^)]*\)\s*\{\s*(console\.(log|error)|\/\/)/g) || []).length
  if (genericCatch > 2) {
    indicators.push(`${genericCatch} blocos catch genéricos (apenas console.log)`)
    score += genericCatch * 2
  }
  
  // Verifica falta de validação de inputs
  const functionParams = (content.match(/function\s+\w+\s*\([^)]+\)|=>\s*\{/g) || []).length
  const typeChecks = (content.match(/typeof|instanceof|Array\.isArray|!==?\s*(null|undefined)/g) || []).length
  
  if (functionParams > 5 && typeChecks < functionParams * 0.2) {
    indicators.push("Pouca validação de parâmetros de função")
    score += 4
  }
  
  return { score, indicators }
}

// ==========================================
// CATEGORIA 8: PADRÕES DE CÓDIGO ESTRUTURAL DE IA
// ==========================================
const AI_CODE_PATTERNS = [
  // shadcn/ui extensivo
  {
    patterns: [/@\/components\/ui\/(button|card|input|dialog|dropdown|sheet|tabs|accordion|alert|avatar|badge|calendar|checkbox|collapsible|command|context-menu|hover-card|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|skeleton|slider|switch|table|textarea|toast|toggle|tooltip|form|label|sonner|drawer)/gi],
    indicator: "shadcn/ui Extensivo",
    description: "Uso massivo de componentes shadcn/ui - stack padrão de ferramentas de IA",
    score: 12,
    minMatches: 8,
  },
  
  // Função cn() do shadcn
  {
    patterns: [/\bcn\s*\(/g],
    indicator: "Utilitário cn() Extensivo",
    description: "Função cn() para classes CSS usada excessivamente",
    score: 6,
    minMatches: 6,
  },
  
  // Lucide icons extensivo
  {
    patterns: [/from\s*["']lucide-react["']/g],
    indicator: "Lucide React",
    description: "Biblioteca Lucide React - padrão em ferramentas de IA",
    score: 4,
    minMatches: 4,
  },
  
  // Radix UI extensivo
  {
    patterns: [/@radix-ui\//g],
    indicator: "Radix UI Extensivo",
    description: "Múltiplos componentes Radix UI",
    score: 5,
    minMatches: 5,
  },
  
  // class-variance-authority
  {
    patterns: [/class-variance-authority|cva\s*\(/g],
    indicator: "class-variance-authority",
    description: "Biblioteca CVA para variantes de componentes",
    score: 4,
    minMatches: 2,
  },
]

// ==========================================
// CATEGORIA 9: PADRÕES DE TAILWIND GENÉRICOS
// ==========================================
const AI_TAILWIND_PATTERNS = [
  {
    patterns: [/flex\s+items-center\s+justify-center/g, /flex\s+flex-col\s+items-center/g],
    indicator: "Centralização Repetitiva",
    description: "Padrão flex items-center justify-center usado excessivamente",
    score: 3,
    minMatches: 10,
  },
  {
    patterns: [/bg-gradient-to-(r|l|t|b|br|bl|tr|tl)/g],
    indicator: "Gradientes Tailwind Excessivos",
    description: "Múltiplos gradientes decorativos",
    score: 2,
    minMatches: 5,
  },
  {
    patterns: [/hover:scale-\d+/g],
    indicator: "Scale no Hover Repetitivo",
    description: "Efeito hover:scale usado em excesso",
    score: 2,
    minMatches: 6,
  },
  {
    patterns: [/transition-all\s+duration-\d+/g],
    indicator: "Transições Genéricas",
    description: "transition-all duration usado excessivamente",
    score: 2,
    minMatches: 8,
  },
  {
    patterns: [/animate-pulse|animate-spin|animate-bounce/g],
    indicator: "Animações Built-in Repetitivas",
    description: "Animações Tailwind built-in usadas em excesso",
    score: 2,
    minMatches: 5,
  },
]

// ==========================================
// CATEGORIA 10: TEXTOS GENÉRICOS E PLACEHOLDERS
// ==========================================
const AI_COPY_PATTERNS = [
  {
    patterns: [/lorem\s*ipsum/gi],
    indicator: "Lorem Ipsum",
    description: "Texto placeholder não substituído",
    score: 10,
    minMatches: 1,
  },
  {
    patterns: [
      /welcome\s*to\s*(our|the)\s*(website|platform|app)/gi,
      /get\s*started\s*today/gi,
      /join\s*(us|our)\s*(community|newsletter)/gi,
      /trusted\s*by\s*(thousands|millions)/gi,
      /start\s*your\s*free\s*trial/gi,
      /we('|')?re\s+here\s+to\s+help/gi,
      /take\s+your\s+.+\s+to\s+the\s+next\s+level/gi,
    ],
    indicator: "Copy Genérico de Landing Page",
    description: "Textos de marketing muito genéricos típicos de templates de IA",
    score: 5,
    minMatches: 4,
  },
  {
    patterns: [
      /john\s*(doe|smith)/gi,
      /jane\s*(doe|smith)/gi,
      /acme\s*(corp|inc|company)/gi,
      /example\.(com|org|net)/gi,
      /your[\-\s]*(name|email|company)[\-\s]*here/gi,
      /user@example/gi,
      /test@test/gi,
    ],
    indicator: "Dados de Exemplo Não Substituídos",
    description: "Nomes e emails de exemplo típicos de IA",
    score: 8,
    minMatches: 2,
  },
]

// ==========================================
// CATEGORIA 11: COMENTÁRIOS DE SEÇÃO LITERAIS
// ==========================================
const AI_COMMENT_PATTERNS = [
  {
    patterns: [
      /<!--\s*(Hero|Header|Footer|Navbar|Navigation|Features?|Pricing|Testimonials?|CTA|FAQ|About|Contact|Services?)\s*(Section)?\s*-->/gi,
      /\{\/\*\s*(Hero|Header|Footer|Navbar|Navigation|Features?|Pricing|Testimonials?|CTA|FAQ|About|Contact|Services?)\s*(Section)?\s*\*\/\}/gi,
      /\/\/\s*(Hero|Header|Footer|Navbar|Features?|Pricing|Testimonials?|CTA|FAQ|About|Contact|Services?)\s*(Section)?$/gim,
    ],
    indicator: "Comentários de Seção Literais",
    description: "Comentários que apenas nomeiam seções sem agregar valor",
    score: 5,
    minMatches: 4,
  },
  {
    patterns: [
      /\/\/\s*TODO:\s*(add|implement|fix|update|change|remove)\s/gi,
      /\{\/\*\s*TODO:\s*(add|implement|fix|update|change|remove)\s/gi,
    ],
    indicator: "TODOs Genéricos de IA",
    description: "Comentários TODO muito genéricos deixados por IA",
    score: 4,
    minMatches: 4,
  },
]

// ==========================================
// CATEGORIA 12: PADRÕES DE URL/HOSPEDAGEM
// ==========================================
const AI_URL_PATTERNS = [
  { pattern: /\.v0\.dev$/i, indicator: "Domínio v0.dev", description: "Site hospedado diretamente no v0.dev", score: 60 },
  { pattern: /v0-[a-z0-9]+\.vercel\.app$/i, indicator: "Deploy v0 na Vercel", description: "Padrão de URL de deploy do v0", score: 45 },
  { pattern: /bolt-[a-z0-9]+\.(netlify\.app|vercel\.app)/i, indicator: "Deploy Bolt.new", description: "Padrão de URL de deploy do Bolt.new", score: 45 },
  { pattern: /lovable-[a-z0-9]+\./i, indicator: "Deploy Lovable", description: "Padrão de URL de deploy do Lovable.dev", score: 45 },
  { pattern: /replit\.app/i, indicator: "Replit Deploy", description: "Site hospedado no Replit", score: 15 },
]

// ==========================================
// CATEGORIA 13: INDICADORES HUMANOS (REDUZEM SCORE)
// ==========================================
const HUMAN_INDICATORS = [
  // Testes automatizados (FORTE indicador humano)
  {
    patterns: [
      /\.(test|spec)\.(ts|tsx|js|jsx)/g,
      /describe\s*\(\s*["'`]/g,
      /it\s*\(\s*["'`](should|when|given)/g,
      /expect\s*\([^)]+\)\.(toBe|toEqual|toHaveLength|toContain|toThrow|toMatch)/g,
      /jest\.(fn|mock|spyOn)/g,
      /@testing-library/g,
      /vitest|cypress|playwright/gi,
    ],
    indicator: "Testes Automatizados",
    description: "Presença de testes indica desenvolvimento profissional revisado",
    score: -30,
    minMatches: 4,
  },
  
  // TypeScript avançado
  {
    patterns: [
      /type\s+[A-Z]\w+\s*<[^>]+>/g,
      /interface\s+[A-Z]\w+\s*<[^>]+>/g,
      /as\s+const/g,
      /satisfies\s+/g,
      /infer\s+[A-Z]/g,
      /keyof\s+typeof/g,
      /Omit<|Pick<|Partial<|Required<|Record</g,
      /extends\s+infer/g,
    ],
    indicator: "TypeScript Avançado",
    description: "Uso de recursos avançados de TypeScript indica experiência",
    score: -20,
    minMatches: 4,
  },
  
  // Hooks avançados e otimização React
  {
    patterns: [
      /useMemo\s*\(/g,
      /useCallback\s*\(/g,
      /useReducer\s*\(/g,
      /useImperativeHandle\s*\(/g,
      /useSyncExternalStore\s*\(/g,
      /useTransition\s*\(/g,
      /useDeferredValue\s*\(/g,
      /React\.memo\s*\(/g,
      /forwardRef\s*[\(<]/g,
      /useRef\s*<[A-Z]/g,
    ],
    indicator: "React Avançado",
    description: "Hooks de performance e padrões avançados de React",
    score: -22,
    minMatches: 4,
  },
  
  // Error Boundaries e tratamento robusto
  {
    patterns: [
      /ErrorBoundary/g,
      /componentDidCatch/g,
      /getDerivedStateFromError/g,
      /onError\s*[=:]\s*\{?\s*\(/g,
      /fallback\s*[=:]/g,
      /error\.cause/g,
      /new\s+(Error|TypeError|RangeError)\s*\(/g,
    ],
    indicator: "Tratamento de Erros Robusto",
    description: "Error handling detalhado indica código de produção",
    score: -15,
    minMatches: 3,
  },
  
  // Acessibilidade detalhada
  {
    patterns: [
      /aria-label=["'][^"']{15,}["']/g,
      /aria-describedby/g,
      /aria-labelledby/g,
      /aria-live/g,
      /aria-expanded/g,
      /aria-haspopup/g,
      /role=["'](dialog|alertdialog|menu|menubar|tree|grid|listbox)/g,
      /focus-trap|focus-lock/gi,
      /skip.?to.?(main|content)/gi,
    ],
    indicator: "Acessibilidade Avançada",
    description: "Implementação cuidadosa de ARIA e acessibilidade",
    score: -18,
    minMatches: 5,
  },
  
  // JSDoc e documentação detalhada
  {
    patterns: [
      /@param\s+\{[^}]+\}\s+\w+\s+-\s+/g,
      /@returns?\s+\{[^}]+\}\s+/g,
      /@example[\s\S]+?\*\//g,
      /@throws\s+\{/g,
      /@deprecated\s+/g,
      /@see\s+/g,
      /@since\s+/g,
      /@author\s+/g,
    ],
    indicator: "Documentação JSDoc Detalhada",
    description: "Documentação detalhada e profissional",
    score: -15,
    minMatches: 4,
  },
  
  // Configuração de projeto madura
  {
    patterns: [
      /eslint-disable-next-line\s+\w+\/\w+/g,
      /prettier-ignore/g,
      /@ts-expect-error\s+/g,
      /\.eslintrc|eslint\.config/g,
      /\.prettierrc|prettier\.config/g,
      /husky|lint-staged|commitlint/gi,
    ],
    indicator: "Configuração de Linting Madura",
    description: "Configuração de ferramentas indica projeto profissional",
    score: -12,
    minMatches: 3,
  },
  
  // CI/CD e DevOps
  {
    patterns: [
      /\.github\/workflows/g,
      /gitlab-ci\.yml/g,
      /\.circleci/g,
      /Dockerfile/g,
      /docker-compose/g,
      /kubernetes|k8s/gi,
      /terraform|pulumi/gi,
    ],
    indicator: "CI/CD e Infraestrutura",
    description: "Configuração de deploy automatizado",
    score: -25,
    minMatches: 2,
  },
  
  // Internacionalização real
  {
    patterns: [
      /next-intl|react-intl|i18next/g,
      /useTranslations?\s*\(/g,
      /formatMessage\s*\(/g,
      /t\s*\(\s*["'][a-z]+(\.[a-z]+)+["']\s*\)/g,
      /Intl\.(DateTimeFormat|NumberFormat|RelativeTimeFormat)/g,
    ],
    indicator: "Internacionalização Real",
    description: "Suporte a múltiplos idiomas implementado",
    score: -18,
    minMatches: 3,
  },
  
  // Code splitting e otimização
  {
    patterns: [
      /React\.lazy\s*\(/g,
      /dynamic\s*\(\s*\(\s*\)\s*=>\s*import/g,
      /next\/dynamic/g,
      /Suspense\s*fallback/g,
      /prefetch\s*[=:]/g,
      /webpackChunkName/g,
    ],
    indicator: "Code Splitting Avançado",
    description: "Lazy loading e otimização de bundle",
    score: -15,
    minMatches: 3,
  },
  
  // Monitoramento e observabilidade
  {
    patterns: [
      /sentry/gi,
      /datadog/gi,
      /newrelic/gi,
      /logrocket/gi,
      /bugsnag/gi,
      /rollbar/gi,
      /honeycomb/gi,
    ],
    indicator: "Monitoramento de Produção",
    description: "Integração com ferramentas de observabilidade",
    score: -15,
    minMatches: 1,
  },
  
  // State management complexo
  {
    patterns: [
      /zustand/gi,
      /jotai/gi,
      /recoil/gi,
      /xstate/gi,
      /redux-toolkit|@reduxjs\/toolkit/gi,
      /createSlice|createAsyncThunk/g,
    ],
    indicator: "State Management Avançado",
    description: "Bibliotecas de estado mais complexas que useState/useContext",
    score: -12,
    minMatches: 2,
  },
  
  // Comentários com contexto de negócio (não genéricos)
  {
    patterns: [
      /\/\/\s*(BUG|FIX|HACK|WORKAROUND|LEGACY|TECH.?DEBT):/gi,
      /\/\/\s*@see\s+(https?:|JIRA|TICKET|#\d+)/gi,
      /\/\/\s*(per|as per|according to)\s+(client|design|spec|PM|product)/gi,
    ],
    indicator: "Comentários com Contexto de Negócio",
    description: "Comentários referenciando bugs, tickets ou decisões de produto",
    score: -12,
    minMatches: 2,
  },
  
  // Variáveis de ambiente customizadas
  {
    patterns: [
      /process\.env\.[A-Z_]{10,}/g,
      /NEXT_PUBLIC_(?!VERCEL)[A-Z_]{5,}/g,
    ],
    indicator: "Variáveis de Ambiente Customizadas",
    description: "Variáveis de ambiente específicas do projeto",
    score: -8,
    minMatches: 3,
  },
]

// ==========================================
// FUNÇÕES DE ANÁLISE
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

function analyzeVariableNameEntropy(content: string): { score: number; indicators: string[] } {
  const indicators: string[] = []
  let score = 0
  
  // Extrai nomes de variáveis
  const varDeclarations = content.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || []
  const varNames = varDeclarations.map(d => d.replace(/^(const|let|var)\s+/, '').toLowerCase())
  
  if (varNames.length < 10) return { score: 0, indicators: [] }
  
  // Conta quantas são nomes genéricos
  let genericCount = 0
  for (const name of varNames) {
    if (LOW_ENTROPY_VARIABLE_NAMES.includes(name)) {
      genericCount++
    }
  }
  
  const genericRatio = genericCount / varNames.length
  
  if (genericRatio > 0.4) {
    indicators.push(`${Math.round(genericRatio * 100)}% das variáveis têm nomes genéricos (data, item, result, etc.)`)
    score += Math.round(genericRatio * 20)
  }
  
  return { score, indicators }
}

function analyzeCommentEchoes(content: string): { score: number; count: number } {
  let count = 0
  for (const pattern of COMMENT_ECHO_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags)
    const matches = content.match(regex)
    if (matches) {
      count += matches.length
    }
  }
  
  // Só conta se houver muitos (5+)
  if (count >= 5) {
    return { score: Math.min(count * 2, 15), count }
  }
  return { score: 0, count }
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
  
  // 2. BAIXA ENTROPIA EM NOMES DE VARIÁVEIS
  const entropyAnalysis = analyzeVariableNameEntropy(content)
  if (entropyAnalysis.score > 0) {
    reasons.push({
      indicator: "Baixa Entropia em Nomes",
      description: entropyAnalysis.indicators.join("; "),
      weight: "medium",
    })
    score += entropyAnalysis.score
  }
  
  // 3. COMMENT ECHOES
  const echoAnalysis = analyzeCommentEchoes(content)
  if (echoAnalysis.score > 0) {
    reasons.push({
      indicator: "Comentários 'Echo'",
      description: `${echoAnalysis.count} comentários que apenas descrevem o que o código faz, não o porquê`,
      weight: "medium",
    })
    score += echoAnalysis.score
  }
  
  // 4. FRASES TÍPICAS DE IA (verbal tics)
  for (const tic of AI_VERBAL_TICS) {
    const matches = countMatches(content, tic.patterns)
    if (matches >= tic.minMatches) {
      reasons.push({
        indicator: tic.indicator,
        description: `Frase típica de LLMs encontrada ${matches}x`,
        weight: "medium",
      })
      score += 5
    }
  }
  
  // 5. OVER-COMMENTING
  const commentAnalysis = detectOverCommenting(content)
  if (commentAnalysis.detected) {
    reasons.push({
      indicator: "Over-Commenting",
      description: `Ratio comentário/código de ${Math.round(commentAnalysis.ratio * 100)}% (IA comenta excessivamente)`,
      weight: "medium",
    })
    score += 8
  }
  
  // 6. CONSISTÊNCIA INUMANA
  const consistencyAnalysis = detectInhumanConsistency(content)
  if (consistencyAnalysis.score > 0) {
    for (const ind of consistencyAnalysis.indicators) {
      reasons.push({
        indicator: "Consistência Artificial",
        description: ind,
        weight: "medium",
      })
    }
    score += consistencyAnalysis.score
  }
  
  // 7. HAPPY PATH BIAS
  const happyPathAnalysis = detectHappyPathBias(content)
  if (happyPathAnalysis.score > 0) {
    for (const ind of happyPathAnalysis.indicators) {
      reasons.push({
        indicator: "Happy Path Bias",
        description: ind,
        weight: "low",
      })
    }
    score += happyPathAnalysis.score
  }
  
  // 8. PADRÕES DE CÓDIGO DE IA
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
  
  // 9. PADRÕES DE TAILWIND
  for (const indicator of AI_TAILWIND_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description} (${matches}x)`,
        weight: "low",
      })
      score += indicator.score
    }
  }
  
  // 10. TEXTOS GENÉRICOS
  for (const indicator of AI_COPY_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: indicator.description,
        weight: "medium",
      })
      score += indicator.score
    }
  }
  
  // 11. COMENTÁRIOS DE SEÇÃO
  for (const indicator of AI_COMMENT_PATTERNS) {
    const matches = countMatches(content, indicator.patterns)
    const minRequired = indicator.minMatches || 1
    if (matches >= minRequired) {
      reasons.push({
        indicator: indicator.indicator,
        description: `${indicator.description} (${matches}x)`,
        weight: "low",
      })
      score += indicator.score
    }
  }
  
  // 12. INDICADORES HUMANOS (REDUZEM SCORE)
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
    
    // Info sobre análise
    if (content.length > 5000) {
      reasons.push({
        indicator: "Análise Completa",
        description: `Analisados ${Math.round(content.length / 1000)}KB de código fonte`,
        weight: "low",
      })
    }
  } else {
    reasons.push({
      indicator: "Análise Limitada",
      description: "Não foi possível acessar o código fonte. Análise baseada apenas na URL",
      weight: "low",
    })
    // Se não conseguiu analisar conteúdo, reduz confiança
    totalScore = Math.min(totalScore, 25)
  }
  
  // Calcula porcentagem final
  // Score base: 8% (benefício da dúvida)
  let percentage = 8 + Math.max(0, totalScore)
  
  // Se não tem NENHUMA evidência forte, limita a 32%
  const hasStrongEvidence = reasons.some(r => r.weight === "high")
  if (!hasStrongEvidence && percentage > 32) {
    percentage = 32
  }
  
  // Limites finais
  percentage = Math.min(95, Math.max(5, percentage))
  percentage = Math.round(percentage)
  
  // Determina o veredicto
  let verdict: AnalysisResultData["verdict"]
  if (percentage <= 18) {
    verdict = "human"
  } else if (percentage <= 32) {
    verdict = "likely_human"
  } else if (percentage <= 50) {
    verdict = "mixed"
  } else if (percentage <= 72) {
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
