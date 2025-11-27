interface AnswerChoicesProps {
    options: number[];
    selectedAnswer: number | null;
    correctAnswer: number;
    feedback: { show: boolean; isCorrect: boolean };
    isAnswering: boolean;
    onAnswer: (option: number) => void;
}

export default function AnswerChoices({
    options,
    selectedAnswer,
    correctAnswer,
    feedback,
    isAnswering,
    onAnswer,
}: AnswerChoicesProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {options.map((option) => {
                const isSelected = selectedAnswer === option;
                // isCorrect check logic inside button class derivation
                const showCorrect = selectedAnswer !== null && !feedback.isCorrect && option === correctAnswer;

                let buttonClass = 'bg-slate-100 answer-btn-hover text-slate-700 border-slate-200';
                if (isSelected && feedback.isCorrect) {
                    buttonClass = 'bg-brand-green text-white border-brand-green shadow-[0_4px_0_rgb(86,168,98)]';
                } else if (isSelected && !feedback.isCorrect) {
                    buttonClass = 'bg-brand-red text-white border-brand-red shadow-[0_4px_0_rgb(255,73,73)]';
                } else if (showCorrect) {
                    buttonClass = 'bg-green-50 text-slate-700 border-slate-200 ring-4 ring-brand-green';
                }

                return (
                    <button key={option} onClick={() => onAnswer(option)} disabled={isAnswering} className={`${buttonClass} font-bold text-3xl py-2 rounded-2xl shadow-sm border-2 transition-all active:scale-95`}>
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
