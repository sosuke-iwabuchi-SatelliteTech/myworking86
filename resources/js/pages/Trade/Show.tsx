
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
    tradeId: string;
};

// Types (should be shared)
// ... (Reusing same types or similar)

import CelebrationModal from '@/components/ui/CelebrationModal';

export default function TradeShow({ tradeId }: Props) {
    const [trade, setTrade] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        axios.get(`/api/trades/${tradeId}`)
            .then(res => setTrade(res.data))
            .catch(err => alert('こうかんの じょうほうを よみこめませんでした'))
            .finally(() => setLoading(false));
    }, [tradeId]);

    const handleAction = async (action: 'accept' | 'reject' | 'cancel') => {
        const actionJp = { accept: 'こうかん', reject: 'ことわり', cancel: 'とりけし' }[action];
        if (!confirm(`ほんとうに ${actionJp} しますか？`)) return;

        setProcessing(true);
        try {
            await axios.put(`/api/trades/${tradeId}/${action}`);
            // Reload page data
            const res = await axios.get(`/api/trades/${tradeId}`);
            setTrade(res.data);

            if (action === 'accept') {
                setShowCelebration(true);
            } else {
                alert(`${actionJp} しました。`);
            }
        } catch (error: any) {
            alert('しっぱいしました: ' + (error.response?.data?.message || 'エラーが おきました'));
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-12 text-center">よみこみ中...</div>;
    if (!trade) return <div className="p-12 text-center">こうかんが みつかりません</div>;

    return (
        <>
            <TradeShowContent trade={trade} onAction={handleAction} processing={processing} />
            <CelebrationModal
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
            />
        </>
    );
}

function TradeShowContent({ trade, onAction, processing }: any) {
    const { auth } = (window as any).page?.props || { auth: { user: { id: '' } } }; // Hacky if not using hook
    // Better way:
    // const { auth } = usePage().props; (Using hook inside component)

    return (
        <WrappedContent trade={trade} onAction={onAction} processing={processing} />
    );
}

// Wrapper to use hooks
import { usePage } from '@inertiajs/react';

function WrappedContent({ trade, onAction, processing }: any) {
    const { auth } = usePage().props as any;
    const currentUserId = auth.user.id;
    const isSender = trade.sender_id === currentUserId;
    const isReceiver = trade.receiver_id === currentUserId;

    const offeredItems = trade.items.filter((i: any) => i.type === 'offer');
    const requestedItems = trade.items.filter((i: any) => i.type === 'request');

    const statusMap: Record<string, string> = {
        pending: 'いらいちゅう',
        accepted: 'せいりつ',
        rejected: 'ことわられた',
        cancelled: 'とりけし',
        completed: 'かんりょう'
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-blue-100 text-blue-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
        completed: 'bg-green-100 text-green-800'
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'こうかん', href: '/trades' }, { title: 'こうかんの けっか', href: '#' }]}>
            <Head title="こうかんの けっか" />

            <div className="py-12 max-w-2xl mx-auto px-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">
                                {trade.sender.name}さんとの こうかん
                            </h2>
                            <div className="text-sm text-gray-500">
                                つくったひ: {new Date(trade.created_at).toLocaleString()}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[trade.status] || 'bg-gray-100'}`}>
                            {statusMap[trade.status] || trade.status}
                        </span>
                    </div>

                    {trade.message && (
                        <div className="bg-gray-50 p-4 rounded mb-8">
                            <h3 className="font-bold text-sm text-gray-500 mb-1">メッセージ</h3>
                            <p>{trade.message}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-600">
                                {trade.sender.name}さんが 出すもの:
                            </h3>
                            <div className="space-y-4">
                                {offeredItems.map((item: any) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-green-600">
                                {trade.receiver?.name || 'だれか'}さんが 出すもの:
                            </h3>
                            <div className="space-y-4">
                                {requestedItems.length > 0 ? requestedItems.map((item: any) => (
                                    <ItemCard key={item.id} item={item} />
                                )) : (
                                    <p className="text-gray-400 italic">指定なし (プレゼント)</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {trade.status === 'pending' && (
                        <div className="flex justify-end gap-4 border-t pt-6">
                            {isSender && (
                                <ActionButton
                                    label="とりけす"
                                    onClick={() => onAction('cancel')}
                                    color="red"
                                    disabled={processing}
                                />
                            )}
                            {isReceiver && (
                                <>
                                    <ActionButton
                                        label="ことわる"
                                        onClick={() => onAction('reject')}
                                        color="red"
                                        outline
                                        disabled={processing}
                                    />
                                    <ActionButton
                                        label="こうかんする！"
                                        onClick={() => onAction('accept')}
                                        color="green"
                                        disabled={processing}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function ItemCard({ item }: any) {
    const prize = item.user_prize.prize;
    return (
        <div className="flex items-center gap-4 p-3 border rounded shadow-sm">
            {prize.image_url && (
                <img src={prize.image_url} alt={prize.name} className="w-12 h-12 object-cover rounded" />
            )}
            <div>
                <div className="font-bold">{prize.name}</div>
                <div className="text-xs text-gray-500">{prize.rarity} - {prize.type}</div>
            </div>
        </div>
    );
}

function ActionButton({ label, onClick, color, outline, disabled }: any) {
    const baseClass = "px-6 py-2 rounded font-bold transition duration-150 ease-in-out";
    const colorClasses = {
        red: outline ? "border border-red-500 text-red-500 hover:bg-red-50" : "bg-red-600 text-white hover:bg-red-700",
        green: outline ? "border border-green-500 text-green-500 hover:bg-green-50" : "bg-green-600 text-white hover:bg-green-700",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${colorClasses[color as keyof typeof colorClasses]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {label}
        </button>
    );
}
