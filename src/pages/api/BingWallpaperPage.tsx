import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Image, Download, RefreshCw, AlertCircle, Eye, Calendar } from 'lucide-react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { baseUrl } from '@/lib/config'

interface BingWallpaperResponse {
  code: number
  data: {
    url: string
    title: string
    copyright: string
    date: string
    story?: string
    quiz?: string
    wp?: boolean
    hsh?: string
    drk?: number
    top?: number
    bot?: number
  }
}

const BingWallpaperPage = () => {
  const [result, setResult] = useState<BingWallpaperResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [date, setDate] = useState('')

  const handleGetWallpaper = async () => {
    setLoading(true)
    setImageLoading(true)
    try {
      const url = date 
        ? `${baseUrl}/v2/bing?date=${date}`
        : `${baseUrl}/v2/bing`
      
      const response = await fetch(url)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取必应壁纸失败:', error)
      alert('获取必应壁纸失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时自动获取今日壁纸
  useEffect(() => {
    const fetchInitialWallpaper = async () => {
      setLoading(true)
      setImageLoading(true)
      try {
        const response = await fetch(`${baseUrl}/v2/bing`)
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('获取必应壁纸失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchInitialWallpaper()
  }, [])

  const handleDownload = () => {
    if (result?.data?.url) {
      const link = document.createElement('a')
      link.href = result.data.url
      link.download = `bing-wallpaper-${result.data.date}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const parameters = [
    { name: 'date', type: 'string', required: false, description: '日期，格式 YYYY-MM-DD，默认今天', example: '2024-01-01' },
    { name: 'mkt', type: 'string', required: false, description: '市场地区代码', example: 'zh-CN' }
  ]

  const examples = [
    {
      title: '今日必应壁纸',
      description: '获取今天的必应每日壁纸',
      url: `${baseUrl}/v2/bing`
    },
    {
      title: '指定日期壁纸',
      description: '获取2024年1月1日的壁纸',
      url: `${baseUrl}/v2/bing?date=2024-01-01`
    },
    {
      title: '中文市场壁纸',
      description: '获取中文市场的壁纸',
      url: `${baseUrl}/v2/bing?mkt=zh-CN`
    }
  ]

  return (
    <ApiPageLayout
      title="必应每日壁纸"
      description="获取必应搜索引擎的每日精美壁纸，包含详细的图片信息和故事背景"
      endpoint="/v2/bing"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              必应每日壁纸
            </CardTitle>
            <CardDescription>
              获取必应搜索引擎的每日精美壁纸
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">指定日期 (可选)</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                  placeholder="留空获取今日壁纸"
                />
              </div>
            </div>

            <Button 
              onClick={handleGetWallpaper} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" />
                  获取壁纸
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 结果展示 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                壁纸详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.code === 200 ? (
                <div className="space-y-6">
                  {/* 壁纸标题和信息 */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {result.data.title}
                    </h3>
                    <p className="text-gray-600">
                      {result.data.copyright}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Calendar className="w-3 h-3 mr-1" />
                        {result.data.date}
                      </Badge>
                    </div>
                  </div>

                  {/* 图片预览 */}
                  <div className="relative">
                    <img
                      src={result.data.url}
                      alt={result.data.title}
                      className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 故事背景 */}
                  {result.data.story && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">背景故事</h4>
                      <p className="text-blue-800 leading-relaxed">
                        {result.data.story}
                      </p>
                    </div>
                  )}

                  {/* 小知识 */}
                  {result.data.quiz && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">小知识</h4>
                      <p className="text-green-800 leading-relaxed">
                        {result.data.quiz}
                      </p>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      下载壁纸
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(result.data.url, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      查看原图
                    </Button>
                  </div>

                  {/* 技术信息 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {result.data.wp !== undefined && (
                      <Badge variant="outline">
                        壁纸: {result.data.wp ? '是' : '否'}
                      </Badge>
                    )}
                    {result.data.hsh && (
                      <Badge variant="outline">
                        Hash: {result.data.hsh.substring(0, 8)}...
                      </Badge>
                    )}
                    {result.data.drk !== undefined && (
                      <Badge variant="outline">
                        暗色: {result.data.drk}
                      </Badge>
                    )}
                    {result.data.top !== undefined && (
                      <Badge variant="outline">
                        顶部: {result.data.top}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取壁纸失败，请检查日期格式或稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default BingWallpaperPage
