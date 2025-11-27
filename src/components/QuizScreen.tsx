import { useRef } from 'react';
import { AnswerMode } from '../types';
import { GRADES } from '../constants';
import CalculationPad from './CalculationPad';
import DrawingCanvas, { DrawingCanvasHandle } from './DrawingCanvas';
import { useQuiz } from '../hooks/useQuiz';
import QuizHeader from './quiz/QuizHeader';
import QuestionDisplay from './quiz/QuestionDisplay';
import AnswerChoices from './quiz/AnswerChoices';

/**
 * QuizScreenコンポーネントのprops
 */
interface QuizScreenProps {
    level: (typeof GRADES)[number]['levels'][number];
    answerMode: AnswerMode;
    onQuizComplete: (score: number, finalTime: number) => void;
    onGoToTop: () => void;
    showTimer: boolean;
}

export default function QuizScreen({ level, answerMode, onQuizComplete, onGoToTop, showTimer }: QuizScreenProps) {
    const drawingCanvasRef = useRef<DrawingCanvasHandle>(null);

    const {
        currentQuestionIndex,
        correctAnswerCount,
        question,
        isAnswering,
        feedback,
        selectedAnswer,
        elapsedTime,
        countdown,
        isCorrectionMode,
        totalQuestions,
        handleAnswer,
        handleNextQuestion,
    } = useQuiz({
        level,
        answerMode,
        onQuizComplete,
        onBeforeNextQuestion: () => {
            if (drawingCanvasRef.current) {
                drawingCanvasRef.current.clear();
            }
        },
    });

    const progress = ((currentQuestionIndex - 1) / totalQuestions) * 100;
    const medalCriteria = level.medalCriteria || DEFAULT_MEDAL_CRITERIA;

    if (countdown > 0) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-50">
                <div className="text-9xl font-black text-brand-blue animate-pulse mb-8">{countdown}</div>
                <div className="bg-white px-8 py-6 rounded-3xl shadow-lg border-4 border-slate-100 text-center">
                    <p className="text-xl font-bold text-slate-500 mb-4">メダルかくとくじょうけん</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 text-2xl font-bold text-brand-yellow">
                            <span className="text-4xl">🥇</span>
                            <span>{medalCriteria.goldThreshold / 1000}びょう 以内</span>
                        </div>
                        <div className="flex items-center gap-4 text-2xl font-bold text-slate-400">
                            <span className="text-4xl">🥈</span>
                            <span>{medalCriteria.silverThreshold / 1000}びょう 以内</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full items-stretch">
            {/* Quiz Section - Left */}
            <div className={`bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 pb-20 text-center border-4 border-white ring-4 ring-purple-100 relative overflow-hidden w-full lg:max-w-md lg:w-[450px] shrink-0 mx-auto ${isAnswering ? 'pointer-events-none' : ''}`}>
                <QuizHeader
                    progress={progress}
                    showTimer={showTimer}
                    elapsedTime={elapsedTime}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={totalQuestions}
                    correctAnswerCount={correctAnswerCount}
                    feedback={feedback}
                />

                <QuestionDisplay question={question} isAnswering={isAnswering} />

                {answerMode === 'choice' && (
                    <AnswerChoices
                        options={question.options}
                        selectedAnswer={selectedAnswer}
                        correctAnswer={question.correctAnswer}
                        feedback={feedback}
                        isAnswering={isAnswering}
                        onAnswer={handleAnswer}
                    />
                )}

                {answerMode === 'calculationPad' && question.num1 && question.num2 && (
                    <div className="mt-4">
                        <CalculationPad
                            key={currentQuestionIndex}
                            num1={question.num1}
                            num2={question.num2}
                            onSubmit={handleAnswer}
                            onNextQuestion={handleNextQuestion}
                            isCorrectionMode={isCorrectionMode}
                            correctAnswer={question.correctAnswer}
                        />
                    </div>
                )}

                <button onClick={onGoToTop} className="absolute bottom-3 right-3 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full p-2 transition-all" aria-label="トップにもどる">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </button>
            </div>

            {/* Drawing Canvas Section - Right (Visible only on large screens) */}
            <div className="hidden lg:block flex-1 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm p-2 border-2 border-dashed border-slate-200">
                <DrawingCanvas ref={drawingCanvasRef} />
            </div>
        </div>
    );
}
