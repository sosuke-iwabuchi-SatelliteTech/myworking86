import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import HistoryScreen from "./components/HistoryScreen";
import SettingsScreen from "./components/SettingsScreen";
import AnswerModeModal from "./components/AnswerModeModal";
import {
  Screen,
  HistoryRecord,
  GameSettings,
  AnswerMode,
  GameLevel,
} from "./types";
import {
  getHistory,
  saveRecord,
  clearHistory,
  getSettings,
} from "./utils/storage";
import { GRADES } from "./constants";

/**
 * アプリケーションのメインコンポーネント。
 * 画面の状態（スクリーン）を管理し、各画面コンポーネントの表示を切り替えます。
 * また、ゲームの状態（レベル、スコアなど）や履歴データも管理します。
 */
function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [level, setLevel] = useState<(typeof GRADES)[number]['levels'][number]>(GRADES[0].levels[0]);
  const [answerMode, setAnswerMode] = useState<AnswerMode>("choice");
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [settings, setSettings] = useState<GameSettings>({ showTimer: true });
  const [isAnswerModeModalOpen, setIsAnswerModeModalOpen] = useState(false);

  useEffect(() => {
    // Load history on mount to determine button state
    setHistory(getHistory());
    setSettings(getSettings());
  }, []);

  const handleStartGame = (selectedLevel: (typeof GRADES)[number]['levels'][number]) => {
    setLevel(selectedLevel);

    if (selectedLevel.calculationPadAvailable) {
      setIsAnswerModeModalOpen(true);
    } else {
      setAnswerMode("choice");
      setScreen("quiz");
    }
  };

  const handleAnswerModeSelect = (mode: AnswerMode) => {
    setAnswerMode(mode);
    setIsAnswerModeModalOpen(false);
    setScreen("quiz");
  };

  const handleAnswerModeModalClose = () => {
    setIsAnswerModeModalOpen(false);
  };

  const handleQuizComplete = (score: number, time: number) => {
    setFinalScore(score);
    setFinalTime(time);

    const gradeInfo = GRADES.find((g) =>
      g.levels.some((l) => l.id === level.id)
    );
    const grade = gradeInfo ? gradeInfo.grade : undefined;

    // Save record
    saveRecord({
      timestamp: Date.now(),
      score,
      level: level.id,
      time,
      grade,
    });

    // Update local history state so the welcome screen button updates immediately if we go back
    setHistory(getHistory());

    setScreen("result");
  };

  const handleRestart = () => {
    setScreen("quiz");
  };

  const handleGoToTop = () => {
    setScreen("welcome");
  };

  const handleShowHistory = () => {
    setHistory(getHistory()); // Refresh just in case
    setScreen("history");
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleGoToSettings = () => {
    setScreen("settings");
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="flex flex-col items-center pt-1 min-h-screen bg-blue-50">
      <div className="w-full max-w-md p-6">
        {screen === "welcome" && (
          <WelcomeScreen
            onStartGame={handleStartGame}
            onShowHistory={handleShowHistory}
            hasHistory={history.length > 0}
            onGoToSettings={handleGoToSettings}
          />
        )}
        {screen === "history" && (
          <HistoryScreen
            history={history}
            onBack={handleGoToTop}
            onClearHistory={handleClearHistory}
          />
        )}
        {screen === "settings" && (
          <SettingsScreen
            onBack={handleGoToTop}
            onSettingsChange={handleSettingsChange}
          />
        )}
        {screen === "quiz" && (
          <QuizScreen
            key={`${level}-${answerMode}-${Date.now()}`}
            level={level}
            answerMode={answerMode}
            onQuizComplete={handleQuizComplete}
            onGoToTop={handleGoToTop}
            showTimer={settings.showTimer}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            score={finalScore}
            finalTime={finalTime}
            onRestart={handleRestart}
            onGoToTop={handleGoToTop}
          />
        )}
      </div>
      <AnswerModeModal
        isOpen={isAnswerModeModalOpen}
        onSelect={handleAnswerModeSelect}
        onClose={handleAnswerModeModalClose}
      />
    </div>
  );
}

export default App;
