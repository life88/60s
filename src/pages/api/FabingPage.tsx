import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Zap, Quote } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const FabingPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      index: number;
      saying: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/fabing`)
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
      title: "获取发病文学",
      description: "获取一段随机的发病文学内容",
      url: `${baseUrl}/v2/fabing`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "content": "发病文学内容...",
    "author": "作者",
    "source": "来源",
    "tags": ["发病", "文学"]
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="随机发病文学"
      description="获取随机的发病文学内容，体验网络文化的独特魅力"
      endpoint="/v2/fabing"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            发病文学
          </CardTitle>
          <CardDescription>
            点击下方按钮获取一段随机的发病文学内容
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
                  <Zap className="w-4 h-4 mr-2" />
                  获取发病文学
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
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Quote className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed mb-4 text-lg font-medium">
                        {data.data.saying}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>编号: #{data.data.index}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default FabingPage
