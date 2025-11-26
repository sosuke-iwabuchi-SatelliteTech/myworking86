import { useState, useEffect, useRef } from 'react';
import { GameLevel, Question, GeometryData, AnswerMode } from '../types';
import { formatTime } from '../utils/format';
import { QuestionFactory } from '../questions/QuestionFactory';
import CalculationPad from './CalculationPad';
import FeedbackOverlay from './FeedbackOverlay';

/**
 * QuizScreenコンポーネントのprops
 */
interface QuizScreenProps {
    level: GameLevel;
    answerMode: AnswerMode;
    onQuizComplete: (score: number, finalTime: number) => void;
    onGoToTop: () => void;
    showTimer: boolean;
}

/**
 * 図形問題のSVG画像を表示するコンポーネント。
 */
function GeometryDisplay({ geometry }: { geometry: GeometryData }) {
    const { shape, dimensions } = geometry;
    const viewBoxWidth = 300;
    const viewBoxHeight = 220;

    let logicWidth = 0;
    let logicHeight = 0;

    if (shape === 'rectangle') {
        logicWidth = dimensions.width!;
        logicHeight = dimensions.height!;
    } else if (shape === 'triangle') {
        logicWidth = dimensions.width!;
        logicHeight = dimensions.height!;
    } else if (shape === 'trapezoid') {
        logicWidth = Math.max(dimensions.width!, dimensions.upper || 0);
        logicHeight = dimensions.height!;
    }

    const paddingLeft = 60;
    const paddingRight = 30;
    const paddingTop = 40;
    const paddingBottom = 40;

    const availableWidth = viewBoxWidth - (paddingLeft + paddingRight);
    const availableHeight = viewBoxHeight - (paddingTop + paddingBottom);

    const scaleX = availableWidth / logicWidth;
    const scaleY = availableHeight / logicHeight;
    const scale = Math.min(scaleX, scaleY);

    const cx = paddingLeft + availableWidth / 2;
    const cy = paddingTop + availableHeight / 2;

    const strokeColor = '#334155'; // slate-700
    const fillColor = '#e0f2fe'; // sky-100
    const labelColor = '#1e293b'; // slate-800

    let content;

    if (shape === 'rectangle') {
        const w = dimensions.width! * scale;
        const h = dimensions.height! * scale;
        const x = cx - w / 2;
        const y = cy - h / 2;

        content = (
            <>
                <rect x={x} y={y} width={w} height={h} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                <text x={cx} y={y + h + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.width}cm
                </text>
                <text x={x - 10} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.height}cm
                </text>
            </>
        );
    } else if (shape === 'triangle') {
        const w = dimensions.width! * scale;
        const h = dimensions.height! * scale;
        const xBase = cx - w / 2;
        const yBase = cy + h / 2;
        const xPeak = cx - w / 4;

        content = (
            <>
                <polygon points={`${xBase},${yBase} ${xBase + w},${yBase} ${xPeak},${yBase - h}`} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                <line x1={xPeak} y1={yBase} x2={xPeak} y2={yBase - h} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
                <polyline points={`${xPeak},${yBase} ${xPeak + 10},${yBase} ${xPeak + 10},${yBase - 10} ${xPeak},${yBase - 10}`} fill="none" stroke={strokeColor} strokeWidth="1" />
                <text x={cx} y={yBase + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.width}cm
                </text>
                <text x={xPeak - 5} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.height}cm
                </text>
            </>
        );
    } else if (shape === 'trapezoid') {
        const wBottom = dimensions.width! * scale;
        const wTop = dimensions.upper! * scale;
        const h = dimensions.height! * scale;
        const xBottomStart = cx - wBottom / 2;
        const yBottom = cy + h / 2;
        const xTopStart = cx - wTop / 2;
        const yTop = cy - h / 2;

        content = (
            <>
                <polygon points={`${xBottomStart},${yBottom} ${xBottomStart + wBottom},${yBottom} ${xTopStart + wTop},${yTop} ${xTopStart},${yTop}`} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                <line x1={xTopStart} y1={yTop} x2={xTopStart} y2={yBottom} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
                <polyline points={`${xTopStart},${yBottom} ${xTopStart + 10},${yBottom} ${xTopStart + 10},${yBottom - 10} ${xTopStart},${yBottom - 10}`} fill="none" stroke={strokeColor} strokeWidth="1" />
                <text x={cx} y={yBottom + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.width}cm
                </text>
                <text x={cx} y={yTop - 10} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.upper}cm
                </text>
                <text x={xTopStart - 5} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.height}cm
                </text>
            </>
        );
    }

    return (
        <div className="flex justify-center mb-2">
            <svg width={viewBoxWidth} height={viewBoxHeight} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="bg-white rounded-xl">
                {content}
            </svg>
        </div>
    );
}

