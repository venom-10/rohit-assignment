import React from 'react';

export const CartoonStar: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          fill="#FFE15D" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

export const CartoonCloud: React.FC<{ className?: string }> = ({ className = "w-16 h-10" }) => {
  return (
    <div className={`${className} relative`}>
      <div className="absolute inset-0 bg-white rounded-full border-2 border-black"></div>
      <div className="absolute top-0 left-1/4 w-1/2 h-3/4 bg-white rounded-full border-2 border-black"></div>
      <div className="absolute top-0 right-1/4 w-1/2 h-3/4 bg-white rounded-full border-2 border-black"></div>
    </div>
  );
};

export const CartoonSquiggle: React.FC<{ className?: string }> = ({ className = "w-12 h-6" }) => {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25C20 5 30 45 50 25C70 5 80 45 100 25" 
          stroke="#FF9EAA" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export const CartoonCircle: React.FC<{ className?: string, color?: string }> = ({ 
  className = "w-8 h-8", 
  color = "bg-cartoon-yellow" 
}) => {
  return (
    <div className={`${className} ${color} rounded-full border-2 border-black`}></div>
  );
};