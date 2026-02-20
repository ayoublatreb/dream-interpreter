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

    // 👇 استعمل الدومين 
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ahlamok.com';

    const response = await fetch(`${backendUrl}/api/dream-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'خطأ من الخادم الخلفي', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in dream-audio API:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في الخادم',
        replyText: 'عذراً، حدث خطأ في تفسير حلمك. يرجى المحاولة مرة أخرى.'
      },
      { status: 500 }
    );
  }
}