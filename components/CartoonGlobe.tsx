import React from 'react';

const CartoonGlobe: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-cartoon-blue rounded-full border-4 border-black"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-cartoon-green rounded-full border-2 border-black"></div><div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-cartoon-yellow rounded-full border-2 border-black"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1/5 h-1/5 bg-cartoon-pink rounded-full border-2 border-black"></div>
    </div>
  );
};

export default CartoonGlobe;