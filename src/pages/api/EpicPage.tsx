import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Gift, ExternalLink } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const EpicPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: Array<{
      id: string;
      title: string;
      cover: string;
      original_price: number;
      original_price_desc: string;
      description: string;
      seller: string;
      is_free_now: boolean;
      free_start: string;
      free_start_at: number;
      free_end: string;
      free_end_at: number;
      link: string;
    }>;
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
  "message": "所有数据均来自官方，确保稳定与实时，用户群: 595941841，开源地址: https://github.com/vikiboss/60s",
  "data": [
    {
      "id": "92acefe8e4e845169ea160bb92e3e4e0",
      "title": "Turmoil",
      "cover": "https://cdn1.epicgames.com/spt-assets/4985026f56654289a4a1fa848f41c4c9/turmoil-1qsb0.png",
      "original_price": 40,
      "original_price_desc": "¥40.00",
      "description": "像1899年一样钻取石油！《动荡》提供了一款视觉上迷人、富有幽默感的模拟游戏，灵感来自19世纪美国的石油热潮。",
      "seller": "Gamious",
      "is_free_now": true,
      "free_start": "2025/01/10 00:00:00",
      "free_start_at": 1736438400000,
      "free_end": "2025/01/17 00:00:00",
      "free_end_at": 1737043200000,
      "link": "https://store.epicgames.com/store/zh-CN/p/turmoil-26318a"
    }
  ]
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
                {/* 当前免费游戏 */}
                {(() => {
                  const currentGames = data.data.filter(game => game.is_free_now)
                  return currentGames.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-green-700">
                        🎮 当前免费游戏 ({currentGames.length}款)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {currentGames.map((game) => (
                          <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative">
                              <img 
                                src={game.cover} 
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
                                    {game.original_price_desc}
                                  </span>
                                  <span className="ml-2 text-green-600 font-bold">
                                    免费
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {game.seller}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mb-3">
                                免费时间: {game.free_start} ~ {game.free_end}
                              </div>
                              <a 
                                href={game.link} 
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
                  )
                })()}

                {/* 即将免费游戏 */}
                {(() => {
                  const upcomingGames = data.data.filter(game => !game.is_free_now)
                  return upcomingGames.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-blue-700">
                        ⏰ 即将免费游戏 ({upcomingGames.length}款)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {upcomingGames.map((game) => (
                          <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative">
                              <img 
                                src={game.cover} 
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
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="text-gray-700 font-medium">
                                    {game.original_price_desc}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {game.seller}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mb-3">
                                免费时间: {game.free_start} ~ {game.free_end}
                              </div>
                              <a 
                                href={game.link} 
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
                  )
                })()}

                {/* 无游戏时的提示 */}
                {data.data.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无免费游戏信息</p>
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
