import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, RefreshCw, AlertCircle, ExternalLink, Clock, Flame } from 'lucide-react'
import { baseUrl } from '@/lib/config'
import { ApiPageLayout } from '@/components/ApiPageLayout'

interface WeiboItem {
  title: string
  url: string
  hot: number
  rank: number
  category?: string
  icon?: string
}

interface WeiboResponse {
  code: number
  data: WeiboItem[]
  updateTime?: string
}

const WeiboPage = () => {
  const [result, setResult] = useState<WeiboResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGetWeibo = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}/v2/weibo`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取微博热搜失败:', error)
      alert('获取微博热搜失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时自动获取数据
  useEffect(() => {
    handleGetWeibo()
  }, [])

  const formatHotValue = (hot: number): string => {
    if (hot >= 100000000) {
      return `${(hot / 100000000).toFixed(1)}亿`
    } else if (hot >= 10000) {
      return `${(hot / 10000).toFixed(1)}万`
    }
    return hot.toString()
  }

  const getHotColor = (rank: number): string => {
    if (rank <= 3) return 'bg-red-500'
    if (rank <= 10) return 'bg-orange-500'
    if (rank <= 20) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const parameters = [
    { name: 'limit', type: 'number', required: false, description: '返回热搜条数，默认50', example: '20' }
  ]

  const examples = [
    {
      title: '获取微博热搜',
      description: '获取当前微博热搜榜单',
      url: `${baseUrl}/v2/weibo`
    },
    {
      title: '限制返回条数',
      description: '只获取前20条热搜',
      url: `${baseUrl}/v2/weibo?limit=20`
    }
  ]

  return (
    <ApiPageLayout
      title="微博热搜"
      description="实时获取微博热搜榜单，了解当前热门话题和趋势"
      endpoint="/v2/weibo"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              微博热搜榜
            </CardTitle>
            <CardDescription>
              实时获取微博热搜话题，掌握当前热点
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGetWeibo} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  刷新中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新热搜
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
                <Flame className="w-5 h-5" />
                热搜榜单
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
                <div className="space-y-3">
                  {result.data?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      {/* 排名 */}
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                        ${getHotColor(item.rank || index + 1)}
                      `}>
                        {item.rank || index + 1}
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.title}
                          </h3>
                          {item.category && (
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                          {item.icon && (
                            <span className="text-sm">{item.icon}</span>
                          )}
                        </div>
                        {item.hot > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <TrendingUp className="w-3 h-3" />
                            <span>{formatHotValue(item.hot)} 热度</span>
                          </div>
                        )}
                      </div>

                      {/* 链接 */}
                      {item.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.url, '_blank')}
                          className="flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {(!result.data || result.data.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      暂无热搜数据
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取热搜失败，请稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default WeiboPage


