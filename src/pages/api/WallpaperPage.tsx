import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Image, Download, RefreshCw, AlertCircle, Eye } from 'lucide-react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { baseUrl } from '@/lib/config'

interface WallpaperResponse {
  code: number
  data: {
    url: string
    width: number
    height: number
    size: string
    format: string
    title?: string
    description?: string
  }
}

const WallpaperPage = () => {
  const [category, setCategory] = useState('random')
  const [result, setResult] = useState<WallpaperResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const categories = [
    { value: 'random', label: '随机壁纸' },
    { value: 'nature', label: '自然风光' },
    { value: 'city', label: '城市建筑' },
    { value: 'abstract', label: '抽象艺术' },
    { value: 'animals', label: '动物' },
    { value: 'space', label: '宇宙星空' },
    { value: 'technology', label: '科技' },
    { value: 'minimal', label: '极简' }
  ]

  const handleGetWallpaper = async () => {
    setLoading(true)
    setImageLoading(true)
    try {
      const url = category === 'random' 
        ? `${baseUrl}/v2/bizhi` 
        : `${baseUrl}/v2/bizhi?category=${category}`
      
      const response = await fetch(url)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取壁纸失败:', error)
      alert('获取壁纸失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result?.data?.url) {
      const link = document.createElement('a')
      link.href = result.data.url
      link.download = `wallpaper-${Date.now()}.${result.data.format || 'jpg'}`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const parameters = [
    { name: 'category', type: 'string', required: false, description: '壁纸分类，如 nature、city、abstract 等', example: 'nature' },
    { name: 'width', type: 'number', required: false, description: '图片宽度', example: '1920' },
    { name: 'height', type: 'number', required: false, description: '图片高度', example: '1080' }
  ]

  const examples = [
    {
      title: '随机壁纸',
      description: '获取一张随机壁纸',
      url: `${baseUrl}/v2/bizhi`
    },
    {
      title: '自然风光壁纸',
      description: '获取自然风光类别的壁纸',
      url: `${baseUrl}/v2/bizhi?category=nature`
    },
    {
      title: '指定分辨率',
      description: '获取1920x1080分辨率的壁纸',
      url: `${baseUrl}/v2/bizhi?width=1920&height=1080`
    }
  ]

  return (
    <ApiPageLayout
      title="随机壁纸"
      description="获取高质量的随机壁纸图片，支持多种分类和自定义分辨率"
      endpoint="/v2/bizhi"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              壁纸生成器
            </CardTitle>
            <CardDescription>
              选择壁纸分类，获取高质量的壁纸图片
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">壁纸分类</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                壁纸预览
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.code === 200 ? (
                <div className="space-y-4">
                  {/* 图片预览 */}
                  <div className="relative">
                    <img
                      src={result.data.url}
                      alt="壁纸预览"
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

                  {/* 图片信息 */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      分辨率: {result.data.width} × {result.data.height}
                    </Badge>
                    <Badge variant="secondary">
                      格式: {result.data.format?.toUpperCase() || 'JPG'}
                    </Badge>
                    {result.data.size && (
                      <Badge variant="secondary">
                        大小: {result.data.size}
                      </Badge>
                    )}
                  </div>

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

                  {/* 标题和描述 */}
                  {(result.data.title || result.data.description) && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                      {result.data.title && (
                        <h3 className="font-semibold text-gray-900">{result.data.title}</h3>
                      )}
                      {result.data.description && (
                        <p className="text-gray-600 text-sm">{result.data.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取壁纸失败，请稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default WallpaperPage
