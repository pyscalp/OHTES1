import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, videoUrl, title, description, tags = [], privacy = 'public', scheduleAt, accessToken } = body;

    if (!platform || !videoUrl) return NextResponse.json({ error: 'Platform and videoUrl are required' }, { status: 400 });

    let result;
    switch (platform) {
      case 'youtube': result = await publishToYouTube({ videoUrl, title, description, tags, privacy, scheduleAt, accessToken }); break;
      case 'tiktok': result = await publishToTikTok({ videoUrl, title, description, tags, privacy, scheduleAt, accessToken }); break;
      case 'instagram': result = await publishToInstagram({ videoUrl, title, privacy, scheduleAt, accessToken }); break;
      case 'twitter': result = await publishToTwitter({ videoUrl, title, description, tags, accessToken }); break;
      case 'facebook': result = await publishToFacebook({ videoUrl, title, description, privacy, scheduleAt, accessToken }); break;
      default: return NextResponse.json({ error: `Platform ${platform} not supported` }, { status: 400 });
    }

    return NextResponse.json({ success: true, platform, result, scheduled: !!scheduleAt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Publishing failed' }, { status: 500 });
  }
}

async function publishToYouTube({ videoUrl, title, description, tags, privacy, scheduleAt, accessToken }: any) {
  return { videoId: `yt_${Date.now()}`, url: `https://youtube.com/watch?v=demo_${Date.now()}`, status: scheduleAt ? 'scheduled' : 'published' };
}

async function publishToTikTok({ videoUrl, title, description, tags, privacy, scheduleAt, accessToken }: any) {
  return { videoId: `tt_${Date.now()}`, url: `https://tiktok.com/@user/video/${Date.now()}`, status: scheduleAt ? 'scheduled' : 'published' };
}

async function publishToInstagram({ videoUrl, title, privacy, scheduleAt, accessToken }: any) {
  return { mediaId: `ig_${Date.now()}`, url: `https://instagram.com/reel/demo_${Date.now()}`, status: scheduleAt ? 'scheduled' : 'published' };
}

async function publishToTwitter({ videoUrl, title, description, tags, accessToken }: any) {
  return { tweetId: `tw_${Date.now()}`, url: `https://twitter.com/user/status/${Date.now()}`, status: 'posted' };
}

async function publishToFacebook({ videoUrl, title, description, privacy, scheduleAt, accessToken }: any) {
  return { videoId: `fb_${Date.now()}`, url: `https://facebook.com/watch/${Date.now()}`, status: scheduleAt ? 'scheduled' : 'published' };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const videoId = searchParams.get('videoId');
  if (!platform || !videoId) return NextResponse.json({ error: 'platform and videoId required' }, { status: 400 });
  return NextResponse.json({ platform, videoId, status: 'completed', stats: { views: 0, likes: 0, comments: 0 } });
}