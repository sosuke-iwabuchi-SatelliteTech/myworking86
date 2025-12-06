
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PrizeListScreen from '@/components/PrizeListScreen';

export default function PrizeList() {
    const handleBack = () => {
        router.visit('/');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Prize List', href: '/prizes' }]}>
            <Head title="Prize List" />
            <div className="py-12">
                <PrizeListScreen onBack={handleBack} />
            </div>
        </AppLayout>
    );
}
