
import React, { useEffect, useState } from 'react';
import { GachaRarity, GachaItem } from '../types';
import axios from 'axios';

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

    // Search & Filter State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchRarities, setSearchRarities] = useState<Set<GachaRarity>>(new Set());

    // Applied Filters (for execution)
    const [appliedSearchText, setAppliedSearchText] = useState('');
    const [appliedSearchRarities, setAppliedSearchRarities] = useState<Set<GachaRarity>>(new Set());

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userPrizesRes, masterPrizesRes] = await Promise.all([
                    axios.get<UserPrize[]>('/api/user/prizes'),
                    axios.get<{ data: GachaItem[] }>('/api/prizes') // Resource wrap
                ]);

                const userPrizes = userPrizesRes.data;
                const masterPrizes = masterPrizesRes.data.data; // API Resource wrapping

                const detailedPrizes = userPrizes.map(prize => {
                    const itemDetails = masterPrizes.find(item => item.id === prize.prize_id);
                    return {
                        ...prize,
                        name: itemDetails?.name || 'Unknown Prize',
                        description: itemDetails?.description || '',
                        imageUrl: itemDetails?.imageUrl,
                        type: itemDetails?.type,
                    };
                });
                setPrizes(detailedPrizes);
            } catch (err) {
                console.error('Failed to fetch prizes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleRarityChange = (rarity: GachaRarity) => {
        const newRarities = new Set(searchRarities);
        if (newRarities.has(rarity)) {
            newRarities.delete(rarity);
        } else {
            newRarities.add(rarity);
        }
        setSearchRarities(newRarities);
    };

    const executeSearch = () => {
        setAppliedSearchText(searchText);
        setAppliedSearchRarities(new Set(searchRarities));
        setCurrentPage(1); // Reset to first page on search
    };

    const clearSearch = () => {
        setSearchText('');
        setSearchRarities(new Set());
        setAppliedSearchText('');
        setAppliedSearchRarities(new Set());
        setCurrentPage(1);
    };

    // Filter Logic
    const filteredPrizes = prizes.filter(prize => {
        const matchesText = appliedSearchText === '' ||
            prize.name.includes(appliedSearchText) ||
            prize.description.includes(appliedSearchText);

        const matchesRarity = appliedSearchRarities.size === 0 ||
            appliedSearchRarities.has(prize.rarity);

        return matchesText && matchesRarity;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredPrizes.length / itemsPerPage);
    const paginatedPrizes = filteredPrizes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const rarities: GachaRarity[] = ['UR', 'SR', 'R', 'UC', 'C'];

    return (
        <div className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">景品りすと</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleSearch}
                                className={`px-4 py-2 rounded-lg transition-colors font-bold ${isSearchOpen ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                            >
                                {isSearchOpen ? '検索を閉じる' : '検索する'}
                            </button>
                            <button
                                onClick={onBack}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-bold"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    {/* Search Panel */}
                    {isSearchOpen && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">名前で検索</label>
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="景品の名前を入力..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">レア度で絞り込み</label>
                                <div className="flex flex-wrap gap-2">
                                    {rarities.map(r => (
                                        <label key={r} className={`inline-flex items-center px-3 py-1 rounded-full border cursor-pointer select-none transition-colors ${searchRarities.has(r) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={searchRarities.has(r)}
                                                onChange={() => handleRarityChange(r)}
                                            />
                                            {r}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={clearSearch}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    クリア
                                </button>
                                <button
                                    onClick={executeSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm"
                                >
                                    検索実行
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : filteredPrizes.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            {prizes.length === 0 ? "ガチャしてみてね！" : "条件に合う景品が見つかりませんでした。"}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {paginatedPrizes.map((prize) => (
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

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-8">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        前へ
                                    </button>
                                    <span className="text-gray-600 font-medium">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        次へ
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
