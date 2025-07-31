import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Newspaper, RefreshCw, ExternalLink } from 'lucide-react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { baseUrl } from '@/lib/config'

interface ToutiaoItem {
  title: string
  hot_value: number
  cover: string
  link: string
}

interface ToutiaoResponse {
  code: number
  message: string
  data: ToutiaoItem[]
}

const ToutiaoPage = () => {
  const [result, setResult] = useState<ToutiaoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${baseUrl}/v2/toutiao`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const formatHotValue = (hot: number): string => {
    if (hot >= 10000000) {
      return `${(hot / 10000000).toFixed(1)}千万`
    } else if (hot >= 10000) {
      return `${(hot / 10000).toFixed(1)}万`
    }
    return hot.toLocaleString()
  }

  const examples = [
    {
      title: '获取头条热搜',
      description: '获取今日头条实时热搜榜',
      url: `${baseUrl}/v2/toutiao`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": [
    {
      "title": "蔡磊身体机能下降：声音变模糊",
      "hot_value": 30631662,
      "cover": "https://p3-sign.toutiaoimg.com/mosaic-legacy/2b29000036f8405561443~tplv-tt-shrink:960:540.jpeg",
      "link": "https://www.toutiao.com/trending/7458575348797276186"
    }
  ]
}`
    }
  ]

  return (
    <ApiPageLayout
      title="头条热搜榜"
      description="获取今日头条实时热搜榜单，了解当前热门话题"
      endpoint="/v2/toutiao"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            实时热搜榜
          </CardTitle>
          <CardDescription>
            点击下方按钮获取今日头条最新热搜数据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleGetNews} 
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
                  <Newspaper className="w-4 h-4 mr-2" />
                  获取热搜榜
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">获取失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {result && result.data && Array.isArray(result.data) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">头条热搜榜</h3>
                  <span className="text-sm text-gray-500">
                    共 {result.data.length} 条热搜
                  </span>
                </div>

                <div className="space-y-3">
                  {result.data.map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index < 3 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                              : index < 10 
                                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          
                          {item.cover && (
                            <img 
                              src={item.cover} 
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
                                {item.title}
                              </h4>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-red-600">
                                  {formatHotValue(item.hot_value)}
                                </div>
                                <div className="text-xs text-gray-500">热度</div>
                              </div>
                            </div>
                            
                            {item.link && (
                              <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                查看详情
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default ToutiaoPage
