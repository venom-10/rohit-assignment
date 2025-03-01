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

  const handleAnswer = (answer: string) => {
    if (gameState.answered) return;
    
    const correctAnswer = gameState.currentDestination 
      ? `${gameState.currentDestination.city}, ${gameState.currentDestination.country}` 
      : '';
    
    const isCorrect = answer === correctAnswer;
    
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
    }));
  };

  const handleNextQuestion = () => {
    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex >= gameState.questions.length) {
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

  const handleShareChallenge = () => {
    const challengeId = uuidv4();
    const shareUrl = `${window.location.origin}/challenge/${playerName}/${challengeId}/${gameState.score}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Challenge link copied to clipboard! Share it with your friends.');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Share this link with your friends: ' + shareUrl);
      });
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
          <div className="cartoon-card max-w-md w-full bg-white md:max-w-lg lg:max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="font-bubblegum text-3xl md:text-4xl lg:text-5xl mb-4">Quiz Complete!</h1>
              <p className="text-xl md:text-2xl lg:text-3xl">
                Your Score: <span className="font-bold">{gameState.score}/10</span>
              </p>
            </div>

            <button
              onClick={handleShareChallenge}
              className="cartoon-button w-full bg-cartoon-purple text-base md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5 mb-4"
            >
              Challenge Friends
            </button>

            <Link href="/" className="block">
              <button className="cartoon-button w-full bg-cartoon-yellow text-base md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5">
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
      {/* Decorative elements - made larger and spread out more */}
      <div className="absolute top-20 right-20 animate-wiggle sm:top-32 sm:right-32 lg:top-40 lg:right-48">
        <CartoonStar className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-slow sm:bottom-60 sm:left-32 lg:bottom-80 lg:left-48">
        <CartoonCircle className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-cartoon-pink" />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="cartoon-card max-w-md w-full bg-white md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <CartoonGlobe className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mr-3" />
              <h1 className="font-bubblegum text-2xl md:text-3xl lg:text-5xl">Travel Quiz</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="cartoon-badge bg-cartoon-blue md:text-xl lg:text-3xl p-3 lg:p-4">
                <span className="font-bold">Q{gameState.currentQuestionIndex + 1}/10</span>
              </div>
              <div className="cartoon-badge bg-cartoon-yellow md:text-xl lg:text-3xl p-3 lg:p-4">
                <span className="font-bold">{gameState.score}/{gameState.questions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-lg md:text-xl lg:text-3xl font-bold">Player: {playerName}</p>
          </div>
          
          <div className="bg-cartoon-blue border-2 border-black rounded-xl p-4 md:p-6 lg:p-8 mb-8">
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bubblegum mb-4">Where is this place?</h2>
            {gameState.currentDestination?.clues.map((clue, index) => (
              <p key={index} className="text-black mb-3 lg:mb-4 flex items-start text-base md:text-lg lg:text-2xl">
                <span className="inline-block mr-3">•</span> {clue}
              </p>
            ))}
          </div>
          
          {!gameState.answered ? (
            <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-5 mb-8">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="cartoon-button bg-white hover:bg-cartoon-yellow text-base md:text-lg lg:text-2xl py-3 md:py-4 lg:py-5"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-8">
              <div className={`p-4 md:p-6 lg:p-8 rounded-xl border-4 border-black mb-4 ${gameState.isCorrect ? 'bg-cartoon-green' : 'bg-cartoon-pink'}`}>
                <div className="flex items-center mb-3">
                  {gameState.isCorrect ? (
                    <div className="flex items-center font-bubblegum text-xl md:text-2xl lg:text-4xl">
                      <CartoonStar className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 mr-3" />
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center font-bubblegum text-xl md:text-2xl lg:text-4xl">
                      <span>Oops! Wrong answer!</span>
                    </div>
                  )}
                </div>
                <p className="text-black text-base md:text-lg lg:text-2xl">
                  <span className="font-bold">Fun Fact:</span> {gameState.funFact}
                </p>
              </div>
              
              <button
                onClick={handleNextQuestion}
                className={`cartoon-button w-full text-base md:text-lg lg:text-2xl py-3 md:py-4 lg:py-5 
                  ${gameState.currentQuestionIndex === 9 ? 'bg-cartoon-purple' : 'bg-cartoon-blue'}`}
              >
                {gameState.currentQuestionIndex === 9 ? 'Show Results' : 'Next Question'}
              </button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-base md:text-lg lg:text-xl">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}