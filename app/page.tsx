"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const router = useRouter();

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
    console.log('API Key:', apiKey);
    console.log('Steam ID (64位):', steamId);
    
    // 跳转到info页面并传递参数
    const params = new URLSearchParams({
      apiKey: apiKey,
      steamId: steamId
    });
    router.push(`/info?${params.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          提交
        </button>
      </form>
    </div>
  );
}
