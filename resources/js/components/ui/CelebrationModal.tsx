import React from 'react';

interface CelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

interface ConfettiItem {
    id: number;
    left: string;
    width: string;
    height: string;
    backgroundColor: string;
    animationDelay: string;
    animationClass: string;
}

// Generate confetti items outside the component to satisfy React purity rules.
// They are generated once at module load time.
const CONFETTI_STUBS = [...Array(30)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 10 + 5}px`,
    height: `${Math.random() * 5 + 5}px`,
    backgroundColor: ['#FFC700', '#FF0000', '#2E3192', '#41BBC7'][Math.floor(Math.random() * 4)],
    animationDelay: `${Math.random() * 1}s`,
    animationClass: ['confetti--animation-slow', 'confetti--animation-medium', 'confetti--animation-fast'][Math.floor(Math.random() * 3)]
}));

export default function CelebrationModal({
    isOpen,
    onClose,
    title = "おめでとう！",
    message = "こうかんが せいりつ しました！"
}: CelebrationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Overlay for background dimming */}
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />

            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm m-4 text-center animate-pop-in pointer-events-auto border-4 border-yellow-200">
                <style>{`
                    @keyframes pop-in {
                        0% { transform: scale(0.8); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-pop-in {
                        animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }
                    @keyframes confetti-slow {
                        0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
                        100% { transform: translate3d(25px, 105vh, 0) rotateX(360deg) rotateY(180deg); }
                    }
                    @keyframes confetti-medium {
                        0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
                        100% { transform: translate3d(100px, 105vh, 0) rotateX(100deg) rotateY(360deg); }
                    }
                    @keyframes confetti-fast {
                        0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
                        100% { transform: translate3d(-50px, 105vh, 0) rotateX(10deg) rotateY(250deg); }
                    }
                    .confetti-container {
                        perspective: 700px;
                        position: absolute;
                        overflow: hidden;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        pointer-events: none;
                        z-index: 50;
                    }
                    .confetti {
                        position: absolute;
                        z-index: 1;
                        top: -10px;
                        border-radius: 0%;
                    }
                    .confetti--animation-slow {
                        animation: confetti-slow 2.25s linear 1 forwards;
                    }
                    .confetti--animation-medium {
                        animation: confetti-medium 1.75s linear 1 forwards;
                    }
                    .confetti--animation-fast {
                        animation: confetti-fast 1.25s linear 1 forwards;
                    }
                `}</style>

                {/* Confetti Elements */}
                <div className="confetti-container fixed inset-0">
                    {CONFETTI_STUBS.map((item: ConfettiItem) => {
                        const style = {
                            left: item.left,
                            width: item.width,
                            height: item.height,
                            backgroundColor: item.backgroundColor,
                            animationDelay: item.animationDelay
                        };
                        return <div key={item.id} className={`confetti ${item.animationClass}`} style={style} />;
                    })}
                </div>

                {/* SVG Icon */}
                <div className="mx-auto w-32 h-32 mb-4 relative">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Sunburst background */}
                        <g className="origin-center animate-[spin_10s_linear_infinite] text-yellow-100">
                            {[...Array(12)].map((_, i) => (
                                <rect key={i} x="90" y="0" width="20" height="200" transform={`rotate(${i * 30} 100 100)`} fill="currentColor" />
                            ))}
                        </g>

                        {/* Jumping Star */}
                        <g className="animate-[bounce_1s_infinite]">
                            <path d="M100 20 L125 80 L190 85 L140 125 L155 190 L100 155 L45 190 L60 125 L10 85 L75 80 Z" fill="#FFC107" stroke="#FF9800" strokeWidth="5" />
                            {/* Face */}
                            <circle cx="80" cy="95" r="5" fill="#3E2723" />
                            <circle cx="120" cy="95" r="5" fill="#3E2723" />
                            <path d="M80 120 Q100 140 120 120" stroke="#3E2723" strokeWidth="3" fill="none" />
                        </g>
                    </svg>
                </div>

                <h2 className="text-2xl font-black text-orange-500 mb-2">
                    {title}
                </h2>

                <p className="text-gray-600 font-bold mb-8">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-b-md active:translate-y-1 active:shadow-none"
                >
                    OK!
                </button>
            </div>
        </div>
    );
}
