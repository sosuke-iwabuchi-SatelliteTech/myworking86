import AdminLayout from '@/layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginatedData } from '@/types/pagination';
import { Pagination } from '@/components/ui/pagination';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Sort Icon Component
const SortIcon = ({ column, sort, direction }: { column: string; sort?: string; direction?: 'asc' | 'desc' }) => {
    if (sort !== column) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    if (direction === 'asc') return <ChevronUp className="ml-2 h-4 w-4" />;
    return <ChevronDown className="ml-2 h-4 w-4" />;
};

interface Trade {
    id: string;
    sender_id: string;
    receiver_id: string;
    status: string;
    message: string | null;
    created_at: string;
    sender: { name: string };
    receiver: { name: string };
}

interface IndexProps {
    trades: PaginatedData<Trade>;
    filters: {
        sender_name?: string;
        date_from?: string;
        date_to?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
}

export default function Index({ trades, filters }: IndexProps) {
    // Search States
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [senderName, setSenderName] = useState(filters.sender_name || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearch = () => {
        router.get(
            '/admin/trades',
            {
                ...filters,
                sender_name: senderName,
                date_from: dateFrom,
                date_to: dateTo,
                page: 1
            },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const clearSearch = () => {
        setSenderName('');
        setDateFrom('');
        setDateTo('');
        router.get(
            '/admin/trades',
            { sort: filters.sort, direction: filters.direction },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort;
        const currentDirection = filters.direction;

        let nextDirection: 'asc' | 'desc' = 'asc';

        if (currentSort === column) {
            nextDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        }

        router.get(
            '/admin/trades',
            { ...filters, sort: column, direction: nextDirection },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            completed: 'bg-green-100 text-green-800',
        };
        const style = styles[status] || 'bg-gray-100 text-gray-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}>{status}</span>;
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Trades', href: '/admin/trades' },
            ]}
        >
            <Head title="Trade History" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Trade History</h1>
                    <Button onClick={toggleSearch} variant={isSearchOpen ? "secondary" : "default"}>
                        {isSearchOpen ? 'Close Search' : 'Search Filters'}
                    </Button>
                </div>

                {isSearchOpen && (
                    <Card className="bg-slate-50">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sender_name">Sender Name</Label>
                                    <Input
                                        id="sender_name"
                                        placeholder="Search by sender name..."
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_from">Date From</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_to">Date To</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={clearSearch}>Clear</Button>
                                <Button onClick={handleSearch}>Apply Filters</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Trades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto mb-4">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            <Button variant="ghost" onClick={() => handleSort('created_at')} className="-ml-4 h-8">
                                                Date <SortIcon column="created_at" sort={filters.sort} direction={filters.direction} />
                                            </Button>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            ID
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Sender
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Receiver
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            <Button variant="ghost" onClick={() => handleSort('status')} className="-ml-4 h-8">
                                                Status <SortIcon column="status" sort={filters.sort} direction={filters.direction} />
                                            </Button>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {trades.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No trades found.
                                            </td>
                                        </tr>
                                    ) : (
                                        trades.data.map((trade) => (
                                            <tr key={trade.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle">
                                                    {new Date(trade.created_at).toLocaleString()}
                                                </td>
                                                <td className="p-4 align-middle font-mono text-xs">
                                                    {trade.id.substring(0, 8)}...
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {trade.sender?.name || 'Unknown'}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {trade.receiver?.name || 'Unknown'}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {getStatusBadge(trade.status)}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.visit(`/admin/trades/${trade.id}`)}
                                                    >
                                                        Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={trades.links} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
