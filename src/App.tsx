import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { GameLevel, Screen } from './types';

function App() {
    const [screen, setScreen] = useState<Screen>('welcome');
    const [level, setLevel] = useState<GameLevel>(1);
    const [finalScore, setFinalScore] = useState(0);
    const [finalTime, setFinalTime] = useState(0);

    const handleStartGame = (selectedLevel: GameLevel) => {
        setLevel(selectedLevel);
        setScreen('quiz');
    };

    const handleQuizComplete = (score: number, time: number) => {
        setFinalScore(score);
        setFinalTime(time);
        setScreen('result');
    };

    const handleRestart = () => {
        setScreen('quiz');
    };

    const handleGoToTop = () => {
        setScreen('welcome');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md p-6">
                {screen === 'welcome' && <WelcomeScreen onStartGame={handleStartGame} />}
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
