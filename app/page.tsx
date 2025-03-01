'use client';

import React from 'react';
import Link from 'next/link';
import CartoonGlobe from '@/components/CartoonGlobe';
import { CartoonStar, CartoonCloud, CartoonCircle, CartoonSquiggle } from '@/components/CartoonElements';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 animate-float">
        <CartoonCloud className="w-24 h-16" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <CartoonCloud className="w-20 h-12" />
      </div>
      <div className="absolute top-20 right-20 animate-wiggle">
        <CartoonStar className="w-16 h-16" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-slow">
        <CartoonCircle className="w-12 h-12 bg-cartoon-pink" />
      </div>
      <div className="absolute top-40 right-40">
        <CartoonSquiggle className="w-20 h-10" />
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="cartoon-card max-w-md w-full bg-white relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-float">
            <CartoonGlobe className="w-32 h-32" />
          </div>
          
          <div className="mt-16 text-center">
            <h1 className="font-bubblegum text-4xl mb-2 text-black">Travel Quiz Challenge</h1>
            <div className="relative">
              <p className="text-lg mb-8 text-gray-700">Test your knowledge of world destinations!</p>
              <div className="absolute -right-8 -top-4 rotate-12">
                <CartoonStar className="w-10 h-10" />
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <Link href="/play/Guest" className="block">
                <button className="cartoon-button w-full bg-cartoon-yellow">
                  Play as Guest
                </button>
              </Link>
              <Link href="/play" className="block">
                <button className="cartoon-button w-full bg-cartoon-pink">
                  Enter Your Name
                </button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-600 relative">
              <div className="absolute -left-10 top-0">
                <CartoonCircle className="w-8 h-8 bg-cartoon-blue" />
              </div>
              <p>Discover amazing destinations around the world!</p>
              <p>Learn fun facts and challenge your friends.</p>
              <div className="absolute -right-8 bottom-0">
                <CartoonCircle className="w-6 h-6 bg-cartoon-green" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}