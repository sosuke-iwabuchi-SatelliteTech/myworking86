interface CorrectIconProps {
    className?: string;
}

export default function CorrectIcon({ className }: CorrectIconProps) {
    return (
        <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="correct-icon"
            className={className}
        >
            <circle cx="60" cy="60" r="50" stroke="#F87171" strokeWidth="10" />
        </svg>
    );
}
