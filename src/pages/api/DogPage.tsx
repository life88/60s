import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Heart, RefreshCw, AlertCircle, Download, Smile } from 'lucide-react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { baseUrl } from '@/lib/config'

interface DogResponse {
  code: number
  data: {
    url: string
    breed?: string
    subBreed?: string
    width?: number
    height?: number
  }
}

const DogPage = () => {
  const [result, setResult] = useState<DogResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [breed, setBreed] = useState('random')

  const breeds = [
    { value: 'random', label: '随机品种' },
    { value: 'golden', label: '金毛' },
    { value: 'husky', label: '哈士奇' },
    { value: 'labrador', label: '拉布拉多' },
    { value: 'bulldog', label: '斗牛犬' },
    { value: 'poodle', label: '贵宾犬' },
    { value: 'corgi', label: '柯基' },
    { value: 'chihuahua', label: '吉娃娃' },
    { value: 'beagle', label: '比格犬' },
    { value: 'rottweiler', label: '罗威纳' }
  ]

  const handleGetDogImage = async () => {
    setLoading(true)
    setImageLoading(true)
    try {
      const url = breed === 'random' 
        ? `${baseUrl}/v2/dog` 
        : `${baseUrl}/v2/dog?breed=${breed}`
      
      const response = await fetch(url)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取狗狗图片失败:', error)
      alert('获取狗狗图片失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result?.data?.url) {
      const link = document.createElement('a')
      link.href = result.data.url
      link.download = `dog-${breed}-${Date.now()}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const parameters = [
    { name: 'breed', type: 'string', required: false, description: '狗狗品种，如 golden、husky 等', example: 'golden' },
    { name: 'sub_breed', type: 'string', required: false, description: '子品种', example: 'retriever' }
  ]

  const examples = [
    {
      title: '随机狗狗图片',
      description: '获取一张随机的可爱狗狗图片',
      url: `${baseUrl}/v2/dog`
    },
    {
      title: '金毛图片',
      description: '获取金毛犬的图片',
      url: `${baseUrl}/v2/dog?breed=golden`
    },
    {
      title: '哈士奇图片',
      description: '获取哈士奇的图片',
      url: `${baseUrl}/v2/dog?breed=husky`
    }
  ]

  return (
    <ApiPageLayout
      title="可爱狗狗图片"
      description="获取各种品种的可爱狗狗图片，治愈你的心灵"
      endpoint="/v2/dog"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              狗狗图片生成器
            </CardTitle>
            <CardDescription>
              选择你喜欢的狗狗品种，获取超可爱的狗狗图片
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breed">狗狗品种</Label>
                <Select value={breed} onValueChange={setBreed}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {breeds.map((breedOption) => (
                      <SelectItem key={breedOption.value} value={breedOption.value}>
                        {breedOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGetDogImage} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  加载中...
                </>
              ) : (
                <>
                  <Smile className="w-4 h-4 mr-2" />
                  获取可爱狗狗
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
                <Heart className="w-5 h-5 text-pink-500" />
                可爱的狗狗
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.code === 200 ? (
                <div className="space-y-4">
                  {/* 图片预览 */}
                  <div className="relative">
                    <img
                      src={result.data.url}
                      alt="可爱的狗狗"
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

                  {/* 狗狗信息 */}
                  <div className="flex flex-wrap gap-2">
                    {result.data.breed && (
                      <Badge variant="secondary">
                        品种: {result.data.breed}
                      </Badge>
                    )}
                    {result.data.subBreed && (
                      <Badge variant="secondary">
                        子品种: {result.data.subBreed}
                      </Badge>
                    )}
                    {result.data.width && result.data.height && (
                      <Badge variant="secondary">
                        尺寸: {result.data.width} × {result.data.height}
                      </Badge>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button onClick={handleGetDogImage} variant="outline" className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      换一只
                    </Button>
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      下载图片
                    </Button>
                  </div>

                  {/* 可爱提示 */}
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <p className="text-pink-700 text-sm">
                      🐕 每一只狗狗都是独一无二的小天使 🐕
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取狗狗图片失败，请稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default DogPage
