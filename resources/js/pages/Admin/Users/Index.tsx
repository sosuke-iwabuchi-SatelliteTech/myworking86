import AdminLayout from '@/layouts/AdminLayout';
import PointEditDialog from '@/components/Admin/PointEditDialog';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginatedData } from '@/types/pagination';
import { Pagination } from '@/components/ui/pagination';
import { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';

interface User {
    id: string;
    name: string;
    email: string;
    grade: string | number;
    created_at: string;
    last_login_at: string | null;
    user_point?: { points: number };
}

interface IndexProps {
    users: PaginatedData<User>;
    filters: {
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
}

export default function Index({ users, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPointDialogOpen, setIsPointDialogOpen] = useState(false);

    // Debounce search requests
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/admin/users',
                { ...filters, search: value, page: 1 }, // Reset to page 1 on search
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300),
        [filters]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort;
        const currentDirection = filters.direction;

        let nextDirection: 'asc' | 'desc' = 'asc';

        if (currentSort === column) {
            nextDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        }

        router.get(
            '/admin/users',
            { ...filters, sort: column, direction: nextDirection },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort !== column) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        if (filters.direction === 'asc') return <ChevronUp className="ml-2 h-4 w-4" />;
        return <ChevronDown className="ml-2 h-4 w-4" />;
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Users', href: '/admin/users' },
                { title: 'List', href: '/admin/users' },
            ]}
        >
            <Head title="User List" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-[200px] lg:w-[300px]"
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto mb-4">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            <Button variant="ghost" onClick={() => handleSort('last_login_at')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                                                Last Login <SortIcon column="last_login_at" />
                                            </Button>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            <Button variant="ghost" onClick={() => handleSort('points')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                                                Points <SortIcon column="points" />
                                            </Button>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            Actions
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            <Button variant="ghost" onClick={() => handleSort('name')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                                                Name <SortIcon column="name" />
                                            </Button>
                                        </th>

                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            <Button variant="ghost" onClick={() => handleSort('grade')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                                                Grade <SortIcon column="grade" />
                                            </Button>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                No results found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : '-'}
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    {user.user_point?.points || 0}
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsPointDialogOpen(true);
                                                        }}
                                                    >
                                                        Edit Points
                                                    </Button>
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    {user.name}
                                                </td>

                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    {user.grade}
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs text-muted-foreground">
                                                    {user.id}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={users.links} />
                    </CardContent>
                </Card>
            </div>
            <PointEditDialog
                user={selectedUser}
                open={isPointDialogOpen}
                onOpenChange={setIsPointDialogOpen}
            />
        </AdminLayout>
    );
}
