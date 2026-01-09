'use client'

import { useEffect, useState } from 'react'

interface FirstRatingCelebrationProps {
  onClose: () => void
}

export default function FirstRatingCelebration({ onClose }: FirstRatingCelebrationProps) {
  const [stage, setStage] = useState<'appearing' | 'showing' | 'disappearing'>('appearing')

  useEffect(() => {
    // Stage 1: Fade in and bounce
    setTimeout(() => setStage('showing'), 100)

    // Stage 2: Hold for celebration
    setTimeout(() => setStage('disappearing'), 3500)

    // Stage 3: Fade out and call onClose
    setTimeout(() => onClose(), 4000)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-500 ${
        stage === 'appearing' ? 'bg-opacity-0' : stage === 'showing' ? 'bg-opacity-70' : 'bg-opacity-0'
      }`}
    >
      <div
        className={`bg-card border-4 border-foreground shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 text-center max-w-md transform transition-all duration-500 ${
          stage === 'appearing'
            ? 'scale-0 opacity-0'
            : stage === 'showing'
            ? 'scale-100 opacity-100 animate-bounce-slow'
            : 'scale-0 opacity-0'
        }`}
      >
        {/* Animated Egg */}
        <div className="relative mb-6">
          <div className="text-9xl animate-wiggle inline-block">
            🥚
          </div>
          {/* Sparkles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="absolute -top-4 -left-4 text-4xl animate-ping-slow">✨</span>
            <span className="absolute -top-4 -right-4 text-4xl animate-ping-slow animation-delay-200">✨</span>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl animate-ping-slow animation-delay-400">✨</span>
          </div>
        </div>

        {/* Celebration Text */}
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase tracking-tight animate-fade-in">
          First Rating!
        </h2>
        <p className="text-xl text-muted-foreground uppercase tracking-wide font-bold mb-6 animate-fade-in animation-delay-300">
          You received your first gift!
        </p>

        {/* Gift Description */}
        <div className="bg-secondary text-secondary-foreground border-4 border-foreground px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-fade-in animation-delay-600">
          <p className="font-bold text-lg uppercase tracking-wide">
            🥚 Mysterious Egg
          </p>
          <p className="text-sm mt-2 font-bold">
            Keep rating to see what hatches!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  )
}
