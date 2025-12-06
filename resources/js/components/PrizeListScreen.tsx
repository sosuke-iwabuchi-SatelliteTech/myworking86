
import React, { useEffect, useState } from 'react';
import { GACHA_ITEMS, GachaRarity } from '../gachaData';

interface UserPrize {
    prize_id: string;
    rarity: GachaRarity;
    count: number;
}

interface PrizeWithDetails extends UserPrize {
    name: string;
    description: string;
    imageUrl?: string;
}

interface PrizeListScreenProps {
    onBack: () => void;
}

export default function PrizeListScreen({ onBack }: PrizeListScreenProps) {
    const [prizes, setPrizes] = useState<PrizeWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user/prizes')
            .then(res => res.json())
            .then((data: UserPrize[]) => {
                const detailedPrizes = data.map(prize => {
                    const itemDetails = GACHA_ITEMS.find(item => item.id === prize.prize_id);
                    return {
                        ...prize,
                        name: itemDetails?.name || 'Unknown Prize',
                        description: itemDetails?.description || '',
                        imageUrl: itemDetails?.imageUrl,
                    };
                });
                setPrizes(detailedPrizes);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch prizes:', err);
                setLoading(false);
            });
    }, []);

    const getRarityColor = (rarity: GachaRarity) => {
        switch (rarity) {
            case 'UR': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'SR': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'R': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'UC': return 'bg-green-100 text-green-800 border-green-200';
            case 'C': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">景品りすと</h2>
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-bold"
                        >
                            Back
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : prizes.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            ガチャしてみてね！
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {prizes.map((prize) => (
                                <div
                                    key={prize.prize_id}
                                    className={`border rounded-lg p-4 flex flex-col items-center ${getRarityColor(prize.rarity)} border-2`}
                                >
                                    <div className="w-24 h-24 mb-4 bg-white rounded-full flex items-center justify-center overflow-hidden border">
                                        {prize.imageUrl ? (
                                            <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl">🎁</span>
                                        )}
                                    </div>
                                    <div className="text-lg font-bold mb-1">{prize.name}</div>
                                    <div className="text-sm font-semibold mb-2 px-2 py-0.5 rounded bg-white/50">
                                        {prize.rarity}
                                    </div>
                                    <div className="text-xs text-center mb-3 opacity-80 h-10 overflow-hidden">
                                        {prize.description}
                                    </div>
                                    <div className="mt-auto text-sm font-medium bg-white/80 px-3 py-1 rounded-full">
                                        {prize.count}コ
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
