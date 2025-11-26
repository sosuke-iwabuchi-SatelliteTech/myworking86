import { AnswerMode } from "../types";

interface AnswerModeModalProps {
  isOpen: boolean;
  onSelect: (mode: AnswerMode) => void;
  onClose: () => void;
}

const AnswerModeModal = ({
  isOpen,
  onSelect,
  onClose,
}: AnswerModeModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border-4 border-white ring-4 ring-blue-100 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <h1 className="text-2xl font-black text-slate-800 text-center mb-8">
          どうやってこたえる？
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => onSelect("choice")}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-colors"
          >
            こたえをえらぶ
          </button>
          <button
            onClick={() => onSelect("calculationPad")}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-colors"
          >
            じぶんでやる
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModeModal;
