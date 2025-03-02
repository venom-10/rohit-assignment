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

// Add type for the join query result
interface ChallengeWithUser {
  id: string;
  score: number;
  questions: number[];
  users: {
    username: string;
  };
}

const challenges = new Map<string, Challenge>();

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
        score,
        questions,
        users!challenger_id (username)
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
      score: challenge.score,
      questions: challenge.questions
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}

// Helper function to create a new challenge
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