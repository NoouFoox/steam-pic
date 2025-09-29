// 代理配置示例
// 在生产环境中，你可能需要使用代理服务

export const STEAM_API_CONFIG = {
  // 开发环境直连
  DIRECT_URL: 'https://api.steampowered.com',
  
  // 如果需要代理，可以配置代理URL
  PROXY_URL: process.env.STEAM_PROXY_URL || '',
  
  // 超时设置
  TIMEOUT: 10000,
  
  // 重试次数
  RETRY_COUNT: 2,
};

// 获取Steam API的基础URL
export function getSteamApiBaseUrl(): string {
  // 如果配置了代理URL，使用代理
  if (STEAM_API_CONFIG.PROXY_URL) {
    return STEAM_API_CONFIG.PROXY_URL;
  }
  
  // 否则直连Steam API
  return STEAM_API_CONFIG.DIRECT_URL;
}

// 带重试的fetch函数
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries: number = STEAM_API_CONFIG.RETRY_COUNT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STEAM_API_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && error instanceof Error) {
      console.log(`请求失败，剩余重试次数: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
}