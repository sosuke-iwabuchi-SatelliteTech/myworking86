import ReactDOM from 'react-dom';
import CorrectIcon from './icons/CorrectIcon';
import IncorrectIcon from './icons/IncorrectIcon';

interface FeedbackOverlayProps {
  show: boolean;
  isCorrect: boolean;
}

export default function FeedbackOverlay({ show, isCorrect }: FeedbackOverlayProps) {
  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {isCorrect ? <CorrectIcon /> : <IncorrectIcon />}
    </div>,
    document.body
  );
}
