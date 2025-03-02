import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// In a real app, you'd want to use a database
interface Challenge {
  id: string;
  challenger: string;
  score: number;
  questions: number[];
  createdAt: Date;
}

// Update the interface to match the join
interface ChallengeWithUser {
  id: string;
  questions: number[];
  users: {
    username: string;
    score: number;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;

    const { data: challenge, error } = await supabase
      .from('challenges')
      .select(`
        id,
        questions,
        users!challenger_id (
          username,
          score
        )
      `)
      .eq('id', challengeId)
      .single() as { data: ChallengeWithUser | null, error: any };

    if (error || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      challenger: challenge.users.username,
      score: challenge.users.score,
      questions: challenge.questions
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}