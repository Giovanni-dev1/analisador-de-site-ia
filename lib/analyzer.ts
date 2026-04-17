import type { AnalysisResultData, AnalysisReason } from "@/components/analysis-result"

// Padrões comuns de código gerado por IA
const AI_INDICATORS = {
  // Estrutura e organização
  genericStructure: {
    patterns: [
      /flex\s+items-center\s+justify-center/gi,
      /min-h-screen/gi,
      /max-w-\d+xl/gi,
    ],
    indicator: "Estrutura de Layout Genérica",
    description: "Usa padrões de layout muito comuns em templates de IA (flex centralizado, containers padrão).",
    weight: "low" as const,
  },
  
  // Comentários explicativos demais
  excessiveComments: {
    patterns: [
      /<!--\s*(Hero|Header|Footer|Section|Component)/gi,
      /\/\/\s*(TODO|FIXME|NOTE):/gi,
    ],
    indicator: "Comentários Explicativos Genéricos",
    description: "Comentários muito didáticos, típicos de código gerado para explicar cada seção.",
    weight: "medium" as const,
  },
  
  // Classes Tailwind típicas de IA
  tailwindPatterns: {
    patterns: [
      /bg-gradient-to-[rb]/gi,
      /from-\w+-\d+\s+to-\w+-\d+/gi,
      /hover:scale-105/gi,
      /transition-all\s+duration-300/gi,
      /rounded-\d*xl/gi,
      /shadow-\d*xl/gi,
    ],
    indicator: "Padrões Tailwind de IA",
    description: "Combinações de classes Tailwind muito comuns em código gerado (gradientes, transições suaves).",
    weight: "medium" as const,
  },
  
  // Componentes shadcn/ui
  shadcnComponents: {
    patterns: [
      /@\/components\/ui\//gi,
      /from\s+['"]@radix-ui/gi,
      /lucide-react/gi,
    ],
    indicator: "Uso de shadcn/ui + Radix",
    description: "Stack padrão de componentes usada por ferramentas de IA como v0.dev.",
    weight: "high" as const,
  },
  
  // Next.js App Router
  nextjsAppRouter: {
    patterns: [
      /use\s+client/gi,
      /use\s+server/gi,
      /app\/.*\/page\.tsx/gi,
      /export\s+default\s+function\s+\w+Page/gi,
    ],
    indicator: "Next.js App Router",
    description: "Estrutura moderna do Next.js, frequentemente gerada por ferramentas de IA.",
    weight: "low" as const,
  },
  
  // Estrutura de formulários
  formPatterns: {
    patterns: [
      /onSubmit=\{.*handleSubmit/gi,
      /e\.preventDefault\(\)/gi,
      /useState\(['"]'['"]\)/gi,
    ],
    indicator: "Padrões de Formulário Genéricos",
    description: "Implementação de formulários com padrões muito comuns de tutoriais e IA.",
    weight: "low" as const,
  },
  
  // Animações CSS típicas
  animationPatterns: {
    patterns: [
      /animate-pulse/gi,
      /animate-bounce/gi,
      /animate-spin/gi,
      /motion\.div/gi,
      /framer-motion/gi,
    ],
    indicator: "Animações Padrão",
    description: "Animações básicas do Tailwind ou Framer Motion, muito usadas em código de IA.",
    weight: "low" as const,
  },
  
  // Texto placeholder típico
  placeholderText: {
    patterns: [
      /Lorem\s+ipsum/gi,
      /example\.com/gi,
      /john@email\.com/gi,
      /your-.*-here/gi,
    ],
    indicator: "Texto Placeholder",
    description: "Textos genéricos de exemplo que não foram personalizados.",
    weight: "medium" as const,
  },
  
  // Meta tags genéricas
  genericMeta: {
    patterns: [
      /Created\s+with\s+v0/gi,
      /Built\s+with\s+AI/gi,
      /Generated\s+by/gi,
      /Powered\s+by\s+Claude/gi,
      /Powered\s+by\s+GPT/gi,
    ],
    indicator: "Meta Tags de IA",
    description: "Referências diretas a ferramentas de IA nos metadados ou código.",
    weight: "high" as const,
  },
  
  // Estrutura de API genérica
  apiPatterns: {
    patterns: [
      /\/api\/.*route\.ts/gi,
      /NextResponse\.json/gi,
      /export\s+async\s+function\s+(GET|POST|PUT|DELETE)/gi,
    ],
    indicator: "API Routes Padrão",
    description: "Estrutura de API do Next.js com padrões muito comuns.",
    weight: "low" as const,
  },
}

// Indicadores positivos de código humano
const HUMAN_INDICATORS = {
  customStyling: {
    patterns: [
      /custom-\w+/gi,
      /\[&_[\w-]+\]/gi, // Seletores CSS complexos no Tailwind
    ],
    indicator: "Estilização Personalizada",
    description: "CSS customizado que indica trabalho manual e atenção aos detalhes.",
    weight: "medium" as const,
  },
  
  complexLogic: {
    patterns: [
      /useMemo\(/gi,
      /useCallback\(/gi,
      /useReducer\(/gi,
    ],
    indicator: "Lógica React Avançada",
    description: "Uso de hooks avançados que indicam otimizações pensadas.",
    weight: "medium" as const,
  },
  
  testFiles: {
    patterns: [
      /\.test\.(ts|tsx|js|jsx)/gi,
      /\.spec\.(ts|tsx|js|jsx)/gi,
      /jest|vitest|cypress/gi,
    ],
    indicator: "Testes Automatizados",
    description: "Presença de testes indica desenvolvimento profissional.",
    weight: "high" as const,
  },
}

export async function analyzeWebsite(url: string): Promise<AnalysisResultData> {
  // Simula delay de análise
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
  
  // Em uma implementação real, faríamos fetch do HTML/código fonte
  // Por agora, vamos simular uma análise baseada na URL
  const detectedReasons: AnalysisReason[] = []
  let aiScore = 0
  let humanScore = 0
  
  // Análise baseada em padrões da URL
  const urlLower = url.toLowerCase()
  
  // Verifica domínios conhecidos de deploy de projetos AI
  if (urlLower.includes("vercel.app") || urlLower.includes("v0.dev")) {
    detectedReasons.push({
      indicator: "Hospedado na Vercel",
      description: "Deploy na plataforma Vercel, comum para projetos criados com v0 e outras ferramentas de IA.",
      weight: "medium",
    })
    aiScore += 15
  }
  
  if (urlLower.includes("netlify.app")) {
    detectedReasons.push({
      indicator: "Deploy no Netlify",
      description: "Plataforma de deploy comum, mas também usada por muitos desenvolvedores.",
      weight: "low",
    })
    aiScore += 5
  }
  
  // Simula detecção de padrões no "código fonte"
  // Em uma versão real, buscaríamos o HTML/JS real
  
  // Adiciona alguns indicadores aleatórios para demonstração
  const possibleAiIndicators = Object.values(AI_INDICATORS)
  const selectedIndicators = possibleAiIndicators
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3))
  
  for (const indicator of selectedIndicators) {
    detectedReasons.push({
      indicator: indicator.indicator,
      description: indicator.description,
      weight: indicator.weight,
    })
    
    switch (indicator.weight) {
      case "high":
        aiScore += 25
        break
      case "medium":
        aiScore += 15
        break
      case "low":
        aiScore += 8
        break
    }
  }
  
  // Chance de detectar indicadores humanos
  if (Math.random() > 0.6) {
    const humanIndicatorsList = Object.values(HUMAN_INDICATORS)
    const humanIndicator = humanIndicatorsList[Math.floor(Math.random() * humanIndicatorsList.length)]
    detectedReasons.push({
      indicator: humanIndicator.indicator,
      description: humanIndicator.description,
      weight: humanIndicator.weight,
    })
    
    switch (humanIndicator.weight) {
      case "high":
        humanScore += 30
        break
      case "medium":
        humanScore += 20
        break
      case "low":
        humanScore += 10
        break
    }
  }
  
  // Calcula porcentagem final
  const totalScore = aiScore - humanScore
  let percentage = Math.min(95, Math.max(5, 50 + totalScore))
  
  // Adiciona um pouco de variação
  percentage = Math.round(percentage + (Math.random() * 10 - 5))
  percentage = Math.min(95, Math.max(5, percentage))
  
  // Determina o veredicto
  let verdict: AnalysisResultData["verdict"]
  if (percentage <= 20) {
    verdict = "human"
  } else if (percentage <= 40) {
    verdict = "likely_human"
  } else if (percentage <= 60) {
    verdict = "mixed"
  } else if (percentage <= 80) {
    verdict = "likely_ai"
  } else {
    verdict = "ai"
  }
  
  // Ordena os motivos por peso
  const weightOrder = { high: 0, medium: 1, low: 2 }
  detectedReasons.sort((a, b) => weightOrder[a.weight] - weightOrder[b.weight])
  
  return {
    url,
    percentage,
    verdict,
    reasons: detectedReasons,
  }
}
