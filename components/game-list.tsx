"use client";

import { useState } from "react";
import { Game } from '../app/types/steam';

interface GameListProps {
  games: Game[];
  totalCount: number;
}

export default function GameList({ games, totalCount }: GameListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  // 计算分页
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  // 分页控制函数
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 生成页码数组（显示当前页前后各2页）
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, Math.max(startPage + maxPagesToShow - 1, startPage));
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {/* 游戏列表头部信息 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          游戏列表 ({totalCount} 个游戏)
        </h3>
        <div className="text-sm text-gray-600">
          第 {currentPage} 页，共 {totalPages} 页
        </div>
      </div>

      {/* 游戏列表 */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {currentGames.map((game) => (
            <div
              key={game.appid}
              className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{game.name}</div>
                <div className="text-sm text-gray-600">
                  游戏时间: {Math.round((game.playtime_forever || 0) / 60)} 小时
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                ID: {game.appid}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          {/* 上一页按钮 */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            上一页
          </button>

          {/* 页码按钮 */}
          <div className="flex space-x-1">
            {/* 第一页（如果不在显示范围内） */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && (
                  <span className="px-2 py-2 text-gray-500">...</span>
                )}
              </>
            )}

            {/* 当前页面范围的页码 */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            {/* 最后一页（如果不在显示范围内） */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className="px-2 py-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => goToPage(totalPages)}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* 下一页按钮 */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            下一页
          </button>
        </div>
      )}

      {/* 分页信息 */}
      <div className="text-center text-sm text-gray-600">
        显示第 {startIndex + 1} - {Math.min(endIndex, games.length)} 项，共 {games.length} 项
      </div>
    </div>
  );
}