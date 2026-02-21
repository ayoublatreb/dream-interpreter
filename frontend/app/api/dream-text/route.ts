import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'النص مطلوب' },
        { status: 400 }
      );
    }

    // Forward request to backend server
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    const response = await fetch(`${backendUrl}/dream-text`, {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in dream-text API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم', replyText: 'عذراً، حدث خطأ في تفسير حلمك. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
