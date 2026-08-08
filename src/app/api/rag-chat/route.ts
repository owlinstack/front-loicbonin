import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/api';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getIamToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const iamUrl = process.env.IAM_SERVICE_URL || 'http://iam:3000';
  const clientId = process.env.IAM_CLIENT_ID || 'blog-visitor';
  const clientSecret = process.env.IAM_BLOG_VISITOR_SECRET || process.env.IAM_CLIENT_SECRET || 'maclé';

  const res = await fetch(`${iamUrl}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: 'blog-visitor-agent',
      client_id: clientId,
      client_secret: clientSecret,
      scopes: ['execute:rag_chat']
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`IAM token request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.token || data.access_token;
  if (!cachedToken) {
    throw new Error('IAM API token key missing in response payload');
  }
  tokenExpiresAt = now + (data.expires_in || 900) * 1000 - 60000;
  return cachedToken;
}

export async function GET() {
  try {
    const ragServiceUrl = process.env.RAG_CHAT_INTERNAL_URL || 'http://localhost:3000';
    const response = await fetch(`${ragServiceUrl}/health`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Microservice indisponible');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: 'ok', generation_provider: 'google' });
  }
}

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
    const ragServiceUrl = process.env.RAG_CHAT_INTERNAL_URL || 'http://localhost:3000';

    let token = 'mock-token:local-visitor:execute:rag_chat';
    if (process.env.NODE_ENV === 'production') {
      try {
        token = await getIamToken();
      } catch (iamErr: any) {
        console.error('Erreur de récupération du jeton IAM:', iamErr.message);
        return NextResponse.json(
          { error: `Authentification IAM échouée: ${iamErr.message}` },
          { status: 401 }
        );
      }
    }

    const response = await fetch(`${ragServiceUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erreur service RAG Chat: ${error.message}` },
      { status: 500 }
    );
  }
}
