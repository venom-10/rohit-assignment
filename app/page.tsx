'use client';

import React from 'react';
import Link from 'next/link';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCloud, CartoonCircle, CartoonSquiggle } from '@/components/CartoonElements';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 animate-float sm:top-12 sm:left-12 lg:top-16 lg:left-16">
        <CartoonCloud className="w-16 h-12 md:w-20 md:h-16 lg:w-24 lg:h-20" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float sm:bottom-32 sm:right-20 lg:bottom-40 lg:right-32" style={{ animationDelay: '1s' }}>
        <CartoonCloud className="w-20 h-12 md:w-28 md:h-20 lg:w-36 lg:h-24" />
      </div>
      <div className="absolute top-20 right-20 animate-wiggle sm:top-32 sm:right-32 lg:top-40 lg:right-48">
        <CartoonStar className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-slow sm:bottom-60 sm:left-32 lg:bottom-80 lg:left-48">
        <CartoonCircle className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-cartoon-pink" />
      </div>
      <div className="absolute top-40 right-40 sm:top-60 sm:right-60 lg:top-80 lg:right-80">
        <CartoonSquiggle className="w-20 h-10 md:w-28 md:h-14 lg:w-36 lg:h-20" />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="cartoon-card max-w-sm w-full bg-white relative md:max-w-md lg:max-w-lg">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-float">
            <CartoonGlobe className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32" />
          </div>
          
          <div className="mt-12 md:mt-16 lg:mt-20 text-center">
            <h1 className="font-bubblegum text-3xl md:text-4xl lg:text-5xl mb-2">GlobeTrotter</h1>
            <div className="relative">
              <p className="text-base md:text-lg lg:text-xl mb-6">Test your knowledge of world destinations!</p>
              <div className="absolute -right-8 -top-4 rotate-12">
                <CartoonStar className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20" />
              </div>
            </div>
            
            <div className="space-y-4 md:space-y-6 mb-8">
              <Link href="/quiz/guest" className="block">
                <button className="cartoon-button w-full bg-cartoon-yellow text-base md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5">
                  Play as Guest
                </button>
              </Link>
              <Link href="/play" className="block">
                <button className="cartoon-button w-full bg-cartoon-pink text-base md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5">
                  Enter Your Name
                </button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm md:text-base lg:text-lg text-gray-600 relative">
              <div className="absolute -left-10 top-0">
                <CartoonCircle className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 bg-cartoon-blue" />
              </div>
              <p>Discover amazing destinations around the world!</p>
              <p>Learn fun facts and challenge your friends.</p>
              <div className="absolute -right-8 bottom-0">
                <CartoonCircle className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 bg-cartoon-green" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}