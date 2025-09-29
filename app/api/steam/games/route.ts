import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const steamId = searchParams.get('steamId');

    // 参数验证
    if (!apiKey || !steamId) {
      return NextResponse.json(
        { error: '缺少必要的参数: apiKey 和 steamId' },
        { status: 400 }
      );
    }

    if (steamId.length !== 17) {
      return NextResponse.json(
        { error: 'Steam ID 格式不正确，应为17位数字' },
        { status: 400 }
      );
    }

    // 构建 Steam API URL
    const steamApiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

    // 调用 Steam API - 添加超时和重试机制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    try {
      const response = await fetch(steamApiUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // 检查是否是认证错误
        if (response.status === 401 || response.status === 403) {
          return NextResponse.json(
            { error: 'API Key 无效或权限不足' },
            { status: 401 }
          );
        }
        
        return NextResponse.json(
          { error: `Steam API 请求失败: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();

      // 检查返回的数据是否有效
      if (!data.response) {
        return NextResponse.json(
          { error: 'Steam API 返回了无效数据' },
          { status: 500 }
        );
      }

      // 返回成功的数据
      return NextResponse.json(data);

    } catch {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { error: 'Steam API 调用出错，请稍后重试' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Steam API 调用出错:', error);
    return NextResponse.json(
      { error: 'Steam API 调用出错，请稍后重试' },
      { status: 500 }
    );
  }
}