import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Cloud, MapPin, Thermometer } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const WeatherPage = () => {
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      city: string;
      weather: string;
      temperature: string;
      humidity?: string;
      wind?: string;
      pressure?: string;
      visibility?: string;
      update_time?: string;
      forecast?: Array<{
        date: string;
        weather: string;
        temperature_high: string;
        temperature_low: string;
      }>;
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
      const response = await fetch(`${baseUrl}/v2/weather?city=${encodeURIComponent(city)}`)
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

  const examples = [
    {
      title: "查询天气",
      description: "查询指定城市的天气信息",
      url: `${baseUrl}/v2/weather?city=北京`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "city": "北京",
    "weather": "晴",
    "temperature": "25°C",
    "humidity": "60%",
    "wind": "南风 3级",
    "pressure": "1013hPa",
    "visibility": "10km",
    "update_time": "2024-01-01 12:00:00",
    "forecast": [...]
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="天气查询"
      description="查询指定城市的实时天气信息和预报"
      endpoint="/v2/weather"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            天气查询
          </CardTitle>
          <CardDescription>
            输入城市名称查询天气信息
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
                  查询天气
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
                {/* 当前天气 */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xl font-bold text-blue-800">{data.data.city}</h3>
                      </div>
                      {data.data.update_time && (
                        <span className="text-sm text-blue-600">
                          {data.data.update_time}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl">
                        {getWeatherEmoji(data.data.weather)}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-900">
                          {data.data.temperature}
                        </div>
                        <div className="text-lg text-blue-700">
                          {data.data.weather}
                        </div>
                      </div>
                    </div>

                    {/* 详细信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {data.data.humidity && (
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                          <div className="text-2xl mb-1">💧</div>
                          <div className="text-sm text-gray-600">湿度</div>
                          <div className="font-medium">{data.data.humidity}</div>
                        </div>
                      )}

                      {data.data.wind && (
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                          <div className="text-2xl mb-1">💨</div>
                          <div className="text-sm text-gray-600">风力</div>
                          <div className="font-medium text-sm">{data.data.wind}</div>
                        </div>
                      )}

                      {data.data.pressure && (
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                          <div className="text-2xl mb-1">📊</div>
                          <div className="text-sm text-gray-600">气压</div>
                          <div className="font-medium">{data.data.pressure}</div>
                        </div>
                      )}

                      {data.data.visibility && (
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                          <div className="text-2xl mb-1">👁️</div>
                          <div className="text-sm text-gray-600">能见度</div>
                          <div className="font-medium">{data.data.visibility}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 天气预报 */}
                {data.data.forecast && data.data.forecast.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5" />
                        天气预报
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {data.data.forecast.map((forecast, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-xl">
                                {getWeatherEmoji(forecast.weather)}
                              </div>
                              <div>
                                <div className="font-medium">{forecast.date}</div>
                                <div className="text-sm text-gray-600">{forecast.weather}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {forecast.temperature_high} / {forecast.temperature_low}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default WeatherPage
