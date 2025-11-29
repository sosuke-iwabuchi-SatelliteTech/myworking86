import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import HistoryScreen from "./components/HistoryScreen";
import SettingsScreen from "./components/SettingsScreen";
import AnswerModeModal from "./components/AnswerModeModal";
import UserRegistrationScreen from "./components/UserRegistrationScreen";
import UserSwitchModal from "./components/UserSwitchModal";
import {
  Screen,
  HistoryRecord,
  GameSettings,
  AnswerMode,
  UserProfile,
  User,
} from "./types";
import {
  getHistory,
  saveRecord,
  clearHistory,
  getSettings,
  getCurrentUser,
  saveUser,
  getUsers,
  switchUser,
  deleteUser,
} from "./utils/storage";
import { setUserProperties, trackQuizComplete } from "./utils/analytics";
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAnswerModeModalOpen, setIsAnswerModeModalOpen] = useState(false);
  const [isUserSwitchModalOpen, setIsUserSwitchModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize data
  useEffect(() => {
    // Check/Migrate users first
    const loadedUsers = getUsers();
    setUsers(loadedUsers);

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setUserProperties(user.nickname, user.grade);
      setScreen("welcome");
      // Load history for the current user
      setHistory(getHistory());
    } else {
      setScreen("registration");
    }

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

    // Send analytics
    trackQuizComplete(level.id, score, time);

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

  const handleRegistrationComplete = (profile: UserProfile) => {
    const newUser = saveUser(profile);
    setCurrentUser(newUser);
    setUsers(getUsers()); // Reload users list
    setUserProperties(newUser.nickname, newUser.grade);
    setHistory([]); // New user has no history
    setScreen("welcome");
  };

  // User Switch Logic
  const handleOpenUserSwitch = () => {
    setUsers(getUsers()); // Refresh list
    setIsUserSwitchModalOpen(true);
  };

  const handleCloseUserSwitch = () => {
    setIsUserSwitchModalOpen(false);
  };

  const handleSelectUser = (userId: string) => {
    switchUser(userId);
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setUserProperties(user.nickname, user.grade);
      setHistory(getHistory()); // Load history for switched user
    }
    setIsUserSwitchModalOpen(false);
  };

  const handleAddUser = () => {
    setIsUserSwitchModalOpen(false);
    setScreen("registration");
  };

  const handleDeleteUser = (userId: string) => {
    const nextUser = deleteUser(userId);
    setUsers(getUsers()); // Refresh list

    // If the deleted user was the current user (or we were left with no users), update state
    if (!nextUser && users.length <= 1) {
       // All users deleted (or the last one was deleted)
       setCurrentUser(null);
       setScreen("registration");
       setIsUserSwitchModalOpen(false);
    } else if (currentUser?.id === userId) {
       // Current user deleted, switched to another
       setCurrentUser(nextUser);
       if(nextUser) {
           setUserProperties(nextUser.nickname, nextUser.grade);
           setHistory(getHistory());
       }
    }
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
            userProfile={currentUser}
            onSwitchUser={handleOpenUserSwitch}
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
            key={`${level.id}-${answerMode}-${Date.now()}`}
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
          />
        )}
      </div>
      <AnswerModeModal
        isOpen={isAnswerModeModalOpen}
        onSelect={handleAnswerModeSelect}
        onClose={handleAnswerModeModalClose}
      />
      <UserSwitchModal
        isOpen={isUserSwitchModalOpen}
        onClose={handleCloseUserSwitch}
        users={users}
        currentUserId={currentUser?.id}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}

export default App;
