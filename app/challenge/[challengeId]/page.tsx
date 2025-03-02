'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCircle } from '@/components/CartoonElements';
import { destinations } from '@/data/destination';

interface ChallengeData {
  challenger: string;
  score: number;
  questions: number[];
}

export default function ChallengePage({ 
  params 
}: { 
  params: { 
    challengeId: string;
  } 
}) {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`/api/challenge/${params.challengeId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        // Get the specific questions using question numbers
        const challengeQuestions = data.questions.map(
          (questionNo: number) => destinations.find(d => d.questionNo === questionNo)
        ).filter(Boolean);

        // Store challenge data for the quiz
        localStorage.setItem('currentChallenge', JSON.stringify({
          ...data,
          questions: challengeQuestions
        }));

        setChallengeData(data);
      } catch (err) {
        console.error('Error fetching challenge:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [params.challengeId, router]);

  const handleStartGame = () => {
    if (playerName.trim()) {
      router.push(`/quiz/${playerName.trim().toLowerCase()}?challengeId=${params.challengeId}`);
    }
  };

  if (isLoading || !challengeData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl md:text-3xl lg:text-4xl font-bubblegum animate-bounce">
          Loading...
        </div>
      </main>
    );
  }

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
          
          <h1 className="font-bubblegum text-3xl md:text-4xl lg:text-5xl text-center mb-6 md:mb-8">
            GlobeTrotter
          </h1>
          
          <div className="bg-cartoon-yellow border-4 border-black rounded-xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
            <p className="text-center text-lg md:text-xl lg:text-2xl font-bold">
              You've been challenged by{' '}
              <span className="font-bubblegum text-xl md:text-2xl lg:text-3xl">
                {challengeData.challenger}
              </span>!
            </p>
            <p className="text-center mt-2 md:mt-3 lg:mt-4">
              Their score:{' '}
              <span className="font-bubblegum text-xl md:text-2xl lg:text-3xl">
                {challengeData.score}/10
              </span>
            </p>
          </div>
          
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
            onClick={handleStartGame}
            className="cartoon-button w-full bg-cartoon-green text-base md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5"
          >
            Accept Challenge
          </button>
          
          <div className="mt-6 md:mt-8 text-center">
            <Link 
              href="/" 
              className="text-blue-600 hover:underline text-base md:text-lg lg:text-xl"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}