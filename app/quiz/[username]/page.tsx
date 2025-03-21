'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import { Destination, destinations } from '@/data/destination';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCircle } from '@/components/CartoonElements';
import type { Challenge } from '@/types';

interface GameState {
  score: number;
  currentQuestionIndex: number;
  questions: Destination[];
  currentDestination: Destination | null;
  options: string[];
  answered: boolean;
  isCorrect: boolean | null;
  funFact: string;
  isGameComplete: boolean;
}

export default function QuizPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const playerName = params.username || 'Guest';
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentQuestionIndex: 0,
    questions: [],
    currentDestination: null,
    options: [],
    answered: false,
    isCorrect: null,
    funFact: '',
    isGameComplete: false
  });
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);

  useEffect(() => {
    // Select 10 random destinations
    const shuffled = [...destinations].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);
    
    setGameState(prev => ({
      ...prev,
      questions: selectedQuestions,
      currentDestination: selectedQuestions[0],
      options: generateOptions(selectedQuestions[0]),
      funFact: getRandomFunFact(selectedQuestions[0])
    }));
  }, []);

  const generateOptions = (destination: Destination) => {
    const correctAnswer = `${destination.city}, ${destination.country}`;
    const incorrectOptions = destinations
      .filter((d) => d.city !== destination.city)
      .map((d) => `${d.city}, ${d.country}`);
    
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledIncorrect, correctAnswer].sort(() => 0.5 - Math.random());
  };

  const getRandomFunFact = (destination: Destination) => {
    const randomIndex = Math.floor(Math.random() * destination.fun_fact.length);
    return destination.fun_fact[randomIndex];
  };

  const handleAnswer = async (answer: string) => {
    if (gameState.answered) return;

    const correctAnswer = gameState.currentDestination 
      ? `${gameState.currentDestination.city}, ${gameState.currentDestination.country}` 
      : '';
    
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    
    if (isCorrect) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE15D', '#7BD3EA', '#FF9EAA', '#A6CF98', '#D09CFA']
      });
    }

    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answered: true,
      isCorrect,
      funFact: gameState.currentDestination?.fun_fact[
        Math.floor(Math.random() * gameState.currentDestination.fun_fact.length)
      ] || ''
    }));
  };

  const handleNextQuestion = async () => {
    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex >= gameState.questions.length) {
      // Update score when showing results
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User not found');

        const scoreRes = await fetch('/api/users/score', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            score: gameState.score
          })
        });

        if (!scoreRes.ok) {
          const data = await scoreRes.json();
          console.error('Failed to update score:', data.error);
        }
      } catch (err) {
        console.error('Error updating score:', err);
      }

      setGameState(prev => ({ ...prev, isGameComplete: true }));
      return;
    }

    const nextQuestion = gameState.questions[nextIndex];
    setGameState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex,
      currentDestination: nextQuestion,
      options: generateOptions(nextQuestion),
      answered: false,
      isCorrect: null,
      funFact: getRandomFunFact(nextQuestion)
    }));
  };

  const handleShareChallenge = async () => {
    try {
      setIsCreatingChallenge(true);
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not found');

      // Create challenge without updating score
      const challengeRes = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenger_id: userId,
          questions: gameState.questions.map(q => q.questionNo)
        })
      });

      const data = await challengeRes.json();
      if (!challengeRes.ok) throw new Error(data.error);

      const shareUrl = `${window.location.origin}/challenge/${data.challengeId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      alert('Challenge link copied to clipboard! Share it with your friends.');
    } catch (err) {
      console.error('Error creating challenge:', err);
      alert('Failed to create challenge. Please try again.');
    } finally {
      setIsCreatingChallenge(false);
    }
  };

  if (!gameState.currentDestination && !gameState.isGameComplete) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bubblegum animate-bounce text-center p-4">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  if (gameState.isGameComplete) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="cartoon-card max-w-sm w-full bg-white md:max-w-md lg:max-w-lg">
            <div className="text-center mb-4">
              <h1 className="font-bubblegum text-2xl md:text-3xl lg:text-4xl mb-3">Quiz Complete!</h1>
              <div className="bg-cartoon-yellow border-2 border-black rounded-xl p-3 md:p-4 lg:p-5 mb-4">
                <p className="text-lg md:text-xl lg:text-2xl font-bold">
                  Your Score: <span className="font-bubblegum">{gameState.score}/10</span>
                </p>
                {gameState.score === 10 && (
                  <p className="mt-3 text-base md:text-lg lg:text-xl">
                    🎉 Perfect Score! You're a geography genius! 🎉
                  </p>
                )}
              </div>
            </div>

            {/* Only show Challenge Friends button for registered users */}
            {playerName !== 'guest' && (
              <button
                onClick={handleShareChallenge}
                disabled={isCreatingChallenge}
                className="cartoon-button w-full bg-cartoon-purple text-sm md:text-base lg:text-lg py-2 md:py-3 mb-3"
              >
                {isCreatingChallenge ? 'Creating Challenge...' : 'Challenge Friends'}
              </button>
            )}

            <Link href="/" className="block">
              <button className="cartoon-button w-full bg-cartoon-yellow text-sm md:text-base lg:text-lg py-2 md:py-3">
                Play Again
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative elements - made smaller */}
      <div className="absolute top-10 right-10 animate-wiggle sm:top-16 sm:right-16">
        <CartoonStar className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20" />
      </div>
      <div className="absolute bottom-20 left-10 animate-bounce-slow sm:bottom-32 sm:left-16">
        <CartoonCircle className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-cartoon-pink" />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="cartoon-card max-w-sm w-full bg-white md:max-w-md lg:max-w-lg">
          {/* Header section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <CartoonGlobe className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mr-2" />
              <h1 className="font-bubblegum text-lg md:text-xl lg:text-2xl">GlobeTrotter</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="cartoon-badge bg-cartoon-blue text-sm md:text-base lg:text-lg p-2">
                <span className="font-bold">Q{gameState.currentQuestionIndex + 1}/10</span>
              </div>
            </div>
          </div>

          {/* Question section */}
          <div className="bg-cartoon-blue border-2 border-black rounded-xl p-2 md:p-3 lg:p-4 mb-4">
            <h2 className="text-base md:text-lg lg:text-xl font-bubblegum mb-2">Where is this place?</h2>
            {gameState.currentDestination?.clues.map((clue, index) => (
              <p key={index} className="text-black mb-2 flex items-start text-sm md:text-base lg:text-lg">
                <span className="inline-block mr-2">•</span> {clue}
              </p>
            ))}
          </div>

          {/* Answer buttons */}
          {!gameState.answered ? (
            <div className="grid grid-cols-1 gap-2 md:gap-3 mb-4">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="cartoon-button bg-white hover:bg-cartoon-yellow text-sm md:text-base lg:text-lg py-2 md:py-3"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <div className={`p-2 md:p-3 lg:p-4 rounded-xl border-2 border-black mb-3 
                ${gameState.isCorrect ? 'bg-cartoon-green' : 'bg-cartoon-pink'}`}>
                <div className="flex items-center mb-2">
                  {gameState.isCorrect ? (
                    <div className="flex items-center font-bubblegum text-base md:text-lg lg:text-xl">
                      <CartoonStar className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 mr-2" />
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center font-bubblegum text-base md:text-lg lg:text-xl">
                      <span>Oops! Wrong answer!</span>
                    </div>
                  )}
                </div>
                <p className="text-black text-sm md:text-base lg:text-lg">
                  <span className="font-bold">Fun Fact:</span> {gameState.funFact}
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                className={`cartoon-button w-full text-sm md:text-base lg:text-lg py-2 md:py-3
                  ${gameState.currentQuestionIndex === 9 ? 'bg-cartoon-purple' : 'bg-cartoon-blue'}`}
              >
                {gameState.currentQuestionIndex === 9 ? 'Show Results' : 'Next Question'}
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-sm md:text-base lg:text-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}