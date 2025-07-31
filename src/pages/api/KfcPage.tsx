import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Coffee, Quote } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const KfcPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      index: number;
      kfc: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/kfc`)
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
      title: "获取KFC文案",
      description: "获取一条随机的KFC疯狂星期四文案",
      url: `${baseUrl}/v2/kfc`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "index": 1,
    "kfc": "疯狂星期四文案内容...",
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="KFC 疯狂星期四"
      description="获取随机的KFC疯狂星期四文案，体验网络梗文化"
      endpoint="/v2/kfc"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            疯狂星期四
          </CardTitle>
          <CardDescription>
            点击下方按钮获取一条随机的KFC疯狂星期四文案
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">🍗 关于疯狂星期四</h4>
              <p className="text-red-700 text-sm">
                "疯狂星期四"是KFC的促销活动，后来演变成网络梗文化，
                以夸张、幽默的文案形式在社交媒体上广泛传播。
              </p>
            </div>

            <Button 
              onClick={fetchData} 
              disabled={loading}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <Coffee className="w-4 h-4 mr-2" />
                  获取疯狂星期四文案
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
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                      <Coffee className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-red-800">🍗 疯狂星期四文案</h3>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <Quote className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed mb-4 text-lg font-medium">
                        {data.data.kfc}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>编号: #{data.data.index}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-700">
                      <span className="text-lg">🍗</span>
                      <span className="text-sm font-medium">
                        记得今天是星期四，去KFC疯狂一下！
                      </span>
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

export default KfcPage
