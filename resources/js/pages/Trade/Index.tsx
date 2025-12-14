
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Types (Ideally these should be in a separate types file)
type User = {
    id: string;
    name: string;
    email: string;
};

type Prize = {
    id: string;
    name: string;
    rarity: string;
    image_url: string;
};

type UserPrize = {
    id: string;
    prize: Prize;
};

type TradeRequestItem = {
    id: string;
    user_prize: UserPrize;
    type: 'offer' | 'request';
};

type TradeRequest = {
    id: string;
    sender: User;
    receiver: User;
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
    created_at: string;
    items: TradeRequestItem[];
};

export default function TradeIndex() {
    const [trades, setTrades] = useState<TradeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const response = await axios.get('/api/trades');
            setTrades(response.data.data); // Assuming paginated response
        } catch (error) {
            console.error('Failed to fetch trades', error);
        } finally {
            setLoading(false);
        }
    };

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
        <AppLayout breadcrumbs={[{ title: 'こうかん', href: '/trades' }]}>
            <Head title="こうかん" />

            <div className="py-6 sm:py-12 pb-24">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
                        <h2 className="text-xl sm:text-2xl font-bold">こうかんセンター</h2>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            {loading ? (
                                <p>よみこみ中...</p>
                            ) : trades.length === 0 ? (
                                <p className="text-gray-500">まだ こうかんの やりとりは ありません。</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {trades.map((trade) => (
                                        <li key={trade.id} className="py-4 flex justify-between items-center hover:bg-gray-50 p-2 sm:p-4 transition rounded">
                                            <div>
                                                <div className="font-semibold text-sm sm:text-base">
                                                    {trade.sender.name} ↔ {trade.receiver?.name || 'だれかと'}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-500 flex gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[trade.status] || 'bg-gray-100'}`}>
                                                        {statusMap[trade.status] || trade.status}
                                                    </span>
                                                    <span>{new Date(trade.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/trades/${trade.id}`}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium whitespace-nowrap ml-2"
                                            >
                                                みる →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Link
                href="/trades/create"
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl font-bold z-50 transition-transform active:scale-95"
            >
                ＋
            </Link>
        </AppLayout>
    );
}
