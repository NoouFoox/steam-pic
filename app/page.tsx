"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [gameData, setGameData] = useState<{
    response?: {
      game_count?: number;
      games?: Array<{
        appid: number;
        name: string;
        playtime_forever?: number;
      }>;
    };
  } | null>(null);

  // 从本地存储加载数据
  useEffect(() => {
    const savedApiKey = localStorage.getItem('steam-apikey');
    const savedSteamId = localStorage.getItem('steam-steamid');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedSteamId) {
      setSteamId(savedSteamId);
    }
  }, []);

  // 保存到本地存储
  const saveToLocalStorage = (key: string, value: string) => {
    if (value.trim()) {
      localStorage.setItem(key, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !steamId || steamId.length !== 17) {
      setError('请填写有效的 API Key 和 17 位 Steam ID');
      return;
    }

    fetchSteamData();
  };

  const fetchSteamData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setGameData(null);

    try {
      const url = `/api/steam/games?apiKey=${encodeURIComponent(apiKey)}&steamId=${encodeURIComponent(steamId)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setGameData(data);
      setSuccess(true);
      setError(null);
      console.log('Steam 数据：', data);
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "获取数据失败，请检查控制台错误信息");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Steam Picture</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              saveToLocalStorage('steam-apikey', e.target.value);
            }}
            placeholder="请输入 API Key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="steamId" className="block text-sm font-medium text-gray-700 mb-2">
            Steam ID (64位)
          </label>
          <input
            type="text"
            id="steamId"
            value={steamId}
            onChange={(e) => {
              setSteamId(e.target.value);
              saveToLocalStorage('steam-steamid', e.target.value);
            }}
            placeholder="请输入 64 位 Steam ID"
            pattern="[0-9]{17}"
            title="请输入17位数字的Steam ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "获取中..." : "获取 Steam 数据"}
        </button>
      </form>

      {/* 错误信息显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-red-800 font-semibold">获取失败</h3>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 成功信息显示 */}
      {success && gameData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-green-800 font-semibold">获取成功</h3>
          </div>
          <p className="text-green-700 text-sm">
            找到 {gameData.response?.game_count || 0} 个游戏
          </p>
        </div>
      )}

      {/* 游戏数据展示 */}
      {gameData && gameData.response?.games && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">游戏列表</h3>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {gameData.response.games.slice(0, 10).map((game) => (
                <div key={game.appid} className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium text-gray-900">{game.name}</span>
                    <div className="text-sm text-gray-500">
                      游戏时间: {Math.round((game.playtime_forever || 0) / 60 * 100) / 100} 小时
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">ID: {game.appid}</span>
                </div>
              ))}
              {gameData.response.games.length > 10 && (
                <div className="text-center py-2 text-gray-500 text-sm">
                  显示前 10 个游戏，共 {gameData.response.games.length} 个游戏
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
