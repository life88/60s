import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, Film } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const MaoyanPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      list: Array<{
        rank: number;
        maoyan_id: number;
        movie_name: string;
        release_year: string;
        box_office: number;
        box_office_desc: string;
      }>;
      tip: string;
      update_time: string;
      update_time_at: number;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/maoyan`)
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
      title: "获取票房排行",
      description: "获取猫眼票房排行榜数据",
      url: `${baseUrl}/v2/maoyan`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": {
    "list": [
      {
        "rank": 1,
        "maoyan_id": 243,
        "movie_name": "阿凡达",
        "release_year": "2009",
        "box_office": 21200972239,
        "box_office_desc": "212.01亿元"
      },
      {
        "rank": 2,
        "maoyan_id": 248172,
        "movie_name": "复仇者联盟 4：终局之战",
        "release_year": "2019",
        "box_office": 20299852689,
        "box_office_desc": "203亿元"
      }
    ],
    "tip": "注：内地票房数据实时更新，包括点映及预售票房。",
    "update_time": "2025/02/18 11:00:00",
    "update_time_at": 1739847600000
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="猫眼票房排行榜"
      description="获取猫眼电影票房排行榜，了解电影市场动态"
      endpoint="/v2/maoyan"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            票房排行榜
          </CardTitle>
          <CardDescription>
            点击下方按钮获取猫眼最新票房排行数据
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
                  获取票房排行
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
                  <h3 className="text-lg font-semibold">猫眼票房排行榜</h3>
                  <span className="text-sm text-gray-500">
                    更新时间: {data.data.update_time}
                  </span>
                </div>

                {data.data.tip && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">{data.data.tip}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {data.data.list.map((movie) => (
                    <Card key={movie.maoyan_id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                            movie.rank <= 3 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                              : movie.rank <= 10
                                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {movie.rank}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                                  {movie.movie_name}
                                </h4>
                                <p className="text-sm text-gray-500 mb-2">
                                  上映年份: {movie.release_year}
                                </p>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">总票房:</span>
                                    <span className="font-bold text-red-600 text-lg">{movie.box_office_desc}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">精确值:</span>
                                    <span className="font-mono text-sm text-gray-700">{movie.box_office.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1">猫眼ID</div>
                                <div className="text-sm font-mono text-gray-600">{movie.maoyan_id}</div>
                              </div>
                            </div>
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

export default MaoyanPage
