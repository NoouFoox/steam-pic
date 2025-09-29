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

    // 调用 Steam API
    const response = await fetch(steamApiUrl);
    
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

  } catch (error) {
    console.error('Steam API 调用出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}