import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Gift, ExternalLink, Calendar } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const EpicPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      current_games?: Array<{
        title: string;
        description: string;
        original_price: string;
        promotional_price?: string;
        image: string;
        url: string;
        start_date?: string;
        end_date?: string;
      }>;
      upcoming_games?: Array<{
        title: string;
        description: string;
        image: string;
        start_date?: string;
        end_date?: string;
      }>;
      update_time?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/epic`)
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

  const examples = [
    {
      title: "获取免费游戏",
      description: "获取 Epic Games 当前和即将免费的游戏",
      url: `${baseUrl}/v2/epic`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "current_games": [
      {
        "title": "游戏名称",
        "description": "游戏描述",
        "original_price": "原价",
        "promotional_price": "促销价格",
        "image": "游戏图片URL",
        "url": "游戏链接",
        "start_date": "开始时间",
        "end_date": "结束时间"
      }
    ],
    "upcoming_games": [...],
    "update_time": "2024-01-01 12:00:00"
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="Epic Games 免费游戏"
      description="获取 Epic Games 当前和即将免费的游戏信息"
      endpoint="/v2/epic"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            免费游戏信息
          </CardTitle>
          <CardDescription>
            点击下方按钮获取 Epic Games 最新免费游戏数据
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
                  <Gift className="w-4 h-4 mr-2" />
                  获取免费游戏
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
              <div className="space-y-6">
                {data.data.update_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>更新时间: {data.data.update_time}</span>
                  </div>
                )}

                {/* 当前免费游戏 */}
                {data.data.current_games && data.data.current_games.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-700">
                      🎮 当前免费游戏
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {data.data.current_games.map((game, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative">
                            <img 
                              src={game.image} 
                              alt={game.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-game.jpg'
                              }}
                            />
                            <div className="absolute top-2 right-2">
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                                免费
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-bold text-lg mb-2">{game.title}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                              {game.description}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-gray-500 line-through text-sm">
                                  {game.original_price}
                                </span>
                                {game.promotional_price && (
                                  <span className="ml-2 text-green-600 font-bold">
                                    {game.promotional_price}
                                  </span>
                                )}
                              </div>
                            </div>
                            {(game.start_date || game.end_date) && (
                              <div className="text-xs text-gray-500 mb-3">
                                {game.start_date && `开始: ${game.start_date}`}
                                {game.start_date && game.end_date && ' | '}
                                {game.end_date && `结束: ${game.end_date}`}
                              </div>
                            )}
                            <a 
                              href={game.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              前往 Epic Games
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* 即将免费游戏 */}
                {data.data.upcoming_games && data.data.upcoming_games.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">
                      ⏰ 即将免费游戏
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {data.data.upcoming_games.map((game, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative">
                            <img 
                              src={game.image} 
                              alt={game.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-game.jpg'
                              }}
                            />
                            <div className="absolute top-2 right-2">
                              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                                即将免费
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-bold text-lg mb-2">{game.title}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                              {game.description}
                            </p>
                            {(game.start_date || game.end_date) && (
                              <div className="text-xs text-gray-500">
                                {game.start_date && `开始: ${game.start_date}`}
                                {game.start_date && game.end_date && ' | '}
                                {game.end_date && `结束: ${game.end_date}`}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default EpicPage
