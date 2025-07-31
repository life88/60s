import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Cloud, MapPin, Thermometer, Calendar } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const Weather7dPage = () => {
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      city: string;
      forecast: Array<{
        date: string;
        weather: string;
        temperature_high: string;
        temperature_low: string;
        wind?: string;
        humidity?: string;
        air_quality?: string;
      }>;
      update_time?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!city.trim()) {
      setError('请输入城市名称')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/weather/7d?city=${encodeURIComponent(city)}`)
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

  const getWeatherEmoji = (weather: string) => {
    if (weather.includes('晴')) return '☀️'
    if (weather.includes('云') || weather.includes('阴')) return '☁️'
    if (weather.includes('雨')) return '🌧️'
    if (weather.includes('雪')) return '❄️'
    if (weather.includes('雾')) return '🌫️'
    if (weather.includes('风')) return '💨'
    return '🌤️'
  }

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }

  const examples = [
    {
      title: "查询7天天气",
      description: "查询指定城市的7天天气预报",
      url: `${baseUrl}/v2/weather/7d?city=北京`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "city": "北京",
    "forecast": [
      {
        "date": "2024-01-01",
        "weather": "晴",
        "temperature_high": "10°C",
        "temperature_low": "0°C",
        "wind": "南风 3级",
        "humidity": "60%",
        "air_quality": "良"
      }
    ],
    "update_time": "2024-01-01 12:00:00"
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="7天天气预报"
      description="查询指定城市的未来7天详细天气预报"
      endpoint="/v2/weather/7d"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            7天天气预报
          </CardTitle>
          <CardDescription>
            输入城市名称查询未来7天的天气预报
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">城市名称</Label>
              <Input
                id="city"
                placeholder="输入城市名称，如：北京、上海"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchData()}
              />
            </div>

            <Button 
              onClick={fetchData} 
              disabled={loading || !city.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  查询中...
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 mr-2" />
                  查询7天天气
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">查询失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {data && data.data && (
              <div className="space-y-4">
                {/* 城市信息 */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-blue-800">{data.data.city}</h3>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          7天预报
                        </span>
                      </div>
                      {data.data.update_time && (
                        <span className="text-sm text-blue-600">
                          更新: {data.data.update_time}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 7天天气预报 */}
                <div className="grid gap-3">
                  {data.data.forecast.map((forecast, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <div className="text-sm text-gray-600">
                                {index === 0 ? '今天' : getDayOfWeek(forecast.date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {forecast.date.split('-').slice(1).join('/')}
                              </div>
                            </div>

                            <div className="text-3xl">
                              {getWeatherEmoji(forecast.weather)}
                            </div>

                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">
                                {forecast.weather}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                {forecast.wind && (
                                  <span>💨 {forecast.wind}</span>
                                )}
                                {forecast.humidity && (
                                  <span>💧 {forecast.humidity}</span>
                                )}
                                {forecast.air_quality && (
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    forecast.air_quality === '优' ? 'bg-green-100 text-green-700' :
                                    forecast.air_quality === '良' ? 'bg-blue-100 text-blue-700' :
                                    forecast.air_quality === '轻度污染' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    空气 {forecast.air_quality}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-red-500" />
                              <span className="font-bold text-red-600">
                                {forecast.temperature_high}
                              </span>
                              <span className="text-gray-400">/</span>
                              <span className="font-bold text-blue-600">
                                {forecast.temperature_low}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">📊 天气预报说明</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• 预报数据仅供参考，实际天气可能有所变化</li>
                    <li>• 温度显示格式：最高温度 / 最低温度</li>
                    <li>• 建议根据天气情况合理安排出行计划</li>
                    <li>• 关注空气质量，雾霾天气请做好防护</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default Weather7dPage
