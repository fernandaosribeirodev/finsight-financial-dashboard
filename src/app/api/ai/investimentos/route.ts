import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { resumoCarteira, ativos, historico } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Chave da API não encontrada no .env.local' }, { status: 401 });
    }

    const listaAtivos = ativos.map((a: any) => 
      `- ${a.ticker}: R$ ${a.saldoAtual.toFixed(2)} acumulados (Rentabilidade histórica: ${a.lucroPrejuizoPercent.toFixed(2)}%)`
    ).join('\n');

    const systemPrompt = {
      role: 'system',
      content: `Você é o FinSight Copilot, assistente IA premium. Dados: Patrimônio R$ ${resumoCarteira.patrimonioTotal}, Resultado R$ ${resumoCarteira.lucroTotalCarteira}. Ativos: ${listaAtivos || 'Nenhum'}. Responda de forma curta, educativa e use **negritos**.`
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'FinSight Premium App',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', 
        messages: [systemPrompt, ...historico],
        temperature: 0.7,
        max_tokens: 800, // <--- A MÁGICA ESTÁ AQUI! Evita o bloqueio de saldo do OpenRouter
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro na API do OpenRouter');
    }

    const data = await response.json();
    return NextResponse.json({ insight: data.choices[0].message.content });

  } catch (error: any) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: error.message || 'Falha ao processar' }, { status: 500 });
  }
}