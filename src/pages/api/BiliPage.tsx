import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, Star } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const BiliPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: Array<{
      title: string;
      link: string;
    }>;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/bili`)
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
      description: "获取哔哩哔哩实时热搜榜单",
      url: `${baseUrl}/v2/bili`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时，用户群: 595941841，开源地址: https://github.com/vikiboss/60s",
  "data": [
    {
      "title": "任天堂在台湾设立子公司",
      "link": "https://search.bilibili.com/all?keyword=%E4%BB%BB%E5%A4%A9%E5%A0%82%E5%9C%A8%E5%8F%B0%E6%B9%BE%E8%AE%BE%E7%AB%8B%E5%AD%90%E5%85%AC%E5%8F%B8"
    },
    {
      "title": "哪吒2冲顶全球动画票房榜首",
      "link": "https://search.bilibili.com/all?keyword=%E5%93%AA%E5%90%922%E5%86%B2%E9%A1%B6%E5%85%A8%E7%90%83%E5%8A%A8%E7%94%BB%E7%A5%A8%E6%88%BF%E6%A6%9C%E9%A6%96"
    }
  ]
}`
    }
  ]

  return (
    <ApiPageLayout
      title="哔哩哔哩热搜榜"
      description="获取哔哩哔哩实时热搜榜单，了解当前热门话题"
      endpoint="/v2/bili"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            实时热搜榜
          </CardTitle>
          <CardDescription>
            点击下方按钮获取哔哩哔哩最新热搜数据
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

            {data && data.data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">哔哩哔哩热搜榜</h3>
                </div>

                <div className="space-y-2">
                  {data.data.map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index < 3 
                              ? 'bg-red-100 text-red-600' 
                              : index < 10 
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {index < 3 && <Star className="w-4 h-4" />}
                            {index >= 3 && (index + 1)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {item.title}
                              </span>
                            </div>
                            {item.link && (
                              <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                              >
                                查看详情 →
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

export default BiliPage
