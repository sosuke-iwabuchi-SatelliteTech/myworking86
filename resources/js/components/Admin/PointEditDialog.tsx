import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface PointEditDialogProps {
    user: {
        id: string;
        name: string;
        user_point?: { points: number };
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PointEditDialog({ user, open, onOpenChange }: PointEditDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        points: 0,
        action: 'add', // add, sub, set
    });

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        put(`/admin/users/${user.id}/points`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    if (!user) return null;

    const currentPoints = user.user_point?.points || 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Points</DialogTitle>
                    <DialogDescription>
                        Update points for {user.name}. Current points: {currentPoints}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="action" className="text-right">
                            Action
                        </Label>
                        <Select
                            value={data.action}
                            onValueChange={(value) => setData('action', value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="add">Add (+)</SelectItem>
                                <SelectItem value="sub">Subtract (-)</SelectItem>
                                <SelectItem value="set">Set (=)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="points" className="text-right">
                            Points
                        </Label>
                        <Input
                            id="points"
                            type="number"
                            value={data.points}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData('points', val === '' ? 0 : parseInt(val, 10));
                            }}
                            className="col-span-3"
                            min="0"
                        />
                    </div>
                    {errors.points && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="col-start-2 col-span-3 text-red-500 text-sm">{errors.points}</span>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
