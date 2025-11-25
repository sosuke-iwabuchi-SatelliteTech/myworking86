import { AnswerMode } from "../types";

interface SelectAnswerModeScreenProps {
  onSelect: (mode: AnswerMode) => void;
  onBack: () => void;
}

const SelectAnswerModeScreen = ({
  onSelect,
  onBack,
}: SelectAnswerModeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-8">回答方法を選択</h1>
      <div className="space-y-4">
        <button
          onClick={() => onSelect("choice")}
          className="w-64 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-2xl"
        >
          4択で回答
        </button>
        <button
          onClick={() => onSelect("calculationPad")}
          className="w-64 bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-2xl"
        >
          筆算で回答
        </button>
      </div>
      <button onClick={onBack} className="mt-8 text-slate-500">
        戻る
      </button>
    </div>
  );
};

export default SelectAnswerModeScreen;
