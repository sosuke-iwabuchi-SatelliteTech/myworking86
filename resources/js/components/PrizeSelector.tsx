import React, { useState, useEffect } from 'react';

// Define types compatible with what Trade/Create.tsx expects and what API returns
export type TradePrize = {
    id: string;
    prize: {
        name: string;
        image_url: string;
        rarity: string;
        description?: string; // Optional as it might not always be present or needed
    };
};

type Props = {
    prizes: TradePrize[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    color?: 'blue' | 'green'; // Color theme for offer vs request
    label?: string; // Optional label for the section
    emptyMessage?: string;
};

export default function PrizeSelector({
    prizes,
    selectedIds,
    onToggle,
    color = 'blue',
    label,
    emptyMessage = "表示する景品がありません"
}: Props) {
    // Search & Filter State
    const [searchText, setSearchText] = useState('');
    const [selectedRarities, setSelectedRarities] = useState<Set<string>>(new Set());

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Compact view for trade screen

    // All available rarities from the current prize list
    const availableRarities = Array.from(new Set(prizes.map(p => p.prize.rarity))).sort();

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, selectedRarities, prizes]);

    const handleRarityChange = (rarity: string) => {
        const newRarities = new Set(selectedRarities);
        if (newRarities.has(rarity)) {
            newRarities.delete(rarity);
        } else {
            newRarities.add(rarity);
        }
        setSelectedRarities(newRarities);
    };

    // Filter Logic
    const filteredPrizes = prizes.filter(p => {
        const matchesText = searchText === '' ||
            p.prize.name.toLowerCase().includes(searchText.toLowerCase());
        // Description might not be available on this object structure depending on API, 
        // but we can add it if needed. For now name check is most important.

        const matchesRarity = selectedRarities.size === 0 ||
            selectedRarities.has(p.prize.rarity);

        return matchesText && matchesRarity;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredPrizes.length / itemsPerPage);
    const paginatedPrizes = filteredPrizes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const themeColors = {
        blue: {
            border: 'border-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
            lightBtn: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        },
        green: {
            border: 'border-green-500',
            bg: 'bg-green-50',
            text: 'text-green-600',
            button: 'bg-green-600 hover:bg-green-700',
            lightBtn: 'bg-green-100 text-green-700 hover:bg-green-200'
        }
    };

    const theme = themeColors[color];

    const getRarityColor = (rarity: string) => {
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
        <div className="border rounded-lg p-4 bg-gray-50">
            {label && <h3 className="font-bold text-lg mb-3 text-gray-700">{label}</h3>}

            {/* Search & Filter Controls */}
            <div className="mb-4 space-y-3">
                <input
                    type="text"
                    placeholder="名前で検索..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />

                {availableRarities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {availableRarities.map(r => (
                            <label key={r} className={`inline-flex items-center px-2 py-1 rounded text-xs border cursor-pointer select-none transition-colors ${selectedRarities.has(r) ? 'bg-white border-blue-400 text-blue-700 shadow-sm font-bold' : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedRarities.has(r)}
                                    onChange={() => handleRarityChange(r)}
                                />
                                {r}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid */}
            {prizes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded border border-dashed">
                    {emptyMessage}
                </div>
            ) : filteredPrizes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded border border-dashed">
                    条件に合う景品が見つかりませんでした
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                        {paginatedPrizes.map((p) => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => onToggle(p.id)}
                                    className={`relative p-2 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md flex flex-col items-center bg-white ${isSelected ? `${theme.border} ${theme.bg}` : 'border-gray-200'}`}
                                >
                                    {/* Selection Checkbox (Visual only, whole card is clickable) */}
                                    <div className={`absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center bg-white ${isSelected ? theme.border : 'border-gray-300'}`}>
                                        {isSelected && <div className={`w-3 h-3 rounded-sm ${theme.button.split(' ')[0]}`} />}
                                    </div>

                                    {/* Image */}
                                    <div className="w-16 h-16 mb-2 mt-1 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                                        {p.prize.image_url ? (
                                            <img src={p.prize.image_url} alt={p.prize.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl">🎁</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="text-center w-full">
                                        <div className="font-bold text-xs truncate w-full mb-1" title={p.prize.name}>{p.prize.name}</div>
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${getRarityColor(p.prize.rarity)}`}>
                                            {p.prize.rarity}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 text-xs">
                            <button
                                onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                                前
                            </button>
                            <span className="text-gray-600">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-2 py-1 rounded border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                                次
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
