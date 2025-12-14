import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react'; // Corrected import
import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
// import { Html5QrcodeScanner } from 'html5-qrcode'; // Dynamic import better for SSR
import axios from 'axios';
import PrizeSelector from '@/components/PrizeSelector';

type Props = {
    initialTargetId?: string;
};

type UserPrize = {
    id: string;
    prize: {
        name: string;
        image_url: string;
        rarity: string;
    };
};

export default function TradeCreate({ initialTargetId }: Props) {
    const { auth } = usePage().props as any;
    const [targetId, setTargetId] = useState<string | null>(initialTargetId || null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);
    const scannerRef = useRef<any>(null);

    // Form State
    const [myPrizes, setMyPrizes] = useState<UserPrize[]>([]);
    const [targetPrizes, setTargetPrizes] = useState<UserPrize[]>([]);
    const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([]);
    const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (targetId) {
            // Load my prizes to offer
            axios.get('/api/user/prizes/tradable').then(res => {
                setMyPrizes(res.data.data || []);
            }).catch(e => {
                console.error("Failed to load my prizes", e);
                setMyPrizes([]);
            });

            // Load target user's prizes to request
            axios.get(`/api/users/${targetId}/prizes/tradable`).then(res => {
                setTargetPrizes(res.data.data || []);
            }).catch(e => {
                console.error("Failed to load target prizes", e);
                setTargetPrizes([]);
            });
        }
    }, [targetId]);

    // Initialize Scanner (Client-side only)
    useEffect(() => {
        // Only start if isScanning is true and we don't have an active scanner yet (or ensuring we start a fresh one)
        // Actually, better to rely on isScanning state trigger.

        const startScanner = async () => {
            if (isScanning && !scannerRef.current) {
                try {
                    const { Html5Qrcode } = await import('html5-qrcode');
                    // Create instance only if element exists
                    if (!document.getElementById("reader")) return;

                    const html5QrCode = new Html5Qrcode("reader");
                    scannerRef.current = html5QrCode;

                    await html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 }
                        },
                        (decodedText: string) => {
                            // Expected format: URL/trades/create?target_id=UUID
                            try {
                                const url = new URL(decodedText);
                                const id = url.searchParams.get('target_id');
                                if (id) {
                                    handleFoundId(id);
                                } else {
                                    alert('QRコードが まちがっています');
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        },
                        (errorMessage: any) => {
                            // parse error, ignore it.
                        }
                    );
                } catch (err) {
                    console.error("Error starting scanner", err);
                    setScannerError("カメラを 起動できませんでした");
                    setIsScanning(false);
                }
            }
        };

        if (isScanning) {
            startScanner();
        }

        return () => {
            // Cleanup on unmount or if isScanning changes to false from parent (though we try to handle explicitly)
            // If the component unmounts while scanning (link click etc), we must stop.
            if (scannerRef.current) {
                const scanner = scannerRef.current;
                scannerRef.current = null; // Detach ref immediately

                // If it's scanning, stop it.
                // Note: stop() is async, but we can't await in cleanup.
                // We hope the library handles detached element gracefully or we catch error.
                if (scanner.isScanning) {
                    scanner.stop()
                        .then(() => scanner.clear())
                        .catch((err: any) => console.error("Cleanup error", err));
                } else {
                    scanner.clear().catch((err: any) => console.error("Cleanup clear error", err));
                }
            }
        };
    }, [isScanning]);

    const handleFoundId = async (id: string) => {
        await stopScanner();
        setTargetId(id);
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                // Try to stop, ignore if fails (e.g. not running)
                await scannerRef.current.stop();
            } catch (e) {
                // console.error("Stop error (likely not running)", e);
            }

            try {
                await scannerRef.current.clear();
            } catch (e) {
                console.error("Clear error", e);
            }

            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/api/trades', {
                receiver_id: targetId,
                offered_user_prize_ids: selectedOfferIds,
                requested_user_prize_ids: selectedRequestIds,
                message: message
            });
            router.visit('/trades');
        } catch (error: any) {
            alert('しんぱいです: ' + (error.response?.data?.message || 'エラーが おきました'));
        } finally {
            setSubmitting(false);
        }
    };

    const toggleOffer = (id: string) => {
        setSelectedOfferIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleRequest = (id: string) => {
        setSelectedRequestIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    if (targetId) {
        // Request Form Mode
        return (
            <AppLayout breadcrumbs={[{ title: 'あたらしく こうかん', href: '/trades/create' }]}>
                <Head title="こうかんする" />
                <div className="py-12 max-w-2xl mx-auto px-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">{targetId}さんに こうかんを おねがいする</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <PrizeSelector
                                    label="あげる けいひんを えらんでね"
                                    prizes={myPrizes}
                                    selectedIds={selectedOfferIds}
                                    onToggle={toggleOffer}
                                    color="blue"
                                    emptyMessage="トレードできる けいひんが ありません"
                                />
                            </div>

                            <div className="mb-4">
                                <PrizeSelector
                                    label="あいてから もらうもの (ほしいもの)"
                                    prizes={targetPrizes}
                                    selectedIds={selectedRequestIds}
                                    onToggle={toggleRequest}
                                    color="green"
                                    emptyMessage="あいては トレードできる けいひんを もっていません"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">メッセージ</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    rows={3}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setTargetId(null)} className="px-4 py-2 text-gray-600">やめる</button>
                                <button
                                    type="submit"
                                    disabled={submitting || (selectedOfferIds.length === 0 && selectedRequestIds.length === 0)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                >
                                    {submitting ? 'おくっています...' : 'おねがいする'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // QR Mode
    const myTradeUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/trades/create?target_id=${auth.user.id}`
        : ''; // Fallback for SSR

    return (
        <AppLayout breadcrumbs={[{ title: 'こうかんQR', href: '/trades/create' }]}>
            <Head title="こうかんQR" />
            <div className="py-12 max-w-lg mx-auto px-4 text-center">
                <div className="bg-white p-8 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">あなたの QRコード</h2>
                    <div className="flex justify-center mb-4">
                        {myTradeUrl && <QRCode value={myTradeUrl} />}
                    </div>
                    <p className="text-sm text-gray-500">おともだちに スキャンしてもらってね</p>
                </div>

                {isScanning ? (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div id="reader" className="w-full"></div>
                        <button onClick={stopScanner} className="mt-4 text-red-600">カメラを とめる</button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsScanning(true)}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg shadow hover:bg-blue-700"
                    >
                        おともだちの QRを よみとる
                    </button>
                )}
            </div>
        </AppLayout>
    );
}
