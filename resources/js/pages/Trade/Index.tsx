
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

    return (
        <AppLayout breadcrumbs={[{ title: 'こうかん', href: '/trades' }]}>
            <Head title="こうかん" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">こうかんセンター</h2>
                        <Link
                            href="/trades/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            あたらしく こうかんする
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {loading ? (
                                <p>よみこみ中...</p>
                            ) : trades.length === 0 ? (
                                <p className="text-gray-500">まだ こうかんの やりとりは ありません。</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {trades.map((trade) => (
                                        <li key={trade.id} className="py-4 flex justify-between items-center hover:bg-gray-50 p-4 transition rounded">
                                            <div>
                                                <div className="font-semibold">
                                                    {trade.sender.name} ↔ {trade.receiver?.name || 'だれかと'}
                                                </div>
                                                <div className="text-sm text-gray-500 flex gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        trade.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {trade.status.toUpperCase()}
                                                    </span>
                                                    <span>{new Date(trade.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/trades/${trade.id}`}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                            >
                                                くわしくみる →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
