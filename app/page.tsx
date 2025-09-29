"use client";

import { useState } from "react";
import SteamForm from "./components/SteamForm";
import StatusMessage from "./components/StatusMessage";
import GameList from "./components/GameList";
import { SteamApiResponse } from "./types/steam";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameData, setGameData] = useState<SteamApiResponse | null>(null);

  const handleFormSubmit = async (apiKey: string, steamId: string) => {
    if (!apiKey || !steamId || steamId.length !== 17) {
      setError("请填写有效的 API Key 和 17 位 Steam ID");
      return;
    }

    await fetchSteamData(apiKey, steamId);
  };

  const fetchSteamData = async (apiKey: string, steamId: string) => {
    setLoading(true);
    setError(null);
    setGameData(null);

    try {
      const url = `/api/steam/games?apiKey=${encodeURIComponent(
        apiKey
      )}&steamId=${encodeURIComponent(steamId)}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setGameData(data);
      setError(null);
      console.log("Steam 数据：", data?.response?.games);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "获取数据失败，请检查控制台错误信息"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Steam Picture
      </h1>

      <SteamForm onSubmit={handleFormSubmit} loading={loading} />

      <StatusMessage type="error" message={error || undefined} />

      <StatusMessage
        type="success"
        gameCount={gameData?.response?.game_count}
      />

      {gameData?.response?.games && (
        <GameList
          games={gameData.response.games}
          totalCount={gameData.response.games.length}
        />
      )}
    </div>
  );
}
