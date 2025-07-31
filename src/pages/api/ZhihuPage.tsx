import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, RefreshCw, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react'
import { baseUrl } from '@/lib/config'
import { ApiPageLayout } from '@/components/ApiPageLayout'

interface ZhihuItem {
  title: string
  detail: string
  cover: string
  hot_value_desc: string
  answer_cnt: number
  follower_cnt: number
  comment_cnt: number
  created_at: number
  created: string
  link: string
}

interface ZhihuResponse {
  code: number
  message: string
  data: ZhihuItem[]
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
      url: `${baseUrl}/v2/zhihu`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时，用户群: 595941841，开源地址: https://github.com/vikiboss/60s",
  "data": [
    {
      "title": "重庆观音桥一夜之间大量观赏鱼离奇死亡，警方通报「系人为投毒」，有哪些细节值得关注？",
      "detail": "1月13日，重庆市公安局江北区分局通报，江北嘉陵公园观赏鱼池中大量观赏鱼死亡案件已查明，系该公园一游乐项目经营者李某（男，48岁）所为。",
      "cover": "https://picx.zhimg.com/80/v2-ec048ba8103dd08f9ad248af633391b5_1440w.webp?source=1def8aca",
      "hot_value_desc": "1094 万热度",
      "answer_cnt": 181,
      "follower_cnt": 450,
      "comment_cnt": 0,
      "created_at": 1736676753000,
      "created": "2025/01/12 18:12:33",
      "link": "https://api.zhihu.com/questions/9408823731"
    }
  ]
}`
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
                          ${getRankColor(index + 1)}
                        `}>
                          {index + 1}
                        </div>

                        {/* 问题内容 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 leading-relaxed mb-2">
                            {item.title}
                          </h3>
                          
                          {/* 话题详情 */}
                          {item.detail && (
                            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                              {item.detail.length > 200 ? item.detail.substring(0, 200) + '...' : item.detail}
                            </p>
                          )}

                          {/* 统计信息 */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{item.answer_cnt} 回答</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{item.hot_value_desc}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{item.follower_cnt} 关注</span>
                            </div>
                          </div>

                          {/* 封面图片 */}
                          {item.cover && (
                            <img 
                              src={item.cover} 
                              alt={item.title}
                              className="w-full max-w-sm h-32 object-cover rounded mt-2"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                        </div>

                        {/* 查看链接 */}
                        {item.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(item.link, '_blank')}
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


