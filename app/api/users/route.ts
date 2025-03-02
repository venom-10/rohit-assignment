import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    // Basic validation
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      );
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', normalizedUsername)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ username: normalizedUsername }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      username: normalizedUsername,
      id: newUser.id,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 