import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import HistoryScreen from "./components/HistoryScreen";
import SettingsScreen from "./components/SettingsScreen";
import SelectAnswerModeScreen from "./components/SelectAnswerModeScreen";
import {
  GameLevel,
  Screen,
  HistoryRecord,
  GameSettings,
  AnswerMode,
} from "./types";
import {
  getHistory,
  saveRecord,
  clearHistory,
  getSettings,
} from "./utils/storage";
import { GRADES } from "./constants";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [level, setLevel] = useState<GameLevel>("grade-1-calc");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("choice");
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [settings, setSettings] = useState<GameSettings>({ showTimer: true });

  useEffect(() => {
    // Load history on mount to determine button state
    setHistory(getHistory());
    setSettings(getSettings());
  }, []);

  const handleStartGame = (selectedLevel: GameLevel) => {
    setLevel(selectedLevel);
    const selectedGrade = GRADES.find((g) =>
      g.levels.some((l) => l.id === selectedLevel)
    );
    const selectedLevelInfo = selectedGrade?.levels.find(
      (l) => l.id === selectedLevel
    );

    if (selectedLevelInfo?.calculationPadAvailable) {
      setScreen("selectAnswerMode");
    } else {
      setAnswerMode("choice");
      setScreen("quiz");
    }
  };

  const handleAnswerModeSelect = (mode: AnswerMode) => {
    setAnswerMode(mode);
    setScreen("quiz");
  };

  const handleQuizComplete = (score: number, time: number) => {
    setFinalScore(score);
    setFinalTime(time);

    const gradeInfo = GRADES.find((g) =>
      g.levels.some((l) => l.id === level)
    );
    const grade = gradeInfo ? gradeInfo.grade : undefined;

    // Save record
    saveRecord({
      timestamp: Date.now(),
      score,
      level,
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
        {screen === "selectAnswerMode" && (
          <SelectAnswerModeScreen
            onSelect={handleAnswerModeSelect}
            onBack={handleGoToTop}
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
    </div>
  );
}

export default App;
