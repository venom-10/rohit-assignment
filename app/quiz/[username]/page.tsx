'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import { Destination, destinations } from '@/data/destination';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCircle } from '@/components/CartoonElements';

interface GameState {
  score: number;
  totalPlayed: number;
  currentDestination: Destination | null;
  options: string[];
  answered: boolean;
  isCorrect: boolean | null;
  funFact: string;
}

export default function QuizPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    totalPlayed: 0,
    currentDestination: null,
    options: [],
    answered: false,
    isCorrect: null,
    funFact: '',
  });
  
  const playerName = params.username || 'Guest';

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    // Select a random destination
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const destination = destinations[randomIndex];
    
    // Create options (including the correct answer)
    const correctAnswer = `${destination.city}, ${destination.country}`;
    const incorrectOptions = destinations
      .filter((d) => d.city !== destination.city)
      .map((d) => `${d.city}, ${d.country}`);
    
    // Shuffle and take 3 incorrect options
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...shuffledIncorrect, correctAnswer].sort(() => 0.5 - Math.random());
    
    // Select a random fun fact
    const randomFactIndex = Math.floor(Math.random() * destination.fun_fact.length);
    
    setGameState({
      ...gameState,
      currentDestination: destination,
      options: allOptions,
      answered: false,
      isCorrect: null,
      funFact: destination.fun_fact[randomFactIndex],
    });
  };

  const handleAnswer = (answer: string) => {
    if (gameState.answered) return;
    
    const correctAnswer = gameState.currentDestination 
      ? `${gameState.currentDestination.city}, ${gameState.currentDestination.country}` 
      : '';
    
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      // Trigger confetti animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE15D', '#7BD3EA', '#FF9EAA', '#A6CF98', '#D09CFA']
      });
    }
    
    setGameState({
      ...gameState,
      score: isCorrect ? gameState.score + 1 : gameState.score,
      totalPlayed: gameState.totalPlayed + 1,
      answered: true,
      isCorrect,
    });
  };

  const handleNextQuestion = () => {
    startNewRound();
  };

  const handleShareChallenge = () => {
    const challengeId = uuidv4();
    const shareUrl = `${window.location.origin}/challenge/${playerName}/${challengeId}/${gameState.score}`;
    
    // In a real app, we would save the challenge to a database
    
    // For now, we'll just copy the URL to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Challenge link copied to clipboard! Share it with your friends.');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Share this link with your friends: ' + shareUrl);
      });
  };

  if (!gameState.currentDestination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bubblegum animate-bounce">Loading...</div>
      </div>
    );
  }

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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <CartoonGlobe className="w-12 h-12 mr-2" />
              <h1 className="font-bubblegum text-2xl">Travel Quiz</h1>
            </div>
            <div className="cartoon-badge bg-cartoon-yellow">
              <span className="font-bold">{gameState.score}/{gameState.totalPlayed}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-lg font-bold">Player: {playerName}</p>
          </div>
          
          <div className="bg-cartoon-blue border-2 border-black rounded-xl p-4 mb-6">
            <h2 className="text-xl font-bubblegum mb-3">Where is this place?</h2>
            {gameState.currentDestination.clues.map((clue, index) => (
              <p key={index} className="text-black mb-2 flex items-start">
                <span className="inline-block mr-2">•</span> {clue}
              </p>
            ))}
          </div>
          
          {!gameState.answered ? (
            <div className="grid grid-cols-1 gap-3 mb-6">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="cartoon-button bg-white hover:bg-cartoon-yellow"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <div className={`p-4 rounded-xl border-4 border-black mb-4 ${gameState.isCorrect ? 'bg-cartoon-green' : 'bg-cartoon-pink'}`}>
                <div className="flex items-center mb-2">
                  {gameState.isCorrect ? (
                    <div className="flex items-center font-bubblegum text-xl">
                      <CartoonStar className="w-8 h-8 mr-2" />
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center font-bubblegum text-xl">
                      <span>Oops! Wrong answer!</span>
                    </div>
                  )}
                </div>
                <p className="text-black">
                  <span className="font-bold">Fun Fact:</span> {gameState.funFact}
                </p>
              </div>
              
              <button
                onClick={handleNextQuestion}
                className="cartoon-button w-full bg-cartoon-blue"
              >
                Next Question
              </button>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t-4 border-black">
            <button
              onClick={handleShareChallenge}
              className="cartoon-button w-full bg-cartoon-purple"
            >
              Challenge a Friend
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}