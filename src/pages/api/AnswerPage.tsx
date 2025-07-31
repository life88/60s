import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, HelpCircle, Quote } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const AnswerPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      question?: string;
      answer: string;
      type?: string;
      advice?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/answer`)
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
      title: "获取答案",
      description: "从答案之书中获取一个随机答案",
      url: `${baseUrl}/v2/answer`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "question": "问题",
    "answer": "答案内容",
    "type": "答案类型",
    "advice": "建议"
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="随机答案之书"
      description="从神秘的答案之书中获取人生问题的指引"
      endpoint="/v2/answer"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            答案之书
          </CardTitle>
          <CardDescription>
            在心中默想一个问题，然后点击下方按钮获取答案
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💭 使用方法</h4>
              <p className="text-blue-700 text-sm">
                在心中默念一个是非题（可以用"是"或"否"回答的问题），然后点击按钮获取神秘的答案。
              </p>
            </div>

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
                  <HelpCircle className="w-4 h-4 mr-2" />
                  询问答案之书
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
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <HelpCircle className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-800">📖 答案之书的回应</h3>
                  </div>

                  {data.data.question && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-indigo-200">
                      <h4 className="font-medium text-indigo-700 mb-2">❓ 问题</h4>
                      <p className="text-gray-700">
                        {data.data.question}
                      </p>
                    </div>
                  )}

                  <div className="mb-4 p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <Quote className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-indigo-700 mb-2">✨ 答案</h4>
                        <p className="text-gray-800 text-lg font-medium leading-relaxed">
                          {data.data.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {data.data.type && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-indigo-200">
                      <h4 className="font-medium text-indigo-700 mb-2">🏷️ 类型</h4>
                      <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        {data.data.type}
                      </span>
                    </div>
                  )}

                  {data.data.advice && (
                    <div className="p-4 bg-white rounded-lg border border-indigo-200">
                      <h4 className="font-medium text-indigo-700 mb-2">💡 建议</h4>
                      <p className="text-gray-700 text-sm">
                        {data.data.advice}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-center text-xs text-gray-500">
                    ⚠️ 仅供娱乐，请理性看待
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

export default AnswerPage
