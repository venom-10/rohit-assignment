'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCircle } from '@/components/CartoonElements';

export default function PlayPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: playerName.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Store user data in localStorage
      localStorage.setItem('userId', data.id);
      localStorage.setItem('username', data.username);

      router.push(`/quiz/${data.username}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 animate-wiggle sm:top-32 sm:right-32 lg:top-40 lg:right-48">
        <CartoonStar className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-slow sm:bottom-60 sm:left-32 lg:bottom-80 lg:left-48">
        <CartoonCircle className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-cartoon-pink" />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="cartoon-card max-w-md w-full bg-white md:max-w-lg lg:max-w-2xl">
          <div className="flex justify-center mb-6 md:mb-8">
            <CartoonGlobe className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />
          </div>
          
          <h1 className="font-bubblegum text-3xl md:text-4xl lg:text-5xl text-center mb-6 md:mb-8">GlobeTrotter</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6 md:mb-8">
              <label htmlFor="username" className="block text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">
                Enter your name to start
              </label>
              <input
                type="text"
                id="username"
                className="cartoon-input w-full text-lg md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5 outline-none focus:outline-none focus:ring-0 focus:border-black"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="cartoon-button w-full bg-cartoon-yellow text-base md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5"
            >
              {isLoading ? 'Creating Player...' : 'Start Game'}
            </button>
          </form>
          
          <div className="mt-6 md:mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-base md:text-lg lg:text-xl">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 