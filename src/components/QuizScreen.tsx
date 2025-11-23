import { useState, useEffect, useRef } from 'react';
import { GameLevel, Question } from '../types';

interface QuizScreenProps {
    level: GameLevel;
    onQuizComplete: (score: number, finalTime: number) => void;
    onGoToTop: () => void;
}

function generateQuestion(level: GameLevel): Question {
    let text = '';
    let correctAnswer = 0;

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
    }

    // Generate options
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        const wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrong >= 0 && wrong !== correctAnswer) {
            options.add(wrong);
        }
    }

    return {
        text,
        correctAnswer,
        options: Array.from(options).sort(() => Math.random() - 0.5),
    };
}

function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

export default function QuizScreen({ level, onQuizComplete, onGoToTop }: QuizScreenProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState<Question>(generateQuestion(level));
    const [isAnswering, setIsAnswering] = useState(false);
    const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const startTimeRef = useRef<number>(Date.now());
    const timerIntervalRef = useRef<number | null>(null);

    const totalQuestions = 10;

    // Timer effect
    useEffect(() => {
        startTimeRef.current = Date.now();
        timerIntervalRef.current = window.setInterval(() => {
            setElapsedTime(Date.now() - startTimeRef.current);
        }, 10);

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

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

            <div className="mb-10 relative">
                <div className="text-6xl font-black text-slate-800 tracking-wider">
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
                            className={`${buttonClass} font-bold text-3xl py-6 rounded-2xl shadow-sm border-2 transition-all active:scale-95`}
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
