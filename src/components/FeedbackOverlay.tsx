import CorrectIcon from './icons/CorrectIcon';
import IncorrectIcon from './icons/IncorrectIcon';

interface FeedbackOverlayProps {
  show: boolean;
  isCorrect: boolean;
}

export default function FeedbackOverlay({ show, isCorrect }: FeedbackOverlayProps) {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        pointer-events-none transition-opacity duration-300
        ${show ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className={`
          transform transition-transform duration-300 ease-out
          ${show ? 'scale-100' : 'scale-50'}
        `}
      >
        {isCorrect ? <CorrectIcon /> : <IncorrectIcon />}
      </div>
    </div>
  );
}
