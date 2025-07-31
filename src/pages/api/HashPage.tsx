import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw, Hash, Copy, Check } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const HashPage = () => {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [algorithm, setAlgorithm] = useState('md5')
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      input: string;
      algorithm: string;
      hash: string;
      length: number;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchData = async () => {
    if (!text.trim()) {
      setError('请输入要计算哈希的文本')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseUrl}/v2/hash?text=${encodeURIComponent(text)}&algorithm=${algorithm}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算失败')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const algorithms = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha512', label: 'SHA-512' },
  ]

  const examples = [
    {
      title: "计算MD5哈希",
      description: "计算文本的MD5哈希值",
      url: `${baseUrl}/v2/hash?text=hello&algorithm=md5`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "input": "hello",
    "algorithm": "md5",
    "hash": "5d41402abc4b2a76b9719d911017c592",
    "length": 32
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="哈希计算"
      description="计算文本的各种哈希值，支持 MD5、SHA-1、SHA-256、SHA-512 等算法"
      endpoint="/v2/hash"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            哈希计算器
          </CardTitle>
          <CardDescription>
            输入文本和选择算法来计算哈希值
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">输入文本</Label>
              <Input
                id="text"
                placeholder="输入要计算哈希的文本"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchData()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="algorithm">哈希算法</Label>
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger>
                  <SelectValue placeholder="选择哈希算法" />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map((algo) => (
                    <SelectItem key={algo.value} value={algo.value}>
                      {algo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={fetchData} 
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  计算中...
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 mr-2" />
                  计算哈希
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">计算失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {data && data.data && (
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">输入文本</h4>
                        <p className="text-sm bg-white p-2 rounded border font-mono">
                          {data.data.input}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">算法</h4>
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                          {data.data.algorithm.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-700">哈希值</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(data.data!.hash)}
                            className="h-8"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                已复制
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                复制
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm bg-white p-3 rounded border font-mono break-all">
                          {data.data.hash}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">长度</h4>
                        <span className="text-sm text-gray-600">
                          {data.data.length} 个字符
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 提示</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• MD5: 128位哈希值，常用但不够安全</li>
                    <li>• SHA-1: 160位哈希值，已被认为不安全</li>
                    <li>• SHA-256: 256位哈希值，目前广泛使用且安全</li>
                    <li>• SHA-512: 512位哈希值，更高安全性</li>
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

export default HashPage
