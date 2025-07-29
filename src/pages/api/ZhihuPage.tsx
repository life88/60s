import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, RefreshCw, AlertCircle, ExternalLink, Clock, MessageSquare } from 'lucide-react'
import { baseUrl } from '@/lib/config'
import { ApiPageLayout } from '@/components/ApiPageLayout'

interface ZhihuItem {
  title: string
  url: string
  answerCount?: number
  heat?: number
  excerpt?: string
  rank: number
}

interface ZhihuResponse {
  code: number
  data: ZhihuItem[]
  updateTime?: string
}

const ZhihuPage = () => {
  const [result, setResult] = useState<ZhihuResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGetZhihu = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}/v2/zhihu`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取知乎热榜失败:', error)
      alert('获取知乎热榜失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时自动获取数据
  useEffect(() => {
    handleGetZhihu()
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toString()
  }

  const getRankColor = (rank: number): string => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-orange-500'
    if (rank <= 10) return 'bg-gradient-to-r from-blue-500 to-purple-500'
    if (rank <= 20) return 'bg-gradient-to-r from-green-400 to-blue-500'
    return 'bg-gray-500'
  }

  const parameters = [
    { name: 'limit', type: 'number', required: false, description: '返回热榜条数，默认50', example: '20' }
  ]

  const examples = [
    {
      title: '获取知乎热榜',
      description: '获取当前知乎热榜问题',
      url: `${baseUrl}/v2/zhihu`
    },
    {
      title: '限制返回条数',
      description: '只获取前20条热榜',
      url: `${baseUrl}/v2/zhihu?limit=20`
    }
  ]

  return (
    <ApiPageLayout
      title="知乎热榜"
      description="实时获取知乎热榜问题，发现当前最受关注的话题和讨论"
      endpoint="/v2/zhihu"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              知乎热榜
            </CardTitle>
            <CardDescription>
              获取知乎热榜问题，了解当前最热门的讨论话题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGetZhihu} 
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
                  刷新热榜
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
                <MessageSquare className="w-5 h-5" />
                热榜问题
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
                      <div className="flex items-start gap-3">
                        {/* 排名徽章 */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md
                          ${getRankColor(item.rank || index + 1)}
                        `}>
                          {item.rank || index + 1}
                        </div>

                        {/* 问题内容 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 leading-relaxed mb-2">
                            {item.title}
                          </h3>
                          
                          {/* 摘要 */}
                          {item.excerpt && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {item.excerpt}
                            </p>
                          )}

                          {/* 统计信息 */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {item.answerCount !== undefined && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{formatNumber(item.answerCount)} 回答</span>
                              </div>
                            )}
                            {item.heat !== undefined && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{formatNumber(item.heat)} 热度</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 查看链接 */}
                        {item.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(item.url, '_blank')}
                            className="flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            查看
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {(!result.data || result.data.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      暂无热榜数据
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取热榜失败，请稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default ZhihuPage


