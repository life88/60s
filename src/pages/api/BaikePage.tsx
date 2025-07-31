import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Search, Book, ExternalLink } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const BaikePage = () => {
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      title?: string;
      summary?: string;
      url?: string;
      image?: string;
      tags?: string[];
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!keyword.trim()) {
      setError('请输入要查询的关键词')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/baike?keyword=${encodeURIComponent(keyword)}`)
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
      title: "基础查询",
      description: "查询百度百科词条信息",
      url: `${baseUrl}/v2/baike?keyword=人工智能`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "title": "人工智能",
    "summary": "人工智能（Artificial Intelligence），英文缩写为AI...",
    "url": "https://baike.baidu.com/item/人工智能",
    "image": "词条配图URL",
    "tags": ["计算机科学", "技术"]
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="百度百科词条"
      description="查询百度百科词条信息，获取权威的知识内容"
      endpoint="/v2/baike"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            百科查询
          </CardTitle>
          <CardDescription>
            输入关键词查询百度百科词条信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">关键词</Label>
              <Input
                id="keyword"
                placeholder="输入要查询的关键词，如：人工智能"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchData()}
              />
            </div>

            <Button 
              onClick={fetchData} 
              disabled={loading || !keyword.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  查询中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  查询百科
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
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{data.data.title}</CardTitle>
                        {data.data.url && (
                          <a 
                            href={data.data.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                          >
                            查看原文
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {data.data.image && (
                        <img 
                          src={data.data.image} 
                          alt={data.data.title} 
                          className="w-20 h-20 object-cover rounded-lg ml-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {data.data.summary && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">简介</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {data.data.summary}
                        </p>
                      </div>
                    )}
                    
                    {data.data.tags && data.data.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">相关标签</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.data.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default BaikePage
