import React, { useState } from "react";

interface CalculationPadProps {
  num1: number;
  num2: number;
}

const CalculationPad: React.FC<CalculationPadProps> = ({ num1, num2 }) => {
  const [grid, setGrid] = useState<string[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(4).fill(""))
  );
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
  };

  const handleNumpadClick = (num: string) => {
    if (activeCell) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[activeCell.row][activeCell.col] = num;
      setGrid(newGrid);

      const nextCol = activeCell.col - 1;
      if (nextCol >= 0) {
        setActiveCell({ row: activeCell.row, col: nextCol });
      } else {
        setActiveCell(null);
      }
    }
  };

  const handleClearClick = () => {
    setGrid(
      Array(3)
        .fill(null)
        .map(() => Array(4).fill(""))
    );
    setActiveCell(null);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-100 rounded-lg">
      <div className="text-3xl font-bold mb-2 text-right tabular-nums">
        <p>{num1}</p>
        <p>x {num2}</p>
        <hr className="border-black" />
      </div>
      <div className="space-y-1 mb-4">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-12 h-12 text-2xl flex items-center justify-center border-2 rounded ${
                  activeCell?.row === rowIndex && activeCell?.col === colIndex
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                } cursor-pointer`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
        <hr className="border-black" />
      </div>
      <div className="grid grid-cols-3 gap-2 w-full">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((num) => (
          <button
            key={num}
            onClick={() => handleNumpadClick(num)}
            className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleNumpadClick("0")}
          className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200"
        >
          0
        </button>
        <div />
        <button
          onClick={handleClearClick}
          className="w-full h-12 text-xl bg-red-400 text-white border rounded-lg hover:bg-red-500 col-span-3 mt-2"
        >
          クリア
        </button>
      </div>
    </div>
  );
};

export default CalculationPad;
