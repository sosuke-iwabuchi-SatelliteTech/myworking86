import { useState, useEffect, useRef } from 'react';
import { GameLevel, Question, GeometryData } from '../types';
import { formatTime } from '../utils/format';

interface QuizScreenProps {
    level: GameLevel;
    onQuizComplete: (score: number, finalTime: number) => void;
    onGoToTop: () => void;
}

export function generateQuestion(level: GameLevel): Question {
    let text = '';
    let correctAnswer = 0;
    let geometry: GeometryData | undefined;

    if (level === 1) {
        const isAddition = Math.random() > 0.5;

        if (isAddition) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 + num2;
            text = `${num1} + ${num2} = ?`;
        } else {
            const num1 = Math.floor(Math.random() * 15) + 5;
            const num2 = Math.floor(Math.random() * num1);
            correctAnswer = num1 - num2;
            text = `${num1} - ${num2} = ?`;
        }
    } else if (level === 2) {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        correctAnswer = num1 * num2;
        text = `${num1} × ${num2} = ?`;
    } else if (level === 3) {
        const shapeType = Math.random();

        if (shapeType < 0.33) {
             // Rectangle
             const w = Math.floor(Math.random() * 8) + 2;
             const h = Math.floor(Math.random() * 8) + 2;
             correctAnswer = w * h;
             text = "たて × よこ";
             geometry = { shape: 'rectangle', dimensions: { width: w, height: h } };
        } else if (shapeType < 0.66) {
             // Triangle
             let w = Math.floor(Math.random() * 8) + 2;
             let h = Math.floor(Math.random() * 8) + 2;
             if ((w * h) % 2 !== 0) {
                 w += 1;
             }
             correctAnswer = (w * h) / 2;
             text = "ていへん × たかさ ÷ 2";
             geometry = { shape: 'triangle', dimensions: { width: w, height: h } };
        } else {
             // Trapezoid
             let upper = Math.floor(Math.random() * 6) + 2;
             let lower = upper + Math.floor(Math.random() * 5) + 2;
             let h = Math.floor(Math.random() * 6) + 2;

             // Ensure area is integer: (upper + lower) * h must be even
             if (((upper + lower) * h) % 2 !== 0) {
                 h++; // h was odd, now even. product is even.
             }

             correctAnswer = ((upper + lower) * h) / 2;
             text = "（じょうてい ＋ かてい）× たかさ ÷ 2";
             geometry = { shape: 'trapezoid', dimensions: { width: lower, height: h, upper: upper } };
        }
    }

    // Generate options
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        let wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
        // Make sure wrong answer is not negative
        if (wrong < 0) wrong = Math.abs(wrong) + 1;

        if (wrong !== correctAnswer) {
            options.add(wrong);
        }
    }

    return {
        text,
        correctAnswer,
        options: Array.from(options).sort(() => Math.random() - 0.5),
        geometry
    };
}

function GeometryDisplay({ geometry }: { geometry: GeometryData }) {
    const { shape, dimensions } = geometry;
    const viewBoxWidth = 300;
    const viewBoxHeight = 220;

    // Determine logical dimensions based on shape
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

    // Define padding to accommodate labels
    // Left: for height label (e.g. "8cm")
    // Right: small padding
    // Top: for upper base label (trapezoid)
    // Bottom: for width label
    const paddingLeft = 60;
    const paddingRight = 30;
    const paddingTop = 40;
    const paddingBottom = 40;

    const availableWidth = viewBoxWidth - (paddingLeft + paddingRight);
    const availableHeight = viewBoxHeight - (paddingTop + paddingBottom);

    // Calculate scale to maximize fit within available area
    const scaleX = availableWidth / logicWidth;
    const scaleY = availableHeight / logicHeight;
    const scale = Math.min(scaleX, scaleY);

    // Center logic based on available area (plus offset for padding)
    const cx = paddingLeft + availableWidth / 2;
    const cy = paddingTop + availableHeight / 2;

    const strokeColor = "#334155"; // slate-700
    const fillColor = "#e0f2fe"; // sky-100
    const labelColor = "#1e293b"; // slate-800

    let content;

    if (shape === 'rectangle') {
        const w = dimensions.width! * scale;
        const h = dimensions.height! * scale;
        const x = cx - w / 2;
        const y = cy - h / 2;

        content = (
            <>
                <rect x={x} y={y} width={w} height={h} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                {/* Width Label */}
                <text x={cx} y={y + h + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.width}cm</text>
                {/* Height Label */}
                <text x={x - 10} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.height}cm</text>
            </>
        );
    } else if (shape === 'triangle') {
        const w = dimensions.width! * scale;
        const h = dimensions.height! * scale;
        const xBase = cx - w / 2;
        const yBase = cy + h / 2;
        const xPeak = cx - w/4; // Slightly offset peak

        content = (
            <>
                <polygon points={`${xBase},${yBase} ${xBase + w},${yBase} ${xPeak},${yBase - h}`} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                {/* Height Line */}
                <line x1={xPeak} y1={yBase} x2={xPeak} y2={yBase - h} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
                {/* Right Angle Marker at base of height */}
                <polyline points={`${xPeak},${yBase} ${xPeak + 10},${yBase} ${xPeak + 10},${yBase - 10} ${xPeak},${yBase - 10}`} fill="none" stroke={strokeColor} strokeWidth="1" />

                {/* Base Label */}
                <text x={cx} y={yBase + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.width}cm</text>
                {/* Height Label */}
                <text x={xPeak - 5} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.height}cm</text>
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

                {/* Height Line */}
                <line x1={xTopStart} y1={yTop} x2={xTopStart} y2={yBottom} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
                {/* Right Angle Marker */}
                <polyline points={`${xTopStart},${yBottom} ${xTopStart + 10},${yBottom} ${xTopStart + 10},${yBottom - 10} ${xTopStart},${yBottom - 10}`} fill="none" stroke={strokeColor} strokeWidth="1" />

                {/* Bottom Base Label */}
                <text x={cx} y={yBottom + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.width}cm</text>
                {/* Top Base Label */}
                <text x={cx} y={yTop - 10} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.upper}cm</text>
                {/* Height Label */}
                <text x={xTopStart - 5} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">{dimensions.height}cm</text>
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

