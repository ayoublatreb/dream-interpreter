import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio');

    if (!audio) {
      return NextResponse.json(
        { error: 'الصوت مطلوب' },
        { status: 400 }
      );
    }
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio');

    if (!audio) {
      return NextResponse.json(
        { error: 'الصوت مطلوب' },
        { status: 400 }
      );
    }

    // Forward request to backend server
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    const response = await fetch(`${backendUrl}/dream-audio`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in dream-audio API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم', replyText: 'عذراً، حدث خطأ في تفسير حلمك. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

    // Forward request to backend server
   // const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
   const backendUrl = process.env.BACKEND_URL || '/api';
    const response = await fetch(`${backendUrl}/dream-audio`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in dream-audio API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم', replyText: 'عذراً، حدث خطأ في تفسير حلمك. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
