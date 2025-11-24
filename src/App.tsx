import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import HistoryScreen from './components/HistoryScreen';
import { GameLevel, Screen, HistoryRecord } from './types';
import { getHistory, saveRecord, clearHistory } from './utils/storage';
import { LEVEL_IDS } from './constants';

function App() {
    const [screen, setScreen] = useState<Screen>('welcome');
    const [level, setLevel] = useState<GameLevel>(LEVEL_IDS.GRADE_1_CALC);
    const [finalScore, setFinalScore] = useState(0);
    const [finalTime, setFinalTime] = useState(0);
    const [history, setHistory] = useState<HistoryRecord[]>([]);

    useEffect(() => {
        // Load history on mount to determine button state
        setHistory(getHistory());
    }, []);

    const handleStartGame = (selectedLevel: GameLevel) => {
        setLevel(selectedLevel);
        setScreen('quiz');
    };

    const handleQuizComplete = (score: number, time: number) => {
        setFinalScore(score);
        setFinalTime(time);

        // Save record
        saveRecord({
            timestamp: Date.now(),
            score,
            level,
            time
        });

        // Update local history state so the welcome screen button updates immediately if we go back
        setHistory(getHistory());

        setScreen('result');
    };

    const handleRestart = () => {
        setScreen('quiz');
    };

    const handleGoToTop = () => {
        setScreen('welcome');
    };

    const handleShowHistory = () => {
        setHistory(getHistory()); // Refresh just in case
        setScreen('history');
    };

    const handleClearHistory = () => {
        clearHistory();
        setHistory([]);
    };

    return (
        <div className="flex flex-col items-center pt-1 min-h-screen bg-blue-50">
            <div className="w-full max-w-md p-6">
                {screen === 'welcome' && (
                    <WelcomeScreen
                        onStartGame={handleStartGame}
                        onShowHistory={handleShowHistory}
                        hasHistory={history.length > 0}
                    />
                )}
                {screen === 'history' && (
                    <HistoryScreen
                        history={history}
                        onBack={handleGoToTop}
                        onClearHistory={handleClearHistory}
                    />
                )}
                {screen === 'quiz' && (
                    <QuizScreen
                        key={`${level}-${Date.now()}`}
                        level={level}
                        onQuizComplete={handleQuizComplete}
                        onGoToTop={handleGoToTop}
                    />
                )}
                {screen === 'result' && (
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

export default App
