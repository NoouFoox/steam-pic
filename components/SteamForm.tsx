'use client';

import { useState, useEffect } from 'react';
interface SteamFormProps {
  onSubmit: (apiKey: string, steamId: string) => void;
  loading: boolean;
}
import { RainbowButton } from "@/components/ui/rainbow-button"
export default function SteamForm({ onSubmit, loading }: SteamFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [steamId, setSteamId] = useState('');

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
    onSubmit(apiKey, steamId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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

      <RainbowButton
        type="submit"
        className="shadow-2xl block mx-auto"
        disabled={loading}
      >
        {loading ? "获取中..." : "获取 Steam 数据"}
      </RainbowButton>
    </form>
  );
}