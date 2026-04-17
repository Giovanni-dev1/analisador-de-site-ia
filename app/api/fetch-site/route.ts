import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  
  if (!url) {
    return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
  }
  
  try {
    // Valida a URL
    const parsedUrl = new URL(url)
    
    // Busca o HTML da página
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VibeCheck/1.0; +https://vibecheck.dev)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Não foi possível acessar o site: ${response.status}` },
        { status: 502 }
      )
    }
    
    const html = await response.text()
    
    // Limita o tamanho do conteúdo para análise (primeiros 500KB)
    const content = html.slice(0, 500000)
    
    // Tenta buscar também arquivos JS principais mencionados no HTML
    const jsContent = await fetchMainScripts(parsedUrl, html)
    
    return NextResponse.json({
      content: content + "\n" + jsContent,
      url: parsedUrl.toString(),
    })
  } catch (error) {
    console.error("Erro ao buscar site:", error)
    return NextResponse.json(
      { error: "Erro ao acessar o site" },
      { status: 500 }
    )
  }
}

async function fetchMainScripts(baseUrl: URL, html: string): Promise<string> {
  const scriptMatches = html.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi) || []
  const jsContents: string[] = []
  
  // Busca até 3 scripts principais
  const scriptsToFetch = scriptMatches
    .slice(0, 3)
    .map(tag => {
      const match = tag.match(/src=["']([^"']+)["']/)
      return match ? match[1] : null
    })
    .filter(Boolean) as string[]
  
  for (const scriptSrc of scriptsToFetch) {
    try {
      const scriptUrl = new URL(scriptSrc, baseUrl)
      // Só busca scripts do mesmo domínio
      if (scriptUrl.hostname !== baseUrl.hostname) continue
      
      const response = await fetch(scriptUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; VibeCheck/1.0)",
        },
        signal: AbortSignal.timeout(5000),
      })
      
      if (response.ok) {
        const js = await response.text()
        // Limita cada script a 100KB
        jsContents.push(js.slice(0, 100000))
      }
    } catch {
      // Ignora erros em scripts individuais
    }
  }
  
  return jsContents.join("\n")
}