export default function QuizScreen({ level, answerMode, onQuizComplete, onGoToTop, showTimer }: QuizScreenProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState<Question>(() => QuestionFactory.create(level).generate(answerMode));
    const [isAnswering, setIsAnswering] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const startTimeRef = useRef<number>(Date.now());
    const timerIntervalRef = useRef<number | null>(null);
    const pauseTimeRef = useRef<number | null>(null);
    const quizEndedRef = useRef(false);

    // Add state for correction mode
    const [isCorrectionMode, setIsCorrectionMode] = useState(false);

    const totalQuestions = 10;

    // Countdown effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Timer effect
    useEffect(() => {
        if (countdown > 0) return;

        startTimeRef.current = Date.now();
        timerIntervalRef.current = window.setInterval(() => {
            setElapsedTime(Date.now() - startTimeRef.current);
        }, 10);

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [countdown]);

    // Quiz completion effect
    useEffect(() => {
        if (currentQuestionIndex > totalQuestions && !quizEndedRef.current) {
            quizEndedRef.current = true; // prevent multiple calls
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            onQuizComplete(score, elapsedTime);
        }
    }, [currentQuestionIndex, onQuizComplete, score, elapsedTime]);


    const handleAnswer = (selected: number) => {
        if (isAnswering) return;

        // 回答した瞬間にタイマーを停止
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            pauseTimeRef.current = Date.now();
        }

        setIsAnswering(true);
        setSelectedAnswer(selected);

        const isCorrect = selected === question.correctAnswer;
        setFeedback({ show: true, isCorrect });

        if (isCorrect) {
            setScore(prev => prev + 10);
            const nextQuestionDelay = 500;
            setTimeout(handleNextQuestion, nextQuestionDelay);
        } else {
            // Incorrect answer
            if (answerMode === 'calculationPad') {
                // After 500ms, hide feedback, enter correction mode, and re-enable answers
                setTimeout(() => {
                    setFeedback({ show: false, isCorrect: false });
                    setIsCorrectionMode(true);
                    setIsAnswering(false);
                }, 500);
            } else {
                const nextQuestionDelay = 1500;
                setTimeout(handleNextQuestion, nextQuestionDelay);
            }
        }
    };

    const handleNextQuestion = () => {
        // Restart timer if coming from correction mode
        if (pauseTimeRef.current) {
            const pausedDuration = Date.now() - pauseTimeRef.current;
            startTimeRef.current += pausedDuration;
            pauseTimeRef.current = null;

            timerIntervalRef.current = window.setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        }

        setFeedback({ show: false, isCorrect: false });
        setSelectedAnswer(null);
        setIsAnswering(false);
        setIsCorrectionMode(false);

        if (currentQuestionIndex < totalQuestions) {
            setQuestion(QuestionFactory.create(level).generate(answerMode));
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const progress = ((currentQuestionIndex - 1) / totalQuestions) * 100;

    if (countdown > 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50">
                <div className="text-9xl font-black text-brand-blue animate-pulse">{countdown}</div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 pb-20 text-center border-4 border-white ring-4 ring-purple-100 relative overflow-hidden ${isAnswering ? 'pointer-events-none' : ''}`}>
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
                    もんだい <span className="text-brand-blue text-xl">{currentQuestionIndex}</span>/10
                </div>
                <div className="bg-yellow-50 px-4 py-2 rounded-full font-bold text-yellow-600 border-2 border-yellow-100">
                    スコア: <span>{score}</span>
                </div>
            </div>

            <div className="relative">
                <div className={`mb-6 transition-opacity duration-300 ${isAnswering ? 'opacity-20' : 'opacity-100'}`}>
                    {question.geometry && <GeometryDisplay geometry={question.geometry} />}
                    <div className={`text-6xl ${question.geometry ? 'text-xs text-slate-300' : 'text-slate-800'} font-black tracking-wider min-h-[80px] flex items-center justify-center`}>
                        {question.text}
                    </div>
                </div>
            </div>

            {answerMode === 'choice' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {question.options.map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === question.correctAnswer;
                        const showCorrect = selectedAnswer !== null && !feedback.isCorrect && isCorrect;

                        let buttonClass = 'bg-slate-100 answer-btn-hover text-slate-700 border-slate-200';
                        if (isSelected && feedback.isCorrect) {
                            buttonClass = 'bg-brand-green text-white border-brand-green shadow-[0_4px_0_rgb(86,168,98)]';
                        } else if (isSelected && !feedback.isCorrect) {
                            buttonClass = 'bg-brand-red text-white border-brand-red shadow-[0_4px_0_rgb(255,73,73)]';
                        } else if (showCorrect) {
                            buttonClass = 'bg-green-50 text-slate-700 border-slate-200 ring-4 ring-brand-green';
                        }

                        return (
                            <button key={option} onClick={() => handleAnswer(option)} disabled={isAnswering} className={`${buttonClass} font-bold text-3xl py-2 rounded-2xl shadow-sm border-2 transition-all active:scale-95`}>
                                {option}
                            </button>
                        );
                    })}
                </div>
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
    );
}
