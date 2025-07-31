import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Smile, Quote } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const DuanziPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      index: number;
      duanzi: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/duanzi`)
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
      title: "获取随机段子",
      description: "获取一个随机的搞笑段子",
      url: `${baseUrl}/v2/duanzi`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": {
    "index": 296,
    "duanzi": "一个人最长的恋爱史，大概就是自恋了。"
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="随机搞笑段子"
      description="获取随机的搞笑段子，为生活增添乐趣"
      endpoint="/v2/duanzi"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5" />
            搞笑段子
          </CardTitle>
          <CardDescription>
            点击下方按钮获取一个随机的搞笑段子
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
                  <Smile className="w-4 h-4 mr-2" />
                  获取段子
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
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Quote className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed mb-4 text-lg">
                        {data.data.duanzi}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>� 段子编号: #{data.data.index}</span>
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

export default DuanziPage
