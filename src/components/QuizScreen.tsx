import { useState, useEffect, useRef } from 'react';
import { GameLevel, Question, GeometryData, AnswerMode } from '../types';
import { formatTime } from '../utils/format';
import { QuestionFactory } from '../questions/QuestionFactory';
import CalculationPad from './CalculationPad';

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
 * 長方形、三角形、台形の図形と寸法ラベルを描画します。
 * @param {object} props - コンポーネントのprops
 * @param {GeometryData} props.geometry - 表示する図形のデータ
 */
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
        {/* Width Label */}
        <text x={cx} y={y + h + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
          {dimensions.width}cm
        </text>
        {/* Height Label */}
        <text
          x={x - 10}
          y={cy}
          textAnchor="end"
          dominantBaseline="middle"
          fill={labelColor}
          fontSize="16"
          fontWeight="bold"
        >
          {dimensions.height}cm
        </text>
      </>
    );
  } else if (shape === 'triangle') {
    const w = dimensions.width! * scale;
    const h = dimensions.height! * scale;
    const xBase = cx - w / 2;
    const yBase = cy + h / 2;
    const xPeak = cx - w / 4; // Slightly offset peak

    content = (
      <>
        <polygon
          points={`${xBase},${yBase} ${xBase + w},${yBase} ${xPeak},${yBase - h}`}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="3"
        />
        {/* Height Line */}
        <line x1={xPeak} y1={yBase} x2={xPeak} y2={yBase - h} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
        {/* Right Angle Marker at base of height */}
        <polyline
          points={`${xPeak},${yBase} ${xPeak + 10},${yBase} ${xPeak + 10},${yBase - 10} ${xPeak},${yBase - 10}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Base Label */}
        <text x={cx} y={yBase + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
          {dimensions.width}cm
        </text>
        {/* Height Label */}
        <text
          x={xPeak - 5}
          y={cy}
          textAnchor="end"
          dominantBaseline="middle"
          fill={labelColor}
          fontSize="16"
          fontWeight="bold"
        >
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
        <polygon
          points={`${xBottomStart},${yBottom} ${xBottomStart + wBottom},${yBottom} ${xTopStart + wTop},${yTop
            } ${xTopStart},${yTop}`}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Height Line */}
        <line x1={xTopStart} y1={yTop} x2={xTopStart} y2={yBottom} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
        {/* Right Angle Marker */}
        <polyline
          points={`${xTopStart},${yBottom} ${xTopStart + 10},${yBottom} ${xTopStart + 10},${yBottom - 10} ${xTopStart},${yBottom - 10
            }`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Bottom Base Label */}
        <text x={cx} y={yBottom + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
          {dimensions.width}cm
        </text>
        {/* Top Base Label */}
        <text x={cx} y={yTop - 10} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
          {dimensions.upper}cm
        </text>
        {/* Height Label */}
        <text
          x={xTopStart - 5}
          y={cy}
          textAnchor="end"
          dominantBaseline="middle"
          fill={labelColor}
          fontSize="16"
          fontWeight="bold"
        >
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

    const totalQuestions = 10;

    const multiplicationNumbers =
        answerMode === 'calculationPad' && question.num1 && question.num2
            ? { num1: question.num1, num2: question.num2 }
            : null;

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
                setQuestion(QuestionFactory.create(level).generate(answerMode));
            }
        }, nextQuestionDelay);
    };

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
        onQuizComplete(score + (isCorrect ? 10 : 0), finalTime);
      } else {
        // Next question
        setCurrentQuestionIndex((prev) => prev + 1);
        setQuestion(QuestionFactory.create(level).generate());
      }
    }, nextQuestionDelay);
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
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 pb-20 text-center border-4 border-white ring-4 ring-purple-100 relative overflow-hidden">
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

      {/* Spacer if timer is hidden to keep layout consistent, or just remove margin */}
      {!showTimer && <div className="mt-8"></div>}

      <div className="flex justify-between items-center mb-8 mt-2">
        <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-600">
          もんだい <span className="text-brand-blue text-xl">{currentQuestionIndex}</span>/10
        </div>
        <div className="bg-yellow-50 px-4 py-2 rounded-full font-bold text-yellow-600 border-2 border-yellow-100">
          スコア: <span>{score}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="relative">
          <div className="flex justify-center items-start gap-8">
            {!question.showCalculationPad && (
              <div className="flex-1">
                <div className="mb-6">
                  {question.geometry && <GeometryDisplay geometry={question.geometry} />}
                  <div
                    className={`text-6xl ${question.geometry ? 'text-xs text-slate-300' : 'text-slate-800'
                      } font-black tracking-wider min-h-[80px] flex items-center justify-center`}
                  >
                    {question.text}
                  </div>
                </div>
              </div>
            )}
            {question.showCalculationPad && multiplicationNumbers && (
              <div className="flex-1">
                <CalculationPad
                  key={currentQuestionIndex}
                  num1={multiplicationNumbers.num1}
                  num2={multiplicationNumbers.num2}
                />
              </div>
            )}
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

        <div className="grid grid-cols-2 gap-4 mt-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showCorrect = selectedAnswer !== null && !feedback.isCorrect && isCorrect;

            <div className="flex justify-between items-center mb-8 mt-2">
                <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-600">
                    もんだい <span className="text-brand-blue text-xl">{currentQuestionIndex}</span>/10
                </div>
                <div className="bg-yellow-50 px-4 py-2 rounded-full font-bold text-yellow-600 border-2 border-yellow-100">
                    スコア: <span>{score}</span>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex justify-center items-start gap-8">
                    <div className="flex-1">
                        <div className="mb-6 relative">
                            {question.geometry && <GeometryDisplay geometry={question.geometry} />}
                            <div className={`text-6xl ${question.geometry ? 'text-xs text-slate-300' : 'text-slate-800'} font-black tracking-wider min-h-[80px] flex items-center justify-center`}>
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
                )}

                {answerMode === 'calculationPad' && multiplicationNumbers && (
                    <div className="mt-4">
                        <CalculationPad
                            key={currentQuestionIndex}
                            num1={multiplicationNumbers.num1}
                            num2={multiplicationNumbers.num2}
                            onSubmit={handleAnswer}
                        />
                    </div>
                )}
            </div>

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
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      </button>
    </div>
  );
}
