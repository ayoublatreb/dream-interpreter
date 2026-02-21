import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'النص مطلوب' }, { status: 400 });
    }

    // ⚡ استخدم backend مباشر
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/dream-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const textData = await response.text(); // نص عادي أولاً
    let data;
    try {
      data = JSON.parse(textData); // حاول تحويله لـ JSON
    } catch {
      data = { error: 'رد من backend ليس JSON', raw: textData };
    }

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error('Error in dream-text API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم', replyText: 'عذراً، حدث خطأ في تفسير حلمك.' },
      { status: 500 }
    );
  }
}