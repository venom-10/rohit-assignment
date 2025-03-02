import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challenger_id, score, questions } = body;

    // Validate input
    if (!challenger_id || !Array.isArray(questions) || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid challenge data' },
        { status: 400 }
      );
    }

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert([{
        challenger_id,
        score,
        questions
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({
      challengeId: challenge.id,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
} 