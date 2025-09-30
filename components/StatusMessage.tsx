interface StatusMessageProps {
  type: 'error' | 'success';
  message?: string;
  gameCount?: number;
}

export default function StatusMessage({ type, message, gameCount }: StatusMessageProps) {
  if (type === 'error' && message) {
    return (
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
        <p className="text-red-700 text-sm">{message}</p>
      </div>
    );
  }

  if (type === 'success' && typeof gameCount === 'number') {
    return (
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
          找到 {gameCount} 个游戏
        </p>
      </div>
    );
  }

  return null;
}