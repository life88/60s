import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Calendar, Moon } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const LunarPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      date: string;
      lunar_date: string;
      lunar_month: string;
      lunar_day: string;
      lunar_year: string;
      zodiac: string;
      gan_zhi: string;
      festival?: string;
      solar_term?: string;
      constellation?: string;
      day_of_week: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/lunar`)
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
      title: "获取农历信息",
      description: "获取今日的农历日期和相关信息",
      url: `${baseUrl}/v2/lunar`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "date": "2024-01-01",
    "lunar_date": "农历十一月二十",
    "lunar_month": "十一月",
    "lunar_day": "二十",
    "lunar_year": "癸卯年",
    "zodiac": "兔",
    "gan_zhi": "癸卯",
    "festival": "节日名称",
    "solar_term": "节气",
    "constellation": "星座",
    "day_of_week": "星期一"
  }
}`
    }
  ]

  const getZodiacEmoji = (zodiac: string) => {
    const zodiacMap: { [key: string]: string } = {
      '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰', '龙': '🐲', '蛇': '🐍',
      '马': '🐴', '羊': '🐑', '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷'
    }
    return zodiacMap[zodiac] || '🐾'
  }

  return (
    <ApiPageLayout
      title="农历信息"
      description="获取今日的农历日期、生肖、干支、节气等传统历法信息"
      endpoint="/v2/lunar"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            农历查询
          </CardTitle>
          <CardDescription>
            点击下方按钮获取今日的农历信息
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
                  <Calendar className="w-4 h-4 mr-2" />
                  获取农历信息
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
                {/* 主要信息卡片 */}
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-red-800 mb-2">
                        {data.data.lunar_date}
                      </h3>
                      <p className="text-red-600">
                        {data.data.date} ({data.data.day_of_week})
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                        <div className="text-2xl mb-1">{getZodiacEmoji(data.data.zodiac)}</div>
                        <div className="text-sm text-gray-600">生肖</div>
                        <div className="font-medium">{data.data.zodiac}年</div>
                      </div>

                      <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                        <div className="text-2xl mb-1">🗓️</div>
                        <div className="text-sm text-gray-600">农历年份</div>
                        <div className="font-medium">{data.data.lunar_year}</div>
                      </div>

                      <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                        <div className="text-2xl mb-1">📅</div>
                        <div className="text-sm text-gray-600">农历月日</div>
                        <div className="font-medium">{data.data.lunar_month}</div>
                        <div className="text-xs text-gray-500">{data.data.lunar_day}</div>
                      </div>

                      <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                        <div className="text-2xl mb-1">🔮</div>
                        <div className="text-sm text-gray-600">干支</div>
                        <div className="font-medium">{data.data.gan_zhi}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 其他信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.data.constellation && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">⭐</div>
                          <div>
                            <h4 className="font-medium text-gray-700">星座</h4>
                            <p className="text-lg font-semibold">{data.data.constellation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {data.data.solar_term && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🌱</div>
                          <div>
                            <h4 className="font-medium text-gray-700">节气</h4>
                            <p className="text-lg font-semibold">{data.data.solar_term}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {data.data.festival && (
                    <Card className="md:col-span-2">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🎉</div>
                          <div>
                            <h4 className="font-medium text-gray-700">节日</h4>
                            <p className="text-lg font-semibold text-red-600">{data.data.festival}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">📖 农历小知识</h4>
                  <div className="text-amber-700 text-sm space-y-1">
                    <p>• 农历是中国传统的阴阳历，结合了太阳与月亮的运行规律</p>
                    <p>• 干支纪年是中国古代的纪年方法，由十天干和十二地支组成</p>
                    <p>• 二十四节气反映了太阳在黄道上的位置变化，指导农业生产</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default LunarPage
