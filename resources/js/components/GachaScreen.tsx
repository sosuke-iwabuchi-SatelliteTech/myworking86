import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GachaItem } from '../types';

interface GachaScreenProps {
  onBack: () => void;
}

type GachaState = 'idle' | 'dropping' | 'shaking' | 'opening' | 'result';
type VisualType = 'normal' | 'gold' | 'rainbow';

// Fake gold chance for non-hit items (approx 8.5% to match 1/3 reliability for gold)
const FAKE_GOLD_CHANCE = 0.085;

// Gacha Capsule Component
const GachaCapsule: React.FC<{ type: VisualType; color?: string; className?: string; isOpening?: boolean }> = ({ type, color = 'bg-blue-500', className = '', isOpening = false }) => {
  const getTopStyle = () => {
    if (type === 'rainbow') {
      return 'bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)]';
    }
    if (type === 'gold') {
      return 'bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-600';
    }
    return color; // Normal color
  };

  return (
    <div className={`relative w-48 h-48 ${className}`}>
      {/* Light Rays (Behind Capsule) */}
      {isOpening && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] z-0 animate-ray-burst">
          <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,gold_10deg,transparent_20deg,gold_30deg,transparent_40deg,gold_50deg,transparent_60deg,gold_70deg,transparent_80deg,gold_90deg,transparent_100deg,gold_110deg,transparent_120deg,gold_130deg,transparent_140deg,gold_150deg,transparent_160deg,gold_170deg,transparent_180deg,gold_190deg,transparent_200deg,gold_210deg,transparent_220deg,gold_230deg,transparent_240deg,gold_250deg,transparent_260deg,gold_270deg,transparent_280deg,gold_290deg,transparent_300deg,gold_310deg,transparent_320deg,gold_330deg,transparent_340deg,gold_350deg,transparent_360deg)] opacity-60"></div>
        </div>
      )}

      {/* Capsule Body */}
      <div className="relative w-full h-full rounded-full shadow-xl overflow-hidden border-4 border-black/10 bg-transparent z-10">
        {/* Top Half */}
        <div className={`absolute top-0 left-0 w-full h-1/2 ${getTopStyle()} z-20 origin-bottom ${isOpening ? 'animate-capsule-open-top' : ''}`}>
          {/* Highlight */}
          <div className="absolute top-2 left-4 w-8 h-4 bg-white/40 rounded-full rotate-[-15deg]"></div>
        </div>

        {/* Bottom Half */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/90 z-10"></div>

        {/* Middle Belt */}
        <div className={`absolute top-1/2 left-0 w-full h-0 border-t-4 border-black/5 z-30 -translate-y-1/2 ${isOpening ? 'opacity-0 transition-opacity duration-100' : ''}`}></div>
      </div>
    </div>
  );
};

