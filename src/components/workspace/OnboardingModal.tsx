import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, Zap, Layers, FolderTree, Smartphone } from 'lucide-react';
import { triggerHaptic } from '../../utils/clipboard';

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('lv_has_seen_onboarding');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    triggerHaptic(5);
    if (step < 2) {
      setStep(step + 1);
    } else {
      localStorage.setItem('lv_has_seen_onboarding', 'true');
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('lv_has_seen_onboarding', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const CARDS = [
    {
      title: 'Mobile-First Snippet Copying',
      desc: '1 tap copies any code block or full program directly to your clipboard. Swipe right on any tree item to copy immediately without even opening it!',
      icon: Smartphone,
      color: 'from-[#1f6feb] to-[#58a6ff]',
    },
    {
      title: 'Infinite Lab Hierarchy',
      desc: 'Organize Course Units, Lab Experiments, and Questions to 10+ levels deep with automatic outline numbering (1, 1.1, 1.1.2) and rolled-up progress rings.',
      icon: FolderTree,
      color: 'from-[#e3b341] to-[#d29922]',
    },
    {
      title: 'Real-Time Sync & Smart Paste',
      desc: 'Paste a full file with 3 functions to auto-split into 3 blocks. Switch seamlessly between Java and C++ versions with the global toggle.',
      icon: Zap,
      color: 'from-[#238636] to-[#3fb950]',
    },
  ];

  const currentCard = CARDS[step];
  const Icon = currentCard.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-2xl flex flex-col text-center animate-in zoom-in-95 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end -mt-2 -mr-2">
          <button
            type="button"
            onClick={handleSkip}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Icon */}
        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${currentCard.color} flex items-center justify-center text-white shadow-xl mb-5`}>
          <Icon size={32} />
        </div>

        {/* Card Content */}
        <h3 className="text-lg font-bold text-[#f0f6fc] mb-2">
          {currentCard.title}
        </h3>
        <p className="text-xs text-[#8b949e] leading-relaxed mb-6">
          {currentCard.desc}
        </p>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === idx ? 'w-6 bg-[#58a6ff]' : 'w-1.5 bg-[#30363d]'
              }`}
            />
          ))}
        </div>

        {/* Next / Start Button */}
        <button
          type="button"
          onClick={handleNext}
          className="touch-target w-full py-3 bg-[#58a6ff] hover:bg-[#79c0ff] text-black font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#58a6ff]/20"
        >
          <span>{step === 2 ? "Let's Go!" : 'Continue'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
