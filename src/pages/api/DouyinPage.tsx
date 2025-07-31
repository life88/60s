import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, Star } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const DouyinPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: Array<{
      title: string;
      hot_value: number;
      cover: string;
      link: string;
      event_time: string;
      event_time_at: number;
      active_time: string;
      active_time_at: number;
    }>;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/douyin`)
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
      title: "获取热搜榜",
      description: "获取抖音实时热搜榜单",
      url: `${baseUrl}/v2/douyin`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": [
    {
      "title": "甲流的治疗方法有哪些",
      "hot_value": 11600607,
      "cover": "https://p3-sign.douyinpic.com/tos-cn-p-0015/oUZEvARUvII4vBQOb1i5WiCDIP13AuAwT49ar~noop.jpeg",
      "link": "https://www.douyin.com/search/%E7%94%B2%E6%B5%81%E7%9A%84%E6%B2%BB%E7%96%97%E6%96%B9%E6%B3%95%E6%9C%89%E5%93%AA%E4%BA%9B",
      "event_time": "2025/01/13 17:12:30",
      "event_time_at": 1736759550,
      "active_time": "2025-01-13 21:29:10",
      "active_time_at": 1736774950000
    }
  ]
}`
    }
  ]

  return (
    <ApiPageLayout
      title="抖音热搜榜"
      description="获取抖音实时热搜榜单，了解当前热门话题"
      endpoint="/v2/douyin"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            实时热搜榜
          </CardTitle>
          <CardDescription>
            点击下方按钮获取抖音最新热搜数据
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
                  <TrendingUp className="w-4 h-4 mr-2" />
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

            {data && data.data && Array.isArray(data.data) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">抖音热搜榜</h3>
                  <span className="text-sm text-gray-500">
                    共 {data.data.length} 条热搜
                  </span>
                </div>

                <div className="space-y-3">
                  {data.data.map((item, index) => (
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
                            {index < 3 && <Star className="w-4 h-4" />}
                            {index >= 3 && (index + 1)}
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
                                  {item.hot_value.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">热度</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>事件时间: {item.event_time}</span>
                              <span>激活时间: {item.active_time}</span>
                            </div>
                            
                            {item.link && (
                              <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2"
                              >
                                在抖音中搜索 →
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

export default DouyinPage
