import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, score } = body;

    if (!userId || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid score data' },
        { status: 400 }
      );
    }

    const { data, error: updateError } = await supabase
      .from('users')
      .update({ score })
      .eq('id', userId)
      .select('username, score')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      message: 'Score updated successfully',
      user: data
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update score' },
      { status: 500 }
    );
  }
} 