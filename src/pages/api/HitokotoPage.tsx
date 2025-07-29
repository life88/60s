import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Quote, Heart, Share2 } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const HitokotoPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      text?: string;
      from?: string;
      type?: string;
      author?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<{
    text: string;
    from?: string;
    author?: string;
    timestamp: number;
  }>>([])

  const fetchHitokoto = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/hitokoto`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
      
      // 添加到历史记录
      if (result.data?.text) {
        setHistory(prev => [{
          text: result.data.text,
          from: result.data.from,
          author: result.data.author,
          timestamp: Date.now()
        }, ...prev.slice(0, 9)]) // 只保留最近10条
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取失败')
    } finally {
      setLoading(false)
    }
  }

  const shareQuote = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: '一言分享',
        text: text
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const examples = [
    {
      title: "获取随机一言",
      description: "获取一条随机的励志或唯美句子",
      url: `${baseUrl}/v2/hitokoto`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "text": "愿你被这个世界温柔相待",
    "from": "网络",
    "type": "励志",
    "author": "佚名"
  }
}`
    }
  ]

  const typeColors: { [key: string]: string } = {
    '励志': 'bg-blue-100 text-blue-800',
    '爱情': 'bg-pink-100 text-pink-800',
    '友情': 'bg-green-100 text-green-800',
    '生活': 'bg-yellow-100 text-yellow-800',
    '学习': 'bg-purple-100 text-purple-800',
    '默认': 'bg-gray-100 text-gray-800'
  }

  return (
    <ApiPageLayout
      title="一言"
      description="获取随机的励志、唯美句子，为生活增添一份诗意"
      endpoint="/v2/hitokoto"
      examples={examples}
    >
      <div className="space-y-6">
        {/* 主要功能区 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5" />
              随机一言
            </CardTitle>
            <CardDescription>
              点击按钮获取一条随机的美句
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={fetchHitokoto} 
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
                    <Quote className="w-4 h-4 mr-2" />
                    获取一言
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
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <div className="space-y-4">
                    {/* 句子内容 */}
                    <blockquote className="text-lg font-medium text-gray-800 leading-relaxed">
                      "{data.data.text}"
                    </blockquote>
                    
                    {/* 元信息 */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      {data.data.type && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          typeColors[data.data.type] || typeColors['默认']
                        }`}>
                          {data.data.type}
                        </span>
                      )}
                      {data.data.from && (
                        <span>—— 《{data.data.from}》</span>
                      )}
                      {data.data.author && (
                        <span>{data.data.author}</span>
                      )}
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareQuote(data.data!.text || '')}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        分享
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // 简单的喜欢功能，可以扩展为收藏
                          console.log('liked:', data.data?.text)
                        }}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        喜欢
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 历史记录 */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">最近获取</CardTitle>
              <CardDescription>
                最近获取的一言记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-medium text-gray-800 mb-1">"{item.text}"</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {item.from && `《${item.from}》`}
                        {item.author && ` ${item.author}`}
                      </span>
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default HitokotoPage
