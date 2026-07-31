import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile.ragChatEnabled) {
      return NextResponse.json(
        { error: 'Le chat RAG est actuellement désactivé.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const payload = {
      ...body,
      llm_provider: profile.ragLlmProvider || 'gemini',
    };
    const ragServiceUrl = process.env.RAG_CHAT_INTERNAL_URL || 'http://localhost:3005';

    // Appels locaux avec token de test valide
    const response = await fetch(`${ragServiceUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token:local-visitor:execute:rag_chat'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erreur service RAG Chat local: ${error.message}` },
      { status: 500 }
    );
  }
}
