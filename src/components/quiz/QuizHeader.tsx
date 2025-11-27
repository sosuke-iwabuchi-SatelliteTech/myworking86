import { formatTime } from '../../utils/format';
import { calculateScore } from '../../utils/score';
import FeedbackOverlay from '../FeedbackOverlay';

interface QuizHeaderProps {
    progress: number;
    showTimer: boolean;
    elapsedTime: number;
    currentQuestionIndex: number;
    totalQuestions: number;
    correctAnswerCount: number;
    feedback: { show: boolean; isCorrect: boolean };
}

export default function QuizHeader({
    progress,
    showTimer,
    elapsedTime,
    currentQuestionIndex,
    totalQuestions,
    correctAnswerCount,
    feedback,
}: QuizHeaderProps) {
    return (
        <>
            <FeedbackOverlay show={feedback.show} isCorrect={feedback.isCorrect} />
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
                <div className="h-full bg-brand-green transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {/* Timer Display */}
            {showTimer && (
                <div className="mt-4 mb-2 flex justify-center">
                    <div className="bg-slate-800 text-brand-yellow px-6 py-2 rounded-xl font-mono text-3xl font-bold tracking-wider shadow-sm border-2 border-slate-700">
                        {formatTime(elapsedTime)}
                    </div>
                </div>
            )}
            {!showTimer && <div className="mt-8"></div>}

            <div className="flex justify-between items-center mb-8 mt-2">
                <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-600">
                    もんだい <span className="text-brand-blue text-xl">{currentQuestionIndex}</span>/{totalQuestions}
                </div>
                <div className="bg-yellow-50 px-4 py-2 rounded-full font-bold text-yellow-600 border-2 border-yellow-100">
                    スコア: <span>{calculateScore(correctAnswerCount, totalQuestions)}</span>
                </div>
            </div>
        </>
    );
}