const GachaScreen: React.FC<GachaScreenProps> = ({ onBack }) => {
  const [status, setStatus] = useState<GachaState>('idle');
  const [result, setResult] = useState<GachaItem | null>(null);
  const [visualType, setVisualType] = useState<VisualType>('normal');
  const [capsuleColor, setCapsuleColor] = useState<string>('bg-blue-500');
  const [points, setPoints] = useState<number>(0);

  // New State for Server Integration
  const [isFreeAvailable, setIsFreeAvailable] = useState<boolean>(false);
  const [cost, setCost] = useState<number>(300);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = () => {
    axios.get('/api/gacha/status')
      .then(res => {
        setPoints(res.data.points);
        setIsFreeAvailable(res.data.isFreeAvailable);
        setCost(res.data.cost);
      })
      .catch(err => console.error("Failed to fetch gacha status:", err));
  };

  // Use a ref to store the image loading promise so we can check it in useEffect
  const imageLoadPromiseRef = useRef<Promise<void> | null>(null);

  const handlePull = async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);

    try {
        const res = await axios.post('/api/gacha/pull');
        const data = res.data;

        const item: GachaItem = data.result;
        setResult(item);
        setPoints(data.points);
        setIsFreeAvailable(data.isFreeAvailable);

        // Start Image Preloading
        if (item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http'))) {
            imageLoadPromiseRef.current = new Promise((resolve) => {
                const img = new Image();
                img.src = item.imageUrl!;
                img.onload = () => resolve();
                img.onerror = () => {
                    console.error("Failed to preload image:", item.imageUrl);
                    resolve();
                };
            });
        } else {
            imageLoadPromiseRef.current = Promise.resolve();
        }

        // Determine Visuals
        let visual: VisualType = 'normal';
        if (item.rarity === 'UR') {
            visual = 'rainbow';
        } else if (item.rarity === 'SR') {
            visual = 'gold';
        } else {
            if (Math.random() < FAKE_GOLD_CHANCE) {
                visual = 'gold';
            } else {
                visual = 'normal';
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500'];
                setCapsuleColor(colors[Math.floor(Math.random() * colors.length)]);
            }
        }
        setVisualType(visual);

        // Start Animation
        setStatus('dropping');

    } catch (err: any) {
        if (err.response && err.response.status === 400) {
            alert(err.response.data.message || 'ポイントが足りません');
        } else {
            console.error(err);
            alert('エラーが発生しました');
        }
        setLoading(false); // Reset loading only on error, otherwise animation handles state flow?
        // Actually, if we start animation, we are technically "busy" until reset.
        // But `loading` blocks the request.
        // We can set loading false here, as `status !== 'idle'` will block button.
    } finally {
        // If successful, status changes to 'dropping', which disables button.
        // So we can safely set loading false.
        setLoading(false);
    }
  };

  // Animation Sequence Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === 'dropping') {
      timer = setTimeout(() => setStatus('shaking'), 1000); // 1s drop
    }
    else if (status === 'shaking') {
      // Wait for BOTH the minimum animation time (3s) AND the image to load
      const minAnimationTime = new Promise<void>(resolve => {
        timer = setTimeout(() => resolve(), 3000);
      });

      const imageLoad = imageLoadPromiseRef.current || Promise.resolve();

      Promise.all([minAnimationTime, imageLoad]).then(() => {
        setStatus('opening');
      });
    }
    else if (status === 'opening') {
      timer = setTimeout(() => setStatus('result'), 800); // 0.8s for opening animation
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status]);

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    imageLoadPromiseRef.current = null;
    fetchStatus(); // Refresh status (points/free) just in case
  };

  // Helper functions for Result Display
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

  const getResultEffect = (rarity: string) => {
    if (rarity === 'UR') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Rotating rays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slow opacity-30">
            <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,gold_20deg,transparent_40deg,gold_60deg,transparent_80deg,gold_100deg,transparent_120deg,gold_140deg,transparent_160deg,gold_180deg,transparent_200deg,gold_220deg,transparent_240deg,gold_260deg,transparent_280deg,gold_300deg,transparent_320deg,gold_340deg,transparent_360deg)]"></div>
          </div>
          {/* Confetti particles */}
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

  // Background effects for Shaking Phase (Flashy mode)
  const renderShakingBackground = () => {
    if (visualType === 'normal') return null;

    const isRainbow = visualType === 'rainbow';

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
        {/* Concentrated Lines / Sunburst */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] ${isRainbow ? 'animate-spin-fast' : 'animate-spin-slow'} opacity-20`}>
          <div className={`w-full h-full ${isRainbow
            ? 'bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)]'
            : 'bg-[conic-gradient(from_0deg,transparent_0deg,gold_10deg,transparent_20deg,gold_30deg,transparent_40deg,gold_50deg,transparent_60deg,gold_70deg,transparent_80deg,gold_90deg,transparent_100deg,gold_110deg,transparent_120deg,gold_130deg,transparent_140deg,gold_150deg,transparent_160deg,gold_170deg,transparent_180deg,gold_190deg,transparent_200deg,gold_210deg,transparent_220deg,gold_230deg,transparent_240deg,gold_250deg,transparent_260deg,gold_270deg,transparent_280deg,gold_290deg,transparent_300deg,gold_310deg,transparent_320deg,gold_330deg,transparent_340deg,gold_350deg,transparent_360deg)]'
            }`}></div>
        </div>

        {/* Flashy particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
              animationDuration: `${Math.random() * 0.5 + 0.5}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {isRainbow ? '🌟' : '✨'}
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/50 rounded-3xl -z-20 shadow-lg border border-white/80 backdrop-blur-sm" />

      {/* Dynamic Background during Shaking */}
      {(status === 'shaking' || status === 'opening') && renderShakingBackground()}

      <h1 className="text-3xl font-bold text-slate-800 mb-8 tracking-wider">どうぶつガチャ</h1>

      <div className="flex-1 w-full flex items-center justify-center min-h-[300px] mb-8 relative">
        {status === 'idle' && (
          <div className="text-center animate-zoom-pulse">
            <div className="text-8xl mb-4">🎁</div>
            <p className="text-slate-500">ボタンをおしてガチャをまわそう！</p>
          </div>
        )}

        {(status === 'dropping' || status === 'shaking' || status === 'opening') && (
          <div className={`relative ${status === 'dropping' ? 'animate-drop-bounce' :
            status === 'shaking' ? 'animate-sway' : ''
            }`}>
            <GachaCapsule type={visualType} color={capsuleColor} isOpening={status === 'opening'} />
            {/* Glow effect for high rarity */}
            {(visualType === 'gold' || visualType === 'rainbow') && (
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 -z-10 animate-pulse"></div>
            )}
          </div>
        )}

        {status === 'result' && result && (
          <div className={`relative w-full max-w-sm aspect-square flex flex-col items-center justify-center rounded-2xl shadow-2xl p-6 animate-pop-out overflow-hidden border-4 border-white ${getRarityColor(result.rarity)}`}>
            {getResultEffect(result.rarity)}

            <div className="z-10 text-center">
              <div className={`text-4xl mb-2 font-black italic ${getRarityText(result.rarity)}`}>
                {result.rarity}
              </div>
              <div className="text-9xl mb-4 drop-shadow-md transform transition-transform hover:scale-110 duration-300 flex justify-center items-center">
                {result.imageUrl && (result.imageUrl.startsWith('/') || result.imageUrl.startsWith('http')) ? (
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

      <div className="flex gap-4 w-full max-w-xs z-10">
        <button
          onClick={onBack}
          disabled={status !== 'idle' && status !== 'result'}
          className="flex-1 py-3 px-6 rounded-full font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-50 transition-colors shadow-md border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
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
            disabled={status !== 'idle' || loading || (!isFreeAvailable && points < cost)}
            className={`flex-1 py-3 px-6 rounded-full font-bold text-white transition-colors shadow-md border-b-4 active:border-b-0 active:translate-y-1 ${
               (status !== 'idle' || loading || (!isFreeAvailable && points < cost))
               ? 'bg-slate-400 border-slate-600 cursor-not-allowed'
               : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700 border-pink-700'
            }`}
          >
            {loading ? '......' : (status === 'idle' ? (isFreeAvailable ? '無料ガチャ' : `${cost}ptガチャ`) : '......')}
          </button>
        )}
      </div>

      <div className="mt-6 text-slate-600 font-bold text-xl bg-white/80 px-6 py-2 rounded-full shadow-sm border-2 border-slate-100">
        しょじポイント: <span className="text-2xl text-brand-yellow font-black">{points}</span> pt
      </div>
    </div>
  );
};

export default GachaScreen;
