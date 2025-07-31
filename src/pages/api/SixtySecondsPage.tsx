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
      date: string;
      news: string[];
      audio: {
        music: string;
        news: string;
      };
      image: string;
      tip: string;
      cover: string;
      link: string;
      created: string;
      created_at: number;
      updated: string;
      updated_at: number;
      day_of_week: string;
      lunar_date: string;
      api_updated: string;
      api_updated_at: number;
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
  "message": "获取成功。数据来自官方/权威源头，以确保稳定与实时",
  "data": {
    "date": "2025-07-31",
    "news": [
      "1、新闻内容1...",
      "2、新闻内容2...",
      "..."
    ],
    "audio": {
      "music": "",
      "news": ""
    },
    "image": "封面图片URL",
    "tip": "每日一句正能量话语",
    "cover": "封面图片URL",
    "link": "原文链接",
    "created": "2025/07/31 01:41:46",
    "created_at": 1753897306000,
    "updated": "2025/07/31 01:41:46", 
    "updated_at": 1753897306000,
    "day_of_week": "星期四",
    "lunar_date": "乙巳年闰六月初七",
    "api_updated": "2025/07/31 21:59:35",
    "api_updated_at": 1753970375600
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

            {data && data.data && (
              <div className="space-y-4">
                {/* 日期和农历信息 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{data.data.date} {data.data.day_of_week}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{data.data.lunar_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4" />
                    <span>更新: {data.data.api_updated}</span>
                  </div>
                </div>

                {/* 封面图片 */}
                {data.data.cover && (
                  <div>
                    <h4 className="font-medium mb-2">封面图片</h4>
                    <img 
                      src={data.data.cover} 
                      alt="每日封面" 
                      className="w-full max-w-md rounded-lg shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* 新闻列表 */}
                {data.data.news && (
                  <div>
                    <h3 className="font-medium mb-3">今日新闻</h3>
                    <div className="space-y-2">
                      {data.data.news.map((item: string, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border text-sm leading-relaxed">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 每日一句 */}
                {data.data.tip && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">每日一句</h4>
                    <p className="text-blue-700 text-sm italic">"{data.data.tip}"</p>
                  </div>
                )}

                {/* 原文链接 */}
                {data.data.link && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">原文链接</h4>
                    <a 
                      href={data.data.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {data.data.link}
                    </a>
                  </div>
                )}

                {/* 底部图片 */}
                {data.data.image && data.data.image !== data.data.cover && (
                  <div>
                    <h4 className="font-medium mb-2">配图</h4>
                    <img 
                      src={data.data.image} 
                      alt="配图" 
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
