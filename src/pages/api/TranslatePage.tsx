import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, Languages, ArrowRight } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const TranslatePage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      from?: string;
      to?: string;
      text?: string;
      result?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    text: '你好世界',
    from: 'zh',
    to: 'en'
  })

  const fetchTranslation = async () => {
    if (!formData.text.trim()) {
      setError('请输入要翻译的文本')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        text: formData.text,
        from: formData.from,
        to: formData.to
      })
      
      const response = await fetch(`${baseUrl}/v2/fanyi?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '翻译失败')
    } finally {
      setLoading(false)
    }
  }

  const parameters = [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: '要翻译的文本内容',
      example: '你好世界'
    },
    {
      name: 'from',
      type: 'string',
      required: true,
      description: '源语言代码',
      example: 'zh'
    },
    {
      name: 'to',
      type: 'string',
      required: true,
      description: '目标语言代码',
      example: 'en'
    }
  ]

  const examples = [
    {
      title: "中文翻译英文",
      description: "将中文文本翻译为英文",
      url: `${baseUrl}/v2/fanyi?text=你好世界&from=zh&to=en`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "from": "zh",
    "to": "en",
    "text": "你好世界",
    "result": "Hello World"
  }
}`
    },
    {
      title: "英文翻译中文",
      description: "将英文文本翻译为中文",
      url: `${baseUrl}/v2/fanyi?text=Hello World&from=en&to=zh`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "from": "en",
    "to": "zh",
    "text": "Hello World",
    "result": "你好世界"
  }
}`
    }
  ]

  const commonLanguages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: '英文' },
    { code: 'ja', name: '日文' },
    { code: 'ko', name: '韩文' },
    { code: 'fr', name: '法文' },
    { code: 'de', name: '德文' },
    { code: 'es', name: '西班牙文' },
    { code: 'ru', name: '俄文' }
  ]

  return (
    <ApiPageLayout
      title="智能翻译"
      description="支持多语言互译的智能翻译服务"
      endpoint="/v2/fanyi"
      parameters={parameters}
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            在线翻译
          </CardTitle>
          <CardDescription>
            输入文本并选择语言进行翻译
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 翻译表单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 源语言 */}
              <div>
                <label className="text-sm font-medium block mb-2">源语言</label>
                <select
                  value={formData.from}
                  onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {commonLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              {/* 目标语言 */}
              <div>
                <label className="text-sm font-medium block mb-2">目标语言</label>
                <select
                  value={formData.to}
                  onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {commonLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 输入文本 */}
            <div>
              <label className="text-sm font-medium block mb-2">要翻译的文本</label>
              <Input
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="输入要翻译的文本..."
                className="h-12"
              />
            </div>

            {/* 翻译按钮 */}
            <Button 
              onClick={fetchTranslation} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  翻译中...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4 mr-2" />
                  开始翻译
                </>
              )}
            </Button>

            {/* 错误信息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">翻译失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {/* 翻译结果 */}
            {data && data.data && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  翻译结果
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">原文</label>
                    <p className="text-sm bg-white p-2 rounded border">{data.data.text}</p>
                    <p className="text-xs text-gray-500">语言: {data.data.from}</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">译文</label>
                    <p className="text-sm bg-white p-2 rounded border font-medium">{data.data.result}</p>
                    <p className="text-xs text-gray-500">语言: {data.data.to}</p>
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

export default TranslatePage
