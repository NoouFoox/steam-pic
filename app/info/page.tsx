"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function InfoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiKey = searchParams.get("apiKey");
  const steamId = searchParams.get("steamId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  if (!apiKey || !steamId || steamId.length !== 17) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Steam 信息
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
            <h2 className="text-red-800 font-semibold">参数错误</h2>
          </div>
          <p className="text-red-700 text-sm">
            缺少必要的参数或Steam ID格式不正确，请返回首页重新填写。
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
        >
          返回首页
        </button>
      </div>
    );
  }
  function getGamesInfo() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const url = `/api/steam/games?apiKey=${encodeURIComponent(apiKey!)}&steamId=${encodeURIComponent(steamId!)}`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.error || `HTTP ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSuccess(true);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "获取数据失败，请检查控制台错误信息");
        setSuccess(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Steam 信息
      </h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">API Key</h2>
          <p className="text-gray-700 break-all">
            {apiKey
              ? `${apiKey.substring(0, 8)}...${apiKey.substring(
                  apiKey.length - 4
                )}`
              : "未提供"}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Steam ID (64位)
          </h2>
          <p className="text-gray-700 font-mono">{steamId || "未提供"}</p>
        </div>

        {/* 错误信息显示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
            <p className="text-green-700 text-sm">数据已成功获取，请查看控制台以查看详细信息。</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            返回首页
          </button>

          <button
            onClick={getGamesInfo}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!apiKey || !steamId || loading}
          >
            {loading ? "获取中..." : "获取数据"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InfoPage() {
  return (
    <Suspense fallback={<div className="text-center mt-8">加载中...</div>}>
      <InfoContent />
    </Suspense>
  );
}
