import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Music, Play, Pause, Volume2 } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const ChangyaPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      user: {
        nickname: string;
        gender: string;
        avatar_url: string;
      };
      song: {
        name: string;
        singer: string;
        lyrics: string[];
      };
      audio: {
        url: string;
        duration: number;
        like_count: number;
        link: string;
        publish: string;
        publish_at: number;
      };
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    stopAudio()
    
    try {
      const response = await fetch(`${baseUrl}/v2/changya`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const playAudio = () => {
    if (data?.data?.audio.url) {
      if (audio) {
        audio.pause()
      }
      
      const newAudio = new Audio(data.data.audio.url)
      newAudio.onplay = () => setIsPlaying(true)
      newAudio.onpause = () => setIsPlaying(false)
      newAudio.onended = () => setIsPlaying(false)
      newAudio.onerror = () => {
        setError('音频播放失败')
        setIsPlaying(false)
      }
      
      setAudio(newAudio)
      newAudio.play()
    }
  }

  const stopAudio = () => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    } else {
      playAudio()
    }
  }

  const examples = [
    {
      title: "获取唱歌音频",
      description: "获取一个随机的唱歌音频",
      url: `${baseUrl}/v2/changya`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": {
    "user": {
      "nickname": "侧耳倾心",
      "gender": "female",
      "avatar_url": "http://img-cdn.api.singduck.cn/user-img/..."
    },
    "song": {
      "name": "是妈妈是女儿",
      "singer": "黄绮珊/希林娜依高",
      "lyrics": ["我希望你被爱着", "我希望你要快乐", "..."]
    },
    "audio": {
      "url": "http://audio-cdn.api.singduck.cn/ugc/...",
      "duration": 29973,
      "like_count": 8126,
      "link": "https://m.api.singduck.cn/user-piece/...",
      "publish": "2023/03/31 18:46:36",
      "publish_at": 1680259596000
    }
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="随机唱歌音频"
      description="获取随机的唱歌音频，享受音乐的美妙"
      endpoint="/v2/changya"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            随机音乐
          </CardTitle>
          <CardDescription>
            点击下方按钮获取一个随机的唱歌音频
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={fetchData} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <Music className="w-4 h-4 mr-2" />
                  获取随机音频
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">获取失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {data && data.data && (
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* 用户头像 */}
                    {data.data.user.avatar_url && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={data.data.user.avatar_url} 
                          alt="用户头像"
                          className="w-full h-full object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* 音乐信息 */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-purple-900 mb-1">
                          {data.data.song.name}
                        </h3>
                        <p className="text-purple-700 mb-2">
                          🎤 演唱者: {data.data.song.singer}
                        </p>
                        <p className="text-purple-700 mb-2">
                          👤 用户昵称: {data.data.user.nickname} ({data.data.user.gender === 'female' ? '女' : '男'})
                        </p>
                        <p className="text-sm text-purple-600">
                          ⏱️ 时长: {Math.floor(data.data.audio.duration / 1000)}秒
                        </p>
                        <p className="text-sm text-purple-600">
                          ❤️ 点赞数: {data.data.audio.like_count.toLocaleString()}
                        </p>
                        <p className="text-sm text-purple-600">
                          📅 发布时间: {data.data.audio.publish}
                        </p>
                      </div>

                      {/* 播放控制 */}
                      <div className="flex items-center gap-3 mb-4">
                        <Button
                          onClick={togglePlay}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                          size="lg"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-5 h-5" />
                              暂停
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              播放
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={stopAudio}
                          variant="outline"
                          size="lg"
                          disabled={!audio}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          停止
                        </Button>

                        <Button
                          onClick={() => window.open(data.data!.audio.link, '_blank')}
                          variant="outline"
                          size="lg"
                        >
                          🔗 查看原链接
                        </Button>
                      </div>

                      {/* 歌词 */}
                      {data.data.song.lyrics && data.data.song.lyrics.length > 0 && (
                        <div className="p-3 bg-white rounded-lg border border-purple-200 mb-4">
                          <h4 className="font-medium text-purple-700 mb-2">📝 歌词</h4>
                          <div className="text-sm text-gray-700 space-y-1">
                            {data.data.song.lyrics.map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 音频信息 */}
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="text-xs text-purple-600">
                      🎵 音频链接: 
                      <a 
                        href={data.data.audio.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-purple-800 hover:underline break-all"
                      >
                        {data.data.audio.url}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">🎤 音乐小贴士</h4>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• 请确保您的设备音量适中</li>
                <li>• 支持在线播放，无需下载</li>
                <li>• 音频内容来源于网络，仅供娱乐</li>
                <li>• 建议使用耳机获得更好的听觉体验</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default ChangyaPage
