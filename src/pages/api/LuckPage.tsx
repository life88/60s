import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Sparkles, Quote } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const LuckPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      luck_desc: string;
      luck_rank: number;
      luck_tip: string;
      luck_tip_index: number;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/luck`)
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

  const getLevelColor = (luckDesc: string, luckRank: number) => {
    // 根据运势描述和等级来判断颜色
    if (luckDesc.includes('大吉') || luckRank >= 8) {
      return 'text-green-600 bg-green-100' // 大吉
    } else if (luckDesc.includes('中吉') || luckRank >= 6) {
      return 'text-blue-600 bg-blue-100' // 中吉
    } else if (luckDesc.includes('小吉') || luckRank >= 4) {
      return 'text-orange-600 bg-orange-100' // 小吉
    } else if (luckRank >= 2) {
      return 'text-yellow-600 bg-yellow-100' // 平
    } else {
      return 'text-red-600 bg-red-100' // 凶
    }
  }

  const examples = [
    {
      title: "获取运势",
      description: "获取随机的今日运势",
      url: `${baseUrl}/v2/luck`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "luck_desc": "末小吉",
    "luck_rank": 4,
    "luck_tip": "似乎可以遇到能长时间使用的东西，凭直觉去购买",
    "luck_tip_index": 8
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="随机运势"
      description="获取随机的今日运势，为您的一天提供指引"
      endpoint="/v2/luck"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            今日运势
          </CardTitle>
          <CardDescription>
            点击下方按钮获取您的今日运势
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
                  <Sparkles className="w-4 h-4 mr-2" />
                  获取运势
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
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    {data.data.luck_desc && (
                      <div className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${getLevelColor(data.data.luck_desc, data.data.luck_rank)}`}>
                        ✨ {data.data.luck_desc} ✨
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <Quote className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed text-lg font-medium">
                        {data.data.luck_tip}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                        📊 运势等级
                      </h4>
                      <p className="text-gray-700 text-lg font-semibold">
                        {data.data.luck_rank}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h4 className="font-medium text-indigo-700 mb-2 flex items-center gap-2">
                        🎯 运势指数
                      </h4>
                      <p className="text-gray-700 text-lg font-semibold">
                        {data.data.luck_tip_index}
                      </p>
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

export default LuckPage
