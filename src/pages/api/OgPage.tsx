import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Link, ExternalLink, Share2 } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const OgPage = () => {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      url: string;
      title?: string;
      description?: string;
      image?: string;
      site_name?: string;
      type?: string;
      locale?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!url.trim()) {
      setError('请输入要获取信息的链接')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/og?url=${encodeURIComponent(url)}`)
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
      title: "获取链接信息",
      description: "获取网页的 Open Graph 元信息",
      url: `${baseUrl}/v2/og?url=https://example.com`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "url": "https://example.com",
    "title": "网页标题",
    "description": "网页描述",
    "image": "预览图片URL",
    "site_name": "网站名称",
    "type": "website",
    "locale": "zh_CN"
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="链接 OG 信息"
      description="获取网页的 Open Graph 元信息，包括标题、描述、预览图等"
      endpoint="/v2/og"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            链接信息获取
          </CardTitle>
          <CardDescription>
            输入网页链接获取其 Open Graph 元信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">网页链接</Label>
              <Input
                id="url"
                placeholder="输入网页链接，如：https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchData()}
              />
            </div>

            <Button 
              onClick={fetchData} 
              disabled={loading || !url.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  获取链接信息
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
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* 预览图片 */}
                  {data.data.image && (
                    <div className="aspect-video w-full bg-gray-100">
                      <img 
                        src={data.data.image} 
                        alt="预览图"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.parentElement!.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* 标题 */}
                    {data.data.title && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {data.data.title}
                        </h3>
                      </div>
                    )}

                    {/* 描述 */}
                    {data.data.description && (
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {data.data.description}
                        </p>
                      </div>
                    )}

                    {/* 元信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        {data.data.site_name && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">网站名称</h4>
                            <p className="text-sm text-gray-900">{data.data.site_name}</p>
                          </div>
                        )}
                        
                        {data.data.type && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">内容类型</h4>
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {data.data.type}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {data.data.locale && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">语言地区</h4>
                            <p className="text-sm text-gray-900">{data.data.locale}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">原始链接</h4>
                          <a 
                            href={data.data.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 break-all"
                          >
                            {data.data.url}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
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

export default OgPage
