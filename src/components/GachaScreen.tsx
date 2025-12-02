import React, { useState } from 'react';
import { GachaItem, pullGacha } from '../gachaData';

interface GachaScreenProps {
  onBack: () => void;
}

const GachaScreen: React.FC<GachaScreenProps> = ({ onBack }) => {
  const [status, setStatus] = useState<'idle' | 'animating' | 'result'>('idle');
  const [result, setResult] = useState<GachaItem | null>(null);

  const handlePull = () => {
    setStatus('animating');
    // Simulate delay for animation
    setTimeout(() => {
      const item = pullGacha();
      setResult(item);
      setStatus('result');
    }, 2000);
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'UR': return 'bg-gradient-to-tr from-yellow-300 via-purple-500 to-pink-500';
      case 'SR': return 'bg-gradient-to-tr from-yellow-200 to-yellow-500';
      case 'R': return 'bg-gradient-to-tr from-blue-200 to-blue-400';
      case 'UC': return 'bg-green-100';
      default: return 'bg-white';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'UR': return 'text-purple-600 font-black drop-shadow-md';
      case 'SR': return 'text-yellow-600 font-bold';
      case 'R': return 'text-blue-600 font-bold';
      case 'UC': return 'text-green-600 font-medium';
      default: return 'text-gray-600';
    }
  };

  const getRarityEffect = (rarity: string) => {
    if (rarity === 'UR') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Rotating rays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slow opacity-30">
            <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,gold_20deg,transparent_40deg,gold_60deg,transparent_80deg,gold_100deg,transparent_120deg,gold_140deg,transparent_160deg,gold_180deg,transparent_200deg,gold_220deg,transparent_240deg,gold_260deg,transparent_280deg,gold_300deg,transparent_320deg,gold_340deg,transparent_360deg)]"></div>
          </div>
          {/* Confetti particles (simplified as dots) */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pop-out"
              style={{
                backgroundColor: ['#f00', '#0f0', '#00f', '#ff0', '#f0f'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `scale(${Math.random() * 1.5})`,
              }}
            />
          ))}
        </div>
      );
    }
    if (rarity === 'SR') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Sparkles */}
             {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 animate-pulse text-2xl"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random()}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/50 rounded-3xl -z-10 shadow-lg border border-white/80 backdrop-blur-sm" />

      <h1 className="text-3xl font-bold text-slate-800 mb-8 tracking-wider">どうぶつガチャ</h1>

      <div className="flex-1 w-full flex items-center justify-center min-h-[300px] mb-8 relative">
        {status === 'idle' && (
          <div className="text-center">
            <div className="text-8xl mb-4">🎁</div>
            <p className="text-slate-500">ボタンをおしてガチャをまわそう！</p>
          </div>
        )}

        {status === 'animating' && (
          <div className="relative">
            <div className="text-9xl animate-shake drop-shadow-2xl">💊</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-white animate-flash opacity-0 rounded-full blur-xl"></div>
            </div>
          </div>
        )}

        {status === 'result' && result && (
          <div className={`relative w-full max-w-sm aspect-square flex flex-col items-center justify-center rounded-2xl shadow-2xl p-6 animate-pop-out overflow-hidden border-4 border-white ${getRarityColor(result.rarity)}`}>
            {getRarityEffect(result.rarity)}

            <div className="z-10 text-center">
              <div className={`text-4xl mb-2 font-black italic ${getRarityText(result.rarity)}`}>
                {result.rarity}
              </div>
              <div className="text-9xl mb-4 drop-shadow-md transform transition-transform hover:scale-110 duration-300 flex justify-center items-center">
                {result.imageUrl && result.imageUrl.startsWith('/') ? (
                  <img
                    src={result.imageUrl}
                    alt={result.name}
                    className="w-32 h-32 object-contain filter drop-shadow-lg"
                  />
                ) : (
                  result.imageUrl
                )}
              </div>
              <div className="text-2xl font-bold text-slate-800 bg-white/80 px-4 py-1 rounded-full mb-2 inline-block shadow-sm">
                {result.name}
              </div>
              <p className="text-sm text-slate-700 bg-white/60 px-3 py-1 rounded-lg">
                {result.description}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-full font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 transition-colors shadow-md border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
        >
          もどる
        </button>

        {status === 'result' ? (
           <button
           onClick={handleReset}
           className="flex-1 py-3 px-6 rounded-full font-bold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-md border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
         >
           もういちど
         </button>
        ) : (
          <button
            onClick={handlePull}
            disabled={status === 'animating'}
            className="flex-1 py-3 px-6 rounded-full font-bold text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1"
          >
            {status === 'animating' ? '......' : 'ガチャをまわす'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GachaScreen;
