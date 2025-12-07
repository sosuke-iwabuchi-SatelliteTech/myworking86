import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Dashboard', href: '/admin/dashboard' },
            ]}
        >
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>ダッシュボード</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            準備中
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
