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
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 3 });

  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
  };

  const advanceCursor = () => {
    if (activeCell) {
      const nextCol = activeCell.col - 1;
      if (nextCol >= 0) {
        setActiveCell({ row: activeCell.row, col: nextCol });
      } else if (activeCell.row < 2) {
        setActiveCell({ row: activeCell.row + 1, col: 3 });
      } else {
        setActiveCell(null);
      }
    }
  };

  const handleNumpadClick = (num: string) => {
    if (activeCell) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[activeCell.row][activeCell.col] = num;
      setGrid(newGrid);
      advanceCursor();
    }
  };

  const handleBackspaceClick = () => {
    // Define the order of cells as they are filled (top-to-bottom, right-to-left)
    const cellOrder: { row: number; col: number }[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 3; c >= 0; c--) {
        cellOrder.push({ row: r, col: c });
      }
    }

    // Find the last cell that was filled by searching backwards through the fill order
    let lastFilledCell: { row: number; col: number } | null = null;
    for (let i = cellOrder.length - 1; i >= 0; i--) {
      const { row, col } = cellOrder[i];
      if (grid[row][col] !== "") {
        lastFilledCell = { row, col };
        break;
      }
    }

    if (lastFilledCell) {
      // Clear the found cell and move the active cursor to it
      const { row, col } = lastFilledCell;
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = "";
      setGrid(newGrid);
      setActiveCell({ row, col });
    }
  };

  const handleNextClick = () => {
    advanceCursor();
  };

  const num1Digits = num1.toString().padStart(4, " ").split("");
  const num2Digits = num2.toString().padStart(4, " ").split("");

  return (
    <div className="w-full max-w-xs mr-auto p-4 bg-slate-100 rounded-lg">
      <div className="tabular-nums">
        <div className="flex space-x-1 mb-1 justify-center">
          <div className="w-12 h-12 text-2xl flex items-center justify-center"></div>
          <div className="w-12 h-12 text-2xl flex items-center justify-center"></div>
          <div className="w-12 h-12 text-2xl flex items-center justify-center">{num1Digits[2]}</div>
          <div className="w-12 h-12 text-2xl flex items-center justify-center">{num1Digits[3]}</div>
        </div>
        <div className="flex space-x-1 justify-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className="w-12 h-12 text-2xl flex items-center justify-center"></div>
          <div className="w-12 h-12 text-2xl flex items-center justify-center">{num2Digits[2]}</div>
          <div className="w-12 h-12 text-2xl flex items-center justify-center">{num2Digits[3]}</div>
        </div>
        <div className="flex justify-center">
          <hr className="border-black my-1 w-[13rem]" />
        </div>
        <div className="space-y-1 mt-1">
          {grid.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="flex space-x-1 justify-center">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`w-12 h-12 text-2xl flex items-center justify-center border-2 rounded ${activeCell?.row === rowIndex && activeCell?.col === colIndex
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300"
                      } cursor-pointer`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
              {rowIndex === 1 && (
                <div className="flex justify-center">
                  <hr className="border-black my-1 w-[13rem]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full mt-4">
        {/* Row 1 */}
        <button onClick={() => handleNumpadClick('7')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">7</button>
        <button onClick={() => handleNumpadClick('8')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">8</button>
        <button onClick={() => handleNumpadClick('9')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">9</button>

        {/* Row 2 */}
        <button onClick={() => handleNumpadClick('4')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">4</button>
        <button onClick={() => handleNumpadClick('5')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">5</button>
        <button onClick={() => handleNumpadClick('6')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">6</button>

        {/* Row 3 */}
        <button onClick={() => handleNumpadClick('1')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">1</button>
        <button onClick={() => handleNumpadClick('2')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">2</button>
        <button onClick={() => handleNumpadClick('3')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">3</button>

        {/* Row 4 */}
        <button onClick={handleBackspaceClick} className="w-full h-12 text-xl bg-yellow-500 text-white border rounded-lg hover:bg-yellow-600">もどる</button>
        <button onClick={() => handleNumpadClick('0')} className="w-full h-12 text-2xl bg-white border rounded-lg hover:bg-gray-200">0</button>
        <button onClick={handleNextClick} className="w-full h-12 text-xl bg-green-500 text-white border rounded-lg hover:bg-green-600">次へ</button>
      </div>
    </div>
  );
};

export default CalculationPad;
