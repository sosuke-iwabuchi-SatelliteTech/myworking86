import { GameSettings } from '../types';
import { getSettings, saveSettings } from '../utils/storage';
import { useState, useEffect } from 'react';

/**
 * SettingsScreenコンポーネントのprops
 */
interface SettingsScreenProps {
  /**
   * 「もどる」ボタンがクリックされたときに呼び出されるコールバック関数
   */
  onBack: () => void;
  /**
   * 設定が変更されたときに呼び出されるコールバック関数
   * @param newSettings 変更後の新しい設定オブジェクト
   */
  onSettingsChange: (newSettings: GameSettings) => void;
}

/**
 * ゲームの設定画面を表示および管理するコンポーネント。
 * 現在はタイマーの表示／非表示設定のみを提供します。
 * @param {SettingsScreenProps} props - コンポーネントのprops
 */
export default function SettingsScreen({ onBack, onSettingsChange }: SettingsScreenProps) {
  const [settings, setSettings] = useState<GameSettings>({ showTimer: true });

  useEffect(() => {
    // Load initial state
    setSettings(getSettings());
  }, []);

  const handleToggleTimer = () => {
    const newSettings = { ...settings, showTimer: !settings.showTimer };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border-4 border-white ring-4 ring-blue-100 w-full">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-600 font-bold text-lg transition-colors flex items-center"
        >
          ← もどる
        </button>
        <h1 className="text-2xl font-black text-slate-800 absolute left-1/2 transform -translate-x-1/2">設定</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <span className="font-bold text-slate-700 text-lg">クイズ中のタイムを表示</span>
          <button
            onClick={handleToggleTimer}
            className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none ${
              settings.showTimer ? 'bg-brand-blue' : 'bg-slate-300'
            }`}
            aria-label="Toggle timer display"
          >
            <span
              className={`absolute top-1 left-1 bg-white w-7 h-7 rounded-full shadow-sm transform transition-transform duration-300 ${
                settings.showTimer ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-slate-400">
        <p>設定は自動で保存されます</p>
      </div>
    </div>
  );
}
