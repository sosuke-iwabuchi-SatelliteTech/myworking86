
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Prize {
    id: string;
    name: string;
    rarity: string;
    type: string;
    image_url?: string;
}

interface UserPrize {
    id: string;
    prize: Prize;
}

interface TradeItem {
    id: string;
    type: 'offer' | 'request';
    user_prize?: UserPrize; // Eloquent default serialization (snake_case)
    userPrize?: UserPrize;  // Just in case
}

interface TradeRequest {
    id: string;
    sender_id: string;
    receiver_id: string;
    status: string;
    message: string | null;
    created_at: string;
    sender: { name: string; id: string };
    receiver: { name: string; id: string };
    items: TradeItem[];
}

interface ShowProps {
    trade: TradeRequest;
}

export default function Show({ trade }: ShowProps) {
    const offeredItems = trade.items.filter((i) => i.type === 'offer');
    const requestedItems = trade.items.filter((i) => i.type === 'request');

    const statusMap: Record<string, string> = {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        cancelled: 'Cancelled',
        completed: 'Completed'
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-blue-100 text-blue-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
        completed: 'bg-green-100 text-green-800'
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Trades', href: '/admin/trades' },
                { title: 'Detail', href: `/admin/trades/${trade.id}` },
            ]}
        >
            <Head title={`Trade ${trade.id}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Trade Details</h1>
                    <Link href="/admin/trades">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Trade Info</CardTitle>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[trade.status] || 'bg-gray-100'}`}>
                                    {statusMap[trade.status] || trade.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                                    <dd>{trade.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                                    <dd>{new Date(trade.created_at).toLocaleString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Sender</dt>
                                    <dd>{trade.sender?.name} <span className="text-xs text-gray-400">({trade.sender_id})</span></dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Receiver</dt>
                                    <dd>{trade.receiver?.name} <span className="text-xs text-gray-400">({trade.receiver_id})</span></dd>
                                </div>
                                {trade.message && (
                                    <div className="md:col-span-2 mt-4 p-4 bg-gray-50 rounded-lg">
                                        <dt className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Message</dt>
                                        <dd className="text-sm text-gray-900">{trade.message}</dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 text-blue-600 border-b pb-2">
                                        Offered by {trade.sender.name}
                                    </h3>
                                    <div className="space-y-4">
                                        {offeredItems.map((item) => (
                                            <ItemCard key={item.id} item={item} />
                                        ))}
                                        {offeredItems.length === 0 && <p className="text-gray-400 italic">No items offered.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-4 text-green-600 border-b pb-2">
                                        Requested from {trade.receiver?.name}
                                    </h3>
                                    <div className="space-y-4">
                                        {requestedItems.map((item) => (
                                            <ItemCard key={item.id} item={item} />
                                        ))}
                                        {requestedItems.length === 0 && <p className="text-gray-400 italic">No items requested (Gift).</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

function ItemCard({ item }: { item: TradeItem }) {
    // Handle both snake_case (standard Eloquent) and camelCase (Resource/JS) if needed
    // Based on Controller implementation: TradeRequest::with(...) -> returns Eloquent model -> snake_case
    const userPrize = item.user_prize || item.userPrize;
    const prize = userPrize?.prize;

    if (!userPrize || !prize) {
        return <div className="p-3 border rounded text-red-500">Item data missing</div>;
    }

    return (
        <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-white">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                {prize.image_url ? (
                    <img src={prize.image_url} alt={prize.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-2xl">🎁</span>
                )}
            </div>
            <div>
                <div className="font-bold text-sm">{prize.name}</div>
                <div className="text-xs text-gray-500">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mr-1 
                        ${prize.rarity === 'UR' ? 'bg-purple-100 text-purple-800' :
                            prize.rarity === 'SR' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                        {prize.rarity}
                    </span>
                    {prize.type}
                </div>
            </div>
        </div>
    );
}
