import { GameLevel } from '../types';

interface WelcomeScreenProps {
    onStartGame: (level: GameLevel) => void;
}

export default function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
    return (
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 text-center transform transition-all hover:scale-[1.02] duration-300 border-4 border-white ring-4 ring-blue-100">
            <div className="mb-8 relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
                    🎓
                </div>
                <h1 className="text-4xl font-extrabold text-slate-800 mt-8 mb-2 tracking-tight">
                    さんすう<br />
                    <span className="text-brand-blue">クイズ</span>
                </h1>
                <p className="text-slate-500 font-bold text-lg">レベルをえらんでね！</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => onStartGame(1)}
                    className="w-full bg-brand-yellow hover:bg-yellow-300 text-slate-800 font-black text-2xl py-4 rounded-2xl shadow-[0_6px_0_rgb(217,179,16)] active:shadow-[0_0px_0_rgb(217,179,16)] active:translate-y-[6px] transition-all"
                >
                    1ねんせい (たしざん・ひきざん)
                </button>
                <button
                    onClick={() => onStartGame(2)}
                    className="w-full bg-brand-blue hover:bg-blue-300 text-slate-800 font-black text-2xl py-4 rounded-2xl shadow-[0_6px_0_rgb(74,168,209)] active:shadow-[0_0px_0_rgb(74,168,209)] active:translate-y-[6px] transition-all"
                >
                    2ねんせい (九九)
                </button>
                <button
                    onClick={() => onStartGame(3)}
                    className="w-full bg-brand-green hover:bg-green-300 text-slate-800 font-black text-2xl py-4 rounded-2xl shadow-[0_6px_0_rgb(86,168,98)] active:shadow-[0_0px_0_rgb(86,168,98)] active:translate-y-[6px] transition-all"
                >
                    4ねんせい (図形の面積)
                </button>
            </div>
        </div>
    );
}
