import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Newspaper, RefreshCw, AlertCircle, ExternalLink, Clock, Eye } from 'lucide-react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { baseUrl } from '@/lib/config'

interface NewsItem {
  title: string
  url: string
  source?: string
  time?: string
  category?: string
  hot?: number
  image?: string
}

interface ToutiaoResponse {
  code: number
  data: NewsItem[]
  updateTime?: string
}

const ToutiaoPage = () => {
  const [result, setResult] = useState<ToutiaoResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGetNews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}/v2/toutiao`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取今日头条失败:', error)
      alert('获取今日头条失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时自动获取数据
  useEffect(() => {
    handleGetNews()
  }, [])

  const formatHotValue = (hot: number): string => {
    if (hot >= 10000) {
      return `${(hot / 10000).toFixed(1)}万`
    }
    return hot.toString()
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      '科技': 'bg-blue-500',
      '娱乐': 'bg-pink-500',
      '体育': 'bg-green-500',
      '财经': 'bg-yellow-500',
      '军事': 'bg-red-500',
      '社会': 'bg-purple-500',
      '国际': 'bg-indigo-500',
      '时政': 'bg-gray-500'
    }
    return colors[category] || 'bg-gray-400'
  }

  const parameters = [
    { name: 'limit', type: 'number', required: false, description: '返回新闻条数，默认20', example: '10' },
    { name: 'category', type: 'string', required: false, description: '新闻分类', example: '科技' }
  ]

  const examples = [
    {
      title: '获取今日头条',
      description: '获取今日头条热门新闻',
      url: `${baseUrl}/v2/toutiao`
    },
    {
      title: '科技新闻',
      description: '获取科技类新闻',
      url: `${baseUrl}/v2/toutiao?category=科技`
    },
    {
      title: '限制条数',
      description: '只获取前10条新闻',
      url: `${baseUrl}/v2/toutiao?limit=10`
    }
  ]

  return (
    <ApiPageLayout
      title="今日头条"
      description="获取今日头条热门新闻资讯，掌握最新时事动态"
      endpoint="/v2/toutiao"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              今日头条新闻
            </CardTitle>
            <CardDescription>
              获取今日头条最新热门新闻资讯
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGetNews} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  加载中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新新闻
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 结果展示 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                热门新闻
                {result.updateTime && (
                  <Badge variant="secondary" className="ml-auto">
                    <Clock className="w-3 h-3 mr-1" />
                    {result.updateTime}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.code === 200 ? (
                <div className="space-y-4">
                  {result.data?.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:border-blue-300"
                    >
                      <div className="flex gap-4">
                        {/* 新闻图片 */}
                        {item.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-24 h-18 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>
                        )}

                        {/* 新闻内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 leading-relaxed line-clamp-2">
                              {item.title}
                            </h3>
                            {item.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(item.url, '_blank')}
                                className="flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {/* 新闻信息 */}
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            {item.source && (
                              <span className="font-medium">{item.source}</span>
                            )}
                            {item.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{item.time}</span>
                              </div>
                            )}
                            {item.hot !== undefined && (
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatHotValue(item.hot)} 热度</span>
                              </div>
                            )}
                          </div>

                          {/* 分类标签 */}
                          {item.category && (
                            <div className="mt-2">
                              <span className={`
                                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white
                                ${getCategoryColor(item.category)}
                              `}>
                                {item.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!result.data || result.data.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      暂无新闻数据
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取新闻失败，请稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default ToutiaoPage
