import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Moveable from 'react-moveable';
import { SharedData } from '@/types';
import PrizeSelector, { TradePrize } from '@/components/PrizeSelector';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

interface StickerItem {
    id?: string;
    user_prize_id: string;
    position_x: number;
    position_y: number;
    scale: number;
    rotation: number;
    userPrize?: {
        prize: {
            name: string;
            imageUrl: string;
            rarity: string;
        };
    };
}

export default function StickerBookScreen() {
    const { auth } = usePage<SharedData>().props;
    const [isEditMode, setIsEditMode] = useState(false);
    const [stickers, setStickers] = useState<StickerItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [ownedPrizes, setOwnedPrizes] = useState<TradePrize[]>([]);
    const [isPrizesModalOpen, setIsPrizesModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchStickers();
        fetchOwnedPrizes();
    }, []);

    const fetchStickers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/sticker-book');
            // If it's a Resource collection, it will be in .data.data
            const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setStickers(items);
        } catch (error) {
            console.error('Failed to fetch stickers', error);
            toast.error('シール帳の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOwnedPrizes = async () => {
        try {
            const response = await axios.get('/api/user/prizes/tradable');
            setOwnedPrizes(response.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch prizes', error);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('/api/sticker-book', {
                items: stickers.map(s => ({
                    user_prize_id: s.user_prize_id,
                    position_x: s.position_x,
                    position_y: s.position_y,
                    scale: s.scale,
                    rotation: s.rotation,
                }))
            });
            toast.success('保存しました！');
            setIsEditMode(false);
            setSelectedIndex(null);
        } catch (error: any) {
            console.error('Failed to save sticker book', error);
            const message = error.response?.data?.message || '保存に失敗しました';
            toast.error(message);
        }
    };

    const addSticker = (prizeId: string) => {
        const prize = ownedPrizes.find(p => p.id === prizeId);
        if (!prize) return;

        // Check if already stuck (though tradable API should filter it, double check)
        if (stickers.some(s => s.user_prize_id === prizeId)) {
            toast.error('すでに貼られています');
            return;
        }

        const newItem: StickerItem = {
            user_prize_id: prizeId,
            position_x: 50,
            position_y: 50,
            scale: 1,
            rotation: 0,
            userPrize: {
                prize: {
                    name: prize.prize.name,
                    imageUrl: prize.prize.imageUrl,
                    rarity: prize.prize.rarity,
                }
            }
        };

        setStickers([...stickers, newItem]);
        setIsPrizesModalOpen(false);
        setSelectedIndex(stickers.length);
    };

    const removeSticker = (index: number) => {
        const newStickers = [...stickers];
        newStickers.splice(index, 1);
        setStickers(newStickers);
        setSelectedIndex(null);
    };

    const canvasWidth = 375;
    const canvasHeight = 600;

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 pb-24">
            <Head title="シール帳" />
            <Toaster position="top-center" />

            <div className="w-full max-w-md flex justify-between items-center mb-4">
                <Link href="/" className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    もどる
                </Link>
                <div className="flex gap-2">
                    {isEditMode ? (
                        <>
                            <Button variant="outline" size="sm" onClick={() => {
                                setIsEditMode(false);
                                setSelectedIndex(null);
                                fetchStickers(); // Reset
                            }}>
                                キャンセル
                            </Button>
                            <Button variant="default" size="sm" onClick={handleSave} className="bg-brand-blue hover:bg-blue-600">
                                保存する
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                            編集する
                        </Button>
                    )
                    }
                </div>
            </div>

            {/* Canvas Container */}
            <div
                ref={canvasRef}
                className="relative bg-white dark:bg-slate-800 shadow-xl overflow-hidden rounded-xl border-4 border-white dark:border-slate-700"
                style={{ width: canvasWidth, height: canvasHeight }}
                onClick={() => isEditMode && setSelectedIndex(null)}
            >
                {stickers.map((sticker, index) => (
                    <div
                        key={sticker.user_prize_id}
                        id={`sticker-${index}`}
                        className={`absolute cursor-pointer select-none transition-shadow ${isEditMode && selectedIndex === index ? 'ring-2 ring-blue-500 z-50' : ''}`}
                        style={{
                            transform: `translate(${sticker.position_x}px, ${sticker.position_y}px) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                            transformOrigin: 'center center',
                        }}
                        onClick={(e) => {
                            if (isEditMode) {
                                e.stopPropagation();
                                setSelectedIndex(index);
                            }
                        }}
                    >
                        <img
                            src={sticker.userPrize?.prize.imageUrl || '/images/default-prize.png'}
                            alt={sticker.userPrize?.prize.name}
                            className="w-20 h-20 object-contain"
                            draggable={false}
                        />
                        {isEditMode && selectedIndex === index && (
                            <button
                                className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSticker(index);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        )}
                    </div>
                ))}

                {isEditMode && selectedIndex !== null && (
                    <Moveable
                        target={document.getElementById(`sticker-${selectedIndex}`)}
                        draggable={true}
                        rotatable={true}
                        scalable={true}
                        keepRatio={true}
                        origin={false}
                        onDrag={({ beforeTranslate }) => {
                            const newStickers = [...stickers];
                            newStickers[selectedIndex].position_x = beforeTranslate[0];
                            newStickers[selectedIndex].position_y = beforeTranslate[1];
                            setStickers(newStickers);
                        }}
                        onRotate={({ beforeRotate }) => {
                            const newStickers = [...stickers];
                            newStickers[selectedIndex].rotation = beforeRotate;
                            setStickers(newStickers);
                        }}
                        onScale={({ drag }) => {
                            const newStickers = [...stickers];
                            newStickers[selectedIndex].scale = drag.beforeScale[0];
                            newStickers[selectedIndex].position_x = drag.beforeTranslate[0];
                            newStickers[selectedIndex].position_y = drag.beforeTranslate[1];
                            setStickers(newStickers);
                        }}
                    />
                )}
            </div>

            {/* Edit Controls */}
            {isEditMode && (
                <div className="mt-8 text-center">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => setIsPrizesModalOpen(true)}
                        className="rounded-full px-8 bg-brand-yellow text-slate-800 hover:bg-yellow-400 shadow-lg font-bold"
                    >
                        ➕ シールをえらぶ
                    </Button>
                </div>
            )}

            {/* Prize Selection Modal (Simple) */}
            {isPrizesModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">シールをえらぶ</h2>
                            <button onClick={() => setIsPrizesModalOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <PrizeSelector
                                prizes={ownedPrizes.filter(p => !stickers.some(s => s.user_prize_id === p.id))}
                                selectedIds={[]}
                                onToggle={(id) => addSticker(id)}
                                label="もっているけいひん"
                                emptyMessage="シールにできるけいひんがありません"
                            />
                        </div>
                    </div>
                </div>
            )}

            {!isEditMode && stickers.length === 0 && !isLoading && (
                <div className="mt-8 text-center text-slate-500 animate-pulse">
                    「編集する」ボタンをおしてシールをはってみよう！
                </div>
            )}
        </div>
    );
}
