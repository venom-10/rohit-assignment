import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challenger_id, questions } = body;

    if (!challenger_id || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid challenge data' },
        { status: 400 }
      );
    }

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert([{
        challenger_id,
        questions
      }])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      challengeId: challenge.id,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
} 