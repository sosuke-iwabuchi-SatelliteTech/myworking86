import { HistoryRecord } from '../types';

interface HistoryScreenProps {
    history: HistoryRecord[];
    onBack: () => void;
}

function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export default function HistoryScreen({ history, onBack }: HistoryScreenProps) {
    return (
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 text-center border-4 border-white ring-4 ring-brand-blue relative max-w-lg w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">これまでのせいせき</h2>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 border-2 border-slate-100 max-h-[60vh] overflow-y-auto">
                {history.length === 0 ? (
                    <p className="text-slate-400 font-bold py-8">まだデータがありません</p>
                ) : (
                    <div className="space-y-3">
                        {history.map((record, index) => (
                            <div key={index} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                                <div className="text-left">
                                    <div className="text-xs font-bold text-slate-400 mb-1">
                                        {formatDate(record.timestamp)}
                                    </div>
                                    <div className="font-bold text-slate-600 text-sm">
                                        {record.level === 1 ? '1ねんせい' : '2ねんせい'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-brand-orange">{record.score}</span>
                                    <span className="text-xs font-bold text-slate-400 ml-1">点</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={onBack}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_rgb(170,178,189)] active:shadow-[0_0px_0_rgb(170,178,189)] active:translate-y-[6px] transition-all"
            >
                もどる
            </button>
        </div>
    );
}
