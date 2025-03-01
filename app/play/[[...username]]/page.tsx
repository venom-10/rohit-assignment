'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCircle } from '@/components/CartoonElements';

export default function PlayPage({ params }: { params: { username?: string[] } }) {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      router.push(`/quiz/${playerName.trim().toLowerCase()}`);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 animate-wiggle">
        <CartoonStar className="w-16 h-16" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-slow">
        <CartoonCircle className="w-12 h-12 bg-cartoon-pink" />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="cartoon-card max-w-md w-full bg-white">
          <div className="flex justify-center mb-6">
            <CartoonGlobe className="w-24 h-24" />
          </div>
          
          <h1 className="font-bubblegum text-3xl text-center mb-6">Travel Quiz Challenge</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-lg font-bold mb-2">
                Enter your name to start
              </label>
              <input
                type="text"
                id="username"
                className="cartoon-input w-full"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <button
              type="submit"
              className="cartoon-button w-full bg-cartoon-yellow"
            >
              Start Game
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}