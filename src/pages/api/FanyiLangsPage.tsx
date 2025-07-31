import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Languages, Globe } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const FanyiLangsPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      [key: string]: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/fanyi/langs`)
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
      title: "获取支持的语言",
      description: "获取翻译服务支持的语言列表",
      url: `${baseUrl}/v2/fanyi/langs`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "zh-CHS": "中文",
    "en": "英语",
    "ja": "日语",
    "ko": "韩语",
    "fr": "法语",
    "de": "德语",
    "ru": "俄语",
    "es": "西班牙语",
    "pt": "葡萄牙语",
    "it": "意大利语",
    "ar": "阿拉伯语",
    "th": "泰语",
    "vi": "越南语",
    "id": "印尼语",
    "ms": "马来语",
    "hi": "印地语",
    "..."
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="翻译支持语言列表"
      description="获取在线翻译服务支持的所有语言列表（共109种语言）"
      endpoint="/v2/fanyi/langs"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            支持的语言
          </CardTitle>
          <CardDescription>
            点击下方按钮获取翻译服务支持的语言列表
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
                  获取支持语言
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">📊 统计信息</h4>
                  <p className="text-blue-700 text-sm">
                    共支持 <span className="font-bold">{Object.keys(data.data).length}</span> 种语言的翻译
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">支持的语言列表</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(data.data).map(([code, name]) => (
                        <div 
                          key={code}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🌐</span>
                            <span className="font-medium text-gray-900">{name}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded font-mono">
                            {code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">💡 使用提示</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• 语言代码用于翻译API的from和to参数</li>
                    <li>• zh-CHS 表示简体中文，en 表示英语</li>
                    <li>• 支持109种语言之间的相互翻译</li>
                    <li>• 数据来源于有道翻译，与网页端同步</li>
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

export default FanyiLangsPage
