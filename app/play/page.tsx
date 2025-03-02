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
        if (res.status === 409) {
          setError('This username is already taken. Please choose another one.');
        } else {
          throw new Error(data.error || 'Failed to register');
        }
        return;
      }

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
        <div className="cartoon-card max-w-sm w-full bg-white md:max-w-md lg:max-w-lg">
          <div className="flex justify-center mb-4 md:mb-6">
            <CartoonGlobe className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" />
          </div>
          
          <h1 className="font-bubblegum text-2xl md:text-3xl lg:text-4xl text-center mb-4 md:mb-6">
            GlobeTrotter
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4 md:mb-6">
              <label htmlFor="username" className="block text-base md:text-lg lg:text-xl font-bold mb-2">
                Enter your name to start
              </label>
              <input
                type="text"
                id="username"
                className={`cartoon-input w-full text-base md:text-lg lg:text-xl py-2 md:py-3 outline-none focus:outline-none focus:ring-0 
                  ${error ? 'border-red-500' : 'border-black'}`}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                required
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm md:text-base">
                  {error}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="cartoon-button w-full bg-cartoon-yellow text-sm md:text-base lg:text-lg py-2 md:py-3"
            >
              {isLoading ? 'Creating Player...' : 'Start Game'}
            </button>
          </form>
          
          <div className="mt-4 md:mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-sm md:text-base lg:text-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 