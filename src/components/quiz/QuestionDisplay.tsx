import { Question } from '../../types';
import GeometryDisplay from './GeometryDisplay';

interface QuestionDisplayProps {
    question: Question;
    isAnswering: boolean;
}

export default function QuestionDisplay({ question, isAnswering }: QuestionDisplayProps) {
    return (
        <div className="relative">
            <div className={`mb-6 transition-opacity duration-300 ${isAnswering ? 'opacity-20' : 'opacity-100'}`}>
                {question.geometry && <GeometryDisplay geometry={question.geometry} />}
                <div className={`${question.text.length > 20 ? 'text-4xl' : 'text-6xl'} ${question.geometry ? 'text-xs text-slate-300' : 'text-slate-800'} font-black tracking-wider min-h-[80px] flex items-center justify-center`}>
                    {question.text}
                </div>
            </div>
        </div>
    );
}