export default function QuizScreen({ level, onQuizComplete, onGoToTop }: QuizScreenProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState<Question>(generateQuestion(level));
    const [isAnswering, setIsAnswering] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const startTimeRef = useRef<number>(Date.now());
    const timerIntervalRef = useRef<number | null>(null);

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

    const handleAnswer = (selected: number) => {
        if (isAnswering) return;
        setIsAnswering(true);
        setSelectedAnswer(selected);

        const isCorrect = selected === question.correctAnswer;
        setFeedback({ show: true, isCorrect });

        if (isCorrect) {
            setScore(prev => prev + 10);
        }

        const nextQuestionDelay = isCorrect ? 500 : 1500;

        setTimeout(() => {
            setFeedback({ show: false, isCorrect: false });
            setSelectedAnswer(null);
            setIsAnswering(false);

            if (currentQuestionIndex >= totalQuestions) {
                // Quiz complete
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                }
                const finalTime = Date.now() - startTimeRef.current;
                onQuizComplete(isCorrect ? score + 10 : score, finalTime);
            } else {
                // Next question
                setCurrentQuestionIndex(prev => prev + 1);
                setQuestion(generateQuestion(level));
            }
        }, nextQuestionDelay);
    };

    const progress = ((currentQuestionIndex - 1) / totalQuestions) * 100;

    if (countdown > 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50">
                <div className="text-9xl font-black text-brand-blue animate-pulse">
                    {countdown}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 pb-20 text-center border-4 border-white ring-4 ring-purple-100 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
                <div
                    className="h-full bg-brand-green transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Timer Display */}
            <div className="mt-4 mb-2 flex justify-center">
                <div className="bg-slate-800 text-brand-yellow px-6 py-2 rounded-xl font-mono text-3xl font-bold tracking-wider shadow-sm border-2 border-slate-700">
                    {formatTime(elapsedTime)}
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 mt-2">
                <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-600">
                    もんだい <span className="text-brand-blue text-xl">{currentQuestionIndex}</span>/10
                </div>
                <div className="bg-yellow-50 px-4 py-2 rounded-full font-bold text-yellow-600 border-2 border-yellow-100">
                    スコア: <span>{score}</span>
                </div>
            </div>

            <div className="mb-6 relative">
                {question.geometry && <GeometryDisplay geometry={question.geometry} />}
                <div className={`${question.geometry ? 'text-xs text-slate-300' : 'text-6xl text-slate-800'} font-black tracking-wider`}>
                    {question.text}
                </div>

                {/* Feedback Overlay */}
                <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${feedback.show ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <span
                        className={`text-8xl filter drop-shadow-lg transform transition-transform duration-300 ${feedback.show ? 'scale-100' : 'scale-0'
                            } ${feedback.isCorrect ? 'text-brand-green' : 'text-brand-red'}`}
                    >
                        {feedback.isCorrect ? '⭕' : '❌'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {question.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === question.correctAnswer;
                    const showCorrect = selectedAnswer !== null && !feedback.isCorrect && isCorrect;

                    let buttonClass = 'bg-slate-100 hover:bg-blue-100 text-slate-700 border-slate-200';

                    if (isSelected && feedback.isCorrect) {
                        buttonClass = 'bg-brand-green text-white border-brand-green shadow-[0_4px_0_rgb(86,168,98)]';
                    } else if (isSelected && !feedback.isCorrect) {
                        buttonClass = 'bg-brand-red text-white border-brand-red shadow-[0_4px_0_rgb(255,73,73)]';
                    } else if (showCorrect) {
                        buttonClass = 'bg-green-50 text-slate-700 border-slate-200 ring-4 ring-brand-green';
                    }

                    return (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            disabled={isAnswering}
                            className={`${buttonClass} font-bold text-3xl py-2 rounded-2xl shadow-sm border-2 transition-all active:scale-95`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onGoToTop}
                className="absolute bottom-3 right-3 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full p-2 transition-all"
                aria-label="トップにもどる"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                    />
                </svg>
            </button>
        </div>
    );
}
