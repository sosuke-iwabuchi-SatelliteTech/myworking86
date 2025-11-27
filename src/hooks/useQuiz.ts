import { useState, useEffect, useRef } from 'react';
import { Question, AnswerMode, Level } from '../types';
import { calculateScore } from '../utils/score';
import { QuestionFactory } from '../questions/QuestionFactory';

interface UseQuizProps {
    level: Level;
    answerMode: AnswerMode;
    onQuizComplete: (score: number, finalTime: number) => void;
    onBeforeNextQuestion?: () => void;
}

export const useQuiz = ({ level, answerMode, onQuizComplete, onBeforeNextQuestion }: UseQuizProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [question, setQuestion] = useState<Question>(() => QuestionFactory.create(level.id).generate(answerMode));
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

    const totalQuestions = level.numberOfQuestions;

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
            const finalScore = calculateScore(correctAnswerCount, totalQuestions);
            onQuizComplete(finalScore, elapsedTime);
        }
    }, [currentQuestionIndex, onQuizComplete, correctAnswerCount, elapsedTime, totalQuestions]);


    const handleNextQuestion = () => {
        // Call the callback to clear canvas or perform other UI actions
        if (onBeforeNextQuestion) {
            onBeforeNextQuestion();
        }

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
            setQuestion(QuestionFactory.create(level.id).generate(answerMode));
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

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
            setCorrectAnswerCount(prev => prev + 1);
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

    return {
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
        handleNextQuestion, // Expose this in case it's needed directly (e.g. for skip button if implemented later)
    };
};
