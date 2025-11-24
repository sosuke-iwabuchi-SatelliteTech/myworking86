export function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

export function getMedal(score: number, time?: number): string | null {
    if (!time || score !== 100) return null;
    if (time <= 20000) return '🥇';
    if (time <= 25000) return '🥈';
    return null;
}
