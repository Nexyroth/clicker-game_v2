import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Sparkles } from 'lucide-react';

interface Props {
  onCollect: (type: 'frenzy' | 'gems', value: number) => void;
}

export const CosmicRift: React.FC<Props> = ({ onCollect }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Spawn rift periodically every 45-75 seconds
    const scheduleNextRift = () => {
      const delay = (45 + Math.random() * 30) * 1000;
      return setTimeout(() => {
        // Random position on screen (15% to 80%)
        const x = 15 + Math.random() * 65;
        const y = 15 + Math.random() * 65;
        setPosition({ x, y });
        setVisible(true);

        // Despawn after 12 seconds if not clicked
        setTimeout(() => {
          setVisible(false);
          scheduleNextRift();
        }, 12000);
      }, delay);
    };

    const timer = scheduleNextRift();
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playLevelUp();
    setVisible(false);

    // 50% chance for Frenzy, 50% for Gems
    if (Math.random() < 0.5) {
      onCollect('frenzy', 7); // 7x multiplier
    } else {
      onCollect('gems', 15);  // +15 gems
    }
  };

  return (
    <div
      onClick={handleClick}
      className="fixed z-40 cursor-pointer select-none animate-bounce"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="relative flex items-center justify-center group">
        {/* Glowing Aura Ring */}
        <div className="absolute w-16 h-16 rounded-full bg-amber-400/30 blur-md animate-ping pointer-events-none" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-purple-500 to-cyan-400 p-0.5 shadow-[0_0_25px_rgba(251,191,36,0.8)] group-hover:scale-125 transition-transform flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
        <span className="absolute -bottom-5 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[10px] font-extrabold text-amber-300 uppercase tracking-widest whitespace-nowrap shadow-md pointer-events-none">
          Cosmic Rift!
        </span>
      </div>
    </div>
  );
};
