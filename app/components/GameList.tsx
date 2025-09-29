import { Game } from '../types/steam';

interface GameListProps {
  games: Game[];
  totalCount: number;
}

export default function GameList({ games, totalCount }: GameListProps) {
  const displayGames = games.slice(0, 10);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">游戏列表</h3>
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {displayGames.map((game) => (
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
          {totalCount > 10 && (
            <div className="text-center py-2 text-gray-500 text-sm">
              显示前 10 个游戏，共 {totalCount} 个游戏
            </div>
          )}
        </div>
      </div>
    </div>
  );
}