import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Calendar, Clock, Globe } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const SixtySecondsPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      date?: string;
      news?: string[];
      tip?: string;
      image?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/60s`)
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
      title: "基础调用",
      description: "获取今日的60秒读懂世界新闻摘要",
      url: `${baseUrl}/v2/60s`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "date": "2024年1月1日",
    "news": [
      "1、新闻内容1...",
      "2、新闻内容2...",
      "..."
    ],
    "tip": "每日一句正能量话语",
    "image": "封面图片URL"
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="每日60秒读懂世界"
      description="获取每日精选新闻摘要，快速了解世界大事"
      endpoint="/v2/60s"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            实时数据展示
          </CardTitle>
          <CardDescription>
            点击下方按钮获取今日的新闻摘要
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
                  <Globe className="w-4 h-4 mr-2" />
                  获取今日新闻
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">获取失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {data && (
              <div className="space-y-4">
                {/* 日期 */}
                {data.data?.date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{data.data.date}</span>
                  </div>
                )}

                {/* 新闻列表 */}
                {data.data?.news && (
                  <div>
                    <h3 className="font-medium mb-3">今日新闻</h3>
                    <div className="space-y-2">
                      {data.data.news.map((item: string, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 每日一句 */}
                {data.data?.tip && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">每日一句</h4>
                    <p className="text-blue-700 text-sm italic">"{data.data.tip}"</p>
                  </div>
                )}

                {/* 封面图片 */}
                {data.data?.image && (
                  <div>
                    <h4 className="font-medium mb-2">封面图片</h4>
                    <img 
                      src={data.data.image} 
                      alt="每日封面" 
                      className="w-full max-w-md rounded-lg shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
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

export default SixtySecondsPage
