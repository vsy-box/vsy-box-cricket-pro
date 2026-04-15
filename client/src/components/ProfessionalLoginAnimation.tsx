import React, { useEffect, useState } from 'react';
import { MdSportsCricket } from 'react-icons/md';

interface Props {
  onComplete: () => void;
}

const ProfessionalLoginAnimation: React.FC<Props> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Initial fade in & Authenticating
    const t1 = setTimeout(() => setStage(1), 1000); // Stage 1: Welcome text
    const t2 = setTimeout(() => setStage(2), 2000); // Stage 2: Fade out
    const t3 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-950/95 backdrop-blur-xl transition-opacity duration-500 ${stage === 2 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className={`relative flex flex-col items-center transition-all duration-700 ease-out ${stage === 0 ? 'translate-y-8 opacity-0 animate-slide-up' : stage === 2 ? '-translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
        
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-8">
           <div className="absolute inset-0 rounded-full border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl" />
           <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin" style={{ animationDuration: '1s' }} />
           <div className="absolute inset-0 flex items-center justify-center">
             <MdSportsCricket className="text-primary-500 text-3xl sm:text-4xl" />
           </div>
        </div>

        <div className="h-16 flex flex-col items-center justify-center overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-display font-black text-white text-center">
            {stage === 0 ? 'Authenticating...' : 'Accessing Arena'}
          </h2>
          <p className={`text-surface-400 text-xs sm:text-sm font-medium mt-2 transition-opacity duration-300 ${stage === 0 ? 'opacity-100' : 'opacity-0'}`}>
            Secure connection established
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProfessionalLoginAnimation;
