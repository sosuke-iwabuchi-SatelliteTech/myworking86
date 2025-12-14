import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import WelcomeScreen from "../components/WelcomeScreen";
import QuizScreen from "../components/QuizScreen";
import ResultScreen from "../components/ResultScreen";
import HistoryScreen from "../components/HistoryScreen";
import SettingsScreen from "../components/SettingsScreen";
import GachaScreen from "../components/GachaScreen";
import AnswerModeModal from "../components/AnswerModeModal";
import UserRegistrationScreen from "../components/UserRegistrationScreen";
import UserSwitchModal from "../components/UserSwitchModal";
import PrizeListScreen from "../components/PrizeListScreen";
import {
    Screen,
    HistoryRecord,
    GameSettings,
    AnswerMode,
    UserProfile,
} from "../types";
import {
    getHistory,
    saveRecord,
    clearHistory,
    getSettings,
    getUserProfile,
    saveUserProfile,
    getUsers,
    setCurrentUser,
    deleteUserProfile,
    updateLevelStats,
} from "../utils/storage";
import { setUserProperties, trackQuizComplete } from "../utils/analytics";
import { GRADES } from "../constants";
import { loginUser } from "../utils/auth";
import { awardPoints } from "../utils/pointApi";
import ServerFailureModal from "../components/ui/ServerFailureModal";

/**
 * アプリケーションのメインコンポーネント。
 * 画面の状態（スクリーン）を管理し、各画面コンポーネントの表示を切り替えます。
 * また、ゲームの状態（レベル、スコアなど）や履歴データも管理します。
 */
export default function Home() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getUserProfile());
    const [users, setUsers] = useState<UserProfile[]>(() => getUsers());
    const [screen, setScreen] = useState<Screen>(() => {
        return getUserProfile() ? "welcome" : "registration";
    });
    const [level, setLevel] = useState<(typeof GRADES)[number]['levels'][number]>(GRADES[0].levels[0]);
    const [answerMode, setAnswerMode] = useState<AnswerMode>("choice");
    const [finalScore, setFinalScore] = useState(0);
    const [finalTime, setFinalTime] = useState(0);
    const [history, setHistory] = useState<HistoryRecord[]>(() => getHistory());
    const [settings, setSettings] = useState<GameSettings>(() => getSettings());
    const [isAnswerModeModalOpen, setIsAnswerModeModalOpen] = useState(false);
    const [isUserSwitchModalOpen, setIsUserSwitchModalOpen] = useState(false);
    const [quizKey, setQuizKey] = useState(0);
    const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
    const [isServerFailureModalOpen, setIsServerFailureModalOpen] = useState(false);

    useEffect(() => {
        // Track user properties if profile is loaded on mount
        if (userProfile) {
            setUserProperties(userProfile.nickname, String(userProfile.grade));
            loginUser(userProfile.id, userProfile.nickname, userProfile.grade).catch((e) => console.error("Auto-login failed", e));
        }
    }, [userProfile]);

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
        setQuizKey(prev => prev + 1);
        setScreen("quiz");
    };

    const handleAnswerModeModalClose = () => {
        setIsAnswerModeModalOpen(false);
    };

    const handleQuizComplete = async (score: number, time: number) => {
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

        // Update level stats (best score, etc.)
        updateLevelStats(level.id, score, time);

        // Update local history state so the welcome screen button updates immediately if we go back
        setHistory(getHistory());

        // Send analytics
        trackQuizComplete(level.id, score, time);

        try {
            const result = await awardPoints(level.id, score);
            setEarnedPoints(result.earned_points);
        } catch (e) {
            console.error("Failed to award points", e);
            setEarnedPoints(null);
            setIsServerFailureModalOpen(true);
        }

        setScreen("result");
    };

    const handleRestart = () => {
        setQuizKey(prev => prev + 1);
        setScreen("quiz");
    };

    const handleGoToTop = () => {
        setHistory(getHistory()); // Refresh history when returning to top
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

    const handleGoToGacha = () => {
        setScreen("gacha");
    };

    const handleGoToPrizeList = () => {
        setScreen("prizeList");
    };

    const handleSettingsChange = (newSettings: GameSettings) => {
        setSettings(newSettings);
    };

    const handleRegistrationComplete = (profile: UserProfile) => {
        saveUserProfile(profile);
        setUserProfile(profile);
        setUsers(getUsers());
        setUserProperties(profile.nickname, String(profile.grade));
        setScreen("welcome");
    };

    const handleOpenUserSwitch = () => {
        setUsers(getUsers()); // Refresh user list just in case
        setIsUserSwitchModalOpen(true);
    };

    const handleCloseUserSwitch = () => {
        setIsUserSwitchModalOpen(false);
    };

    const handleSwitchUser = (userId: string) => {
        setCurrentUser(userId);
        const profile = getUserProfile();
        if (profile) {
            setUserProfile(profile);
            setUserProperties(profile.nickname, String(profile.grade));
            setHistory(getHistory()); // Load history for new user
            setScreen("welcome"); // Reset to welcome screen
        }
        setIsUserSwitchModalOpen(false);
    };

    const handleCreateNewUser = () => {
        setIsUserSwitchModalOpen(false);
        setScreen("registration");
    };

    const handleDeleteUser = (userId: string) => {
        deleteUserProfile(userId);
        setUsers(getUsers());
    };

    const handleCloseServerFailure = () => {
        setIsServerFailureModalOpen(false);
    };

    const handleGoToTrade = () => {
        router.visit('/trades');
    };

    return (
        <div className="flex flex-col items-center pt-1 min-h-screen bg-blue-50">
            <div className={`w-full p-6 ${screen === 'quiz' ? 'max-w-7xl' : 'max-w-md'}`}>
                {screen === "registration" && (
                    <UserRegistrationScreen
                        onComplete={handleRegistrationComplete}
                    />
                )}
                {screen === "welcome" && (
                    <WelcomeScreen
                        onStartGame={handleStartGame}
                        onShowHistory={handleShowHistory}
                        hasHistory={history.length > 0}
                        onGoToSettings={handleGoToSettings}
                        onGoToGacha={handleGoToGacha}
                        onGoToPrizeList={handleGoToPrizeList}
                        onGoToTrade={handleGoToTrade}
                        userProfile={userProfile}
                        onOpenUserSwitch={handleOpenUserSwitch}
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
                {screen === "gacha" && (
                    <GachaScreen
                        onBack={handleGoToTop}
                    />
                )}
                {screen === "prizeList" && (
                    <PrizeListScreen
                        onBack={handleGoToTop}
                    />
                )}
                {screen === "quiz" && (
                    <QuizScreen
                        key={`${level.id}-${answerMode}-${quizKey}`}
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
                        medalCriteria={level.medalCriteria}
                        earnedPoints={earnedPoints}
                    />
                )}
            </div>
            <ServerFailureModal
                isOpen={isServerFailureModalOpen}
                onClose={handleCloseServerFailure}
            />
            <AnswerModeModal
                isOpen={isAnswerModeModalOpen}
                onSelect={handleAnswerModeSelect}
                onClose={handleAnswerModeModalClose}
            />
            <UserSwitchModal
                isOpen={isUserSwitchModalOpen}
                onClose={handleCloseUserSwitch}
                users={users}
                currentUser={userProfile}
                onSwitchUser={handleSwitchUser}
                onCreateNewUser={handleCreateNewUser}
                onDeleteUser={handleDeleteUser}
            />
        </div>
    );
}
